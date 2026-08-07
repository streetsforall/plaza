'use client';

import { useState } from 'react';
import Image from 'next/image';
import { combinedGeo } from '../../helpers/geo';
import { addMailchimp } from '../../helpers/mailchimp';
import AddressSearch from './AddressSearch';
import legislatorMetadata from '../../data/legislator_meta.json';
import React from 'react';

interface OutputProps {
  actorEmail?: string;
  districtLookup?: string[];
  body?: string;
  isPhone?: boolean | null;
  initTo?: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  emailBody: string;
}

export default function Output({
  actorEmail,
  districtLookup,
  body,
  isPhone,
  initTo,
  cc,
  bcc,
  subject,
  emailBody,
}: OutputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('Waiting for address');

  // Geotargeted information
  const [districts, setDistricts] = useState<any[]>([]);
  const [to, setTo] = useState<string[]>(initTo || []);

  const mailtoLink = `mailto:${to}?&cc=${cc}&bcc=${bcc}&subject=${subject}&body=${emailBody}`;

  // Retrieve data based on address
  async function retrieveDistricts(address) {
    if (!districtLookup) return;

    // Update contact
    if (actorEmail) {
      const mergeFields = {
        ADD_ST: address?.properties?.context?.address?.name || '',
        ADD_CITY: address?.properties?.context?.place?.name || '',
        ADD_ZIP: address?.properties?.context?.postcode?.name || '',
        ADD_STATE: address?.properties?.context?.region?.name || '',
        ADD_COUNTR: address?.properties?.context?.country?.country_code || '',
      };

      try {
        addMailchimp(
          decodeURIComponent(decodeURIComponent(actorEmail)), // email from url
          mergeFields,
        );
      } catch (error) {
        console.error('Error updating Mailchimp:', error);
      }
    }

    // Ensure actor is in California
    if (address.properties.context.region.name == 'California') {
      setIsLoading(true);

      // Look up for each district type (assembly and/or senate)
      for (const districtType of districtLookup) {
        try {
          // Identify district based on address
          setStatus(
            `Loading ${districtType} District for ${address.properties.full_address}`,
          );

          const coords = [
            address.properties.coordinates.longitude,
            address.properties.coordinates.latitude,
          ];

          const districtData: any = await combinedGeo(
            districtType,
            coords,
            true,
          );

          // Retrieve legislator phone number
          // TODO: Retrieve from API
          const legislatorInfo = legislatorMetadata[districtType];

          const matchingFeature = Object.values(legislatorInfo).find(
            (district) =>
              String(district!['District Number'].toLowerCase()) ===
              String(districtData.id.toLowerCase()),
          );

          // Append phone number to feature
          districtData.properties.phone = matchingFeature!['Phone Number'];

          setDistricts((prevDistricts) => [districtData, ...prevDistricts]);

          // Add district legislator to recipient list
          setStatus(
            'Finding Address and ' + districtType + ' District Overlap',
          );

          setTo((prevTo) => [
            districtData.properties.person.contactDetails[0].value,
            ...prevTo,
          ]);
        } catch (error) {
          console.error('Error fetching data:', error);
        }

        setStatus('Email Updated');
      }

      setIsLoading(false);
    } else {
      setStatus("Sorry, looks like you aren't in California! :'(");
    }
  }

  // Render landing page body and substitute any variables with district info
  function renderTextWithLinks(text) {
    if (!text) return '';

    let processedText = text;
    const variableRegex = /\[\[([^\]]+)\]\]/g;

    // Insert district info
    if (districts.length) {
      // If multiple districts, list in brackets
      const districtData =
        districts.length > 1
          ? {
              district:
                '[' +
                districts
                  .map((district) => district.id.toUpperCase())
                  .join(' or ') +
                ']',
              legislator:
                '[' +
                districts
                  .map((district) => district.properties.person.name)
                  .join(' or ') +
                ']',
              role:
                '[' +
                districts
                  .map((district) => district.properties.post.role)
                  .join(' and ') +
                ']',
            }
          : {
              district: districts[0].id.toUpperCase(),
              legislator: districts[0].properties.person.name,
              role: districts[0].properties.post.role,
            };

      // Replace variables with data
      processedText = processedText.replace(
        variableRegex,
        (match, variableName) => {
          // Return the data value if exists, otherwise keep original bracket format
          return districtData[variableName] || match;
        },
      );
    }

    // Handle URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = processedText.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // Clean up display text by removing protocol and www
        const displayText = part
          .replace(/^https?:\/\//, '') // Remove http:// or https://
          .replace(/^www\./, ''); // Remove www.

        return (
          <a
            key={index}
            href={part} // Keep original URL for actual link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {displayText}
          </a>
        );
      }

      return part;
    });
  }

  if (isLoading) {
    /* Loading animation */
    return (
      <div className="text-blue pt-8 text-center">
        <Image
          src="/images/bus.png"
          alt="Animated bus"
          height={0}
          width={160}
          className="loader mb-4 h-auto"
        />
        <span className="mb-1 block text-2xl italic">
          Finding your representative...
        </span>
        <span className="mb-12 block text-sm">(This may take a moment.)</span>

        <span className="block text-left font-mono text-xs text-stone-600">
          {status}
        </span>
      </div>
    );
  } else if (districtLookup?.length && !districts.length) {
    /* Address lookup */
    return (
      <>
        <AddressSearch onSelectAddress={retrieveDistricts} />

        <span className="block font-mono text-xs text-stone-600">{status}</span>
      </>
    );
  } else {
    return (
      /* If geolocation is disabled or district has been identified */
      <div className="flex flex-col gap-8">
        {/* Legislator info */}
        {districts.length ? (
          <div className="border border-dotted border-black p-4 text-stone-500">
            <p>
              You are represented by{' '}
              {
                /* List district info */
                districts.map((district, index) => (
                  <React.Fragment key={index}>
                    <span className="font-bold">
                      {`${district.properties.post.role} ${district.properties.person.name}`}
                    </span>{' '}
                    in district{' '}
                    <span className="font-bold">
                      {district?.id.toUpperCase()}
                    </span>
                    {
                      /* Separate with 'and' if more than one */
                      index < districts.length - 1 ? ' and ' : null
                    }
                  </React.Fragment>
                ))
              }
              .
            </p>
          </div>
        ) : null}

        {/* Body */}
        {body && (
          <div className="whitespace-pre-wrap">{renderTextWithLinks(body)}</div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col gap-4">
          {/* Phone CTA - requires geographic legislator lookup */}
          {districts.length && isPhone
            ? districts.map((district, i) => (
                <span
                  key={i}
                  className="relative flex justify-center gap-1 border border-dotted px-5 py-3 text-xl"
                >
                  <div className="absolute top-1 -left-10 -rotate-6 text-5xl">
                    👉
                  </div>
                  <span className="font-bold">
                    {
                      /* If multiple, include names */
                      districts.length > 1
                        ? `Call ${district.properties.post.role} ${district.properties.person.name}:`
                        : 'Call your representative:'
                    }
                  </span>
                  <a
                    className="whitespace-nowrap"
                    data-umami-event="cta_click_phone"
                    href={'tel:' + district.properties.phone}
                  >
                    {district.properties.phone}
                  </a>
                </span>
              ))
            : null}

          {/* Email CTA */}
          <a
            data-umami-event="cta_click_email"
            href={mailtoLink}
            className="bg-sfa-green relative flex justify-center gap-1 self-center rounded-lg px-5 py-3 text-lg text-white no-underline transition-transform hover:-translate-y-0.75"
          >
            <div className="absolute top-1 -left-10 -rotate-6 text-5xl">👉</div>
            <span className="font-bold whitespace-nowrap">
              Email your{' '}
              {districts.length > 1 ? 'representatives' : 'representative'}
            </span>
            <span className="whitespace-nowrap">(Customize the bottom)</span>
          </a>
        </div>

        {/* Mailto link */}
        <div className="border-t border-dotted border-stone-500 pt-4 wrap-break-word">
          <details className="text-xs text-stone-500">
            <summary className="cursor-pointer">Mailto Link</summary>
            <div className="mt-4 rounded bg-stone-100 p-2 font-mono text-xs">
              {mailtoLink}
            </div>
          </details>
        </div>
      </div>
    );
  }
}
