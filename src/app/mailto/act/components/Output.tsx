'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { combinedGeo, geo } from '../../helpers/geo';
import { addMailchimp } from '../../helpers/mailchimp';
import legislatorMetadata from '../../data/legislator_meta.json';

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

  // Address lookup
  const [addressSearch, setAddressSearch] = useState<string>();
  const [addressResults, setAddressResults] = useState<any[]>();

  // Update list of addresses when field changes
  useEffect(() => {
    async function getCoords() {
      const body = {
        string: addressSearch,
      };

      const jsonData = await geo(body);
      setAddressResults(jsonData);
    }

    if (addressSearch) {
      getCoords();
    }
  }, [addressSearch]);

  // Geotargeted information
  const [district, setDistrict] = useState<any>();
  const [to, setTo] = useState<string[]>(initTo || []);
  const [phone, setPhone] = useState('');

  const mailtoLink = `mailto:${to}?&cc=${cc}&bcc=${bcc}&subject=${subject}&body=${emailBody}`;

  // Retrieve data based on address
  async function retrieveDistricts(address) {
    setIsLoading(true);

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
      // Clear results list
      setAddressResults([]);

      // Look up for each district type (assembly and/or senate)
      districtLookup?.map(async (districtType) => {
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

          setDistrict(districtData);

          // Add district legislator to recipient list
          setStatus(
            'Finding Address and ' + districtType + ' District Overlap',
          );

          setTo((prevTo) => [
            districtData.properties.person.contactDetails[0].value,
            ...prevTo,
          ]);

          // Retrieve legislator phone number
          // TODO: Retrieve from API
          const legislatorInfo = legislatorMetadata[districtType];

          const matchingFeature = Object.values(legislatorInfo).find(
            (district) =>
              String(district!['District Number'].toLowerCase()) ===
              String(districtData.id.toLowerCase()),
          );

          setPhone(matchingFeature!['Phone Number']);
        } catch (error) {
          console.error('Error fetching data:', error);
        }

        setIsLoading(false);
        setStatus('Email Updated');
      });
    } else {
      setIsLoading(false);
      setStatus("Sorry, looks like you aren't in California! :'(");
    }
  }

  // Render landing page body
  function renderTextWithLinks(text) {
    if (!text) return '';

    const districtData = {
      district: district?.id.toUpperCase(),
      legislator: district?.properties.person.name,
      role: district?.properties.post.role,
    };

    // Replace variables with data
    let processedText = text;
    const variableRegex = /\[\[([^\]]+)\]\]/g;

    processedText = processedText.replace(
      variableRegex,
      (match, variableName) => {
        // Return the data value if exists, otherwise keep original bracket format
        return districtData[variableName] || match;
      },
    );

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
  } else if (districtLookup?.length && !district) {
    /* Address lookup */
    return (
      <>
        <div className="mb-4 flex flex-col gap-1">
          <label htmlFor="address-query">
            Enter your address so we can find the right representative to
            contact:
          </label>

          <div className="flex flex-col gap-2">
            <input
              id="address-query"
              className="w-full rounded border-2 border-stone-300 px-4 py-3 leading-none text-stone-600"
              placeholder="Enter address here"
              onChange={(e) =>
                setAddressSearch(e.target.value + ', California')
              }
            />
            {addressResults?.length ? (
              <ul className="w-full overflow-hidden rounded border-2 border-stone-300">
                {addressResults.map((address, index) => {
                  return (
                    <li key={index}>
                      <button
                        className="w-full cursor-pointer border-b border-dotted border-stone-400 px-4 py-3 text-left text-stone-600 hover:bg-stone-100"
                        data-umami-event="cta_select_address"
                        onClick={() => retrieveDistricts(address)}
                      >
                        {address.properties.full_address}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>

        <span className="block font-mono text-xs text-stone-600">{status}</span>
      </>
    );
  } else {
    return (
      /* If geolocation is disabled or district has been identified */
      <div className="flex flex-col gap-8">
        {/* Legislator info */}
        {district && (
          <div className="border border-dotted border-black p-4 text-stone-500">
            <p>
              You are represented by{' '}
              <span className="font-bold">
                {district?.properties.post.role}{' '}
                {district?.properties.person.name}
              </span>{' '}
              in district{' '}
              <span className="font-bold">{district?.id.toUpperCase()}</span>.
            </p>
          </div>
        )}

        {/* Body */}
        {body && (
          <div className="whitespace-pre-wrap">{renderTextWithLinks(body)}</div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col gap-4">
          {/* Phone CTA - requires geographic legislator lookup */}
          {district && isPhone && phone && (
            <span className="relative flex justify-center gap-1 border border-dotted px-5 py-3 text-xl">
              <div className="absolute top-1 -left-10 -rotate-6 text-5xl">
                👉
              </div>
              <span className="font-bold">Call your representative:</span>
              <a
                className="whitespace-nowrap"
                data-umami-event="cta_click_phone"
                href={'tel:' + phone}
              >
                {phone}
              </a>
            </span>
          )}

          {/* Email CTA */}
          <a
            data-umami-event="cta_click_email"
            href={mailtoLink}
            className="bg-sfa-green relative flex justify-center gap-1 self-center rounded-lg px-5 py-3 text-lg text-white no-underline transition-transform hover:-translate-y-0.75"
          >
            <div className="absolute top-1 -left-10 -rotate-6 text-5xl">👉</div>
            <span className="font-bold whitespace-nowrap">
              Email your representative{' '}
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
