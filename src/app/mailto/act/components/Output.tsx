'use client';

import { useEffect, useState } from 'react';
import { combinedGeo, geo } from '../../helpers/geo';
import { addMailchimp } from '../../helpers/mailchimp';
import metadata from '../../data/memeber_meta.json';

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
  const [status, setStatus] = useState<string>('Waiting for street address');

  // Address lookup
  const [addressSearch, setAddressSearch] = useState<string>();
  const [addressResults, setAddressResults] = useState<any>();

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

  const [selectedAddress, setSelectedAddress] = useState<any[]>();
  const [district, setDistrict] = useState<any>();
  const [to, setTo] = useState<string[]>(initTo || []);
  const [phone, setPhone] = useState('');
  const [generateToggle, setGenerateToggle] = useState<any>(false);

  const mailtoLink = `mailto:${to}?&cc=${cc}&bcc=${bcc}&subject=${subject}&body=${emailBody}`;

  // Retrieve data based on address
  async function retrieveDistricts(address) {
    setIsLoading(true);

    setSelectedAddress(address);

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
            'Loading ' + districtType + ' Districts (might take a few seconds)',
          );

          const coords = [
            address.properties.coordinates.longitude,
            address.properties.coordinates.latitude,
          ];

          const geo_data: any = await combinedGeo(districtType, coords, true);

          setDistrict(geo_data);

          // Add district legislator to recipient list
          setStatus(
            'Finding Address and ' + districtType + ' District Overlap',
          );

          setTo((prevTo) => [
            geo_data.properties.person.contactDetails[0].value,
            ...prevTo,
          ]);

          // Retrieve legislator phone number
          // TODO: Retrieve from API
          const legislatorInfo = metadata[districtType];

          const matchingFeature = Object.values(legislatorInfo).find(
            (district) =>
              String(district!['District Number'].toLowerCase()) ===
              String(geo_data.id.toLowerCase()),
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

  return (
    <>
      {districtLookup?.length && !district ? (
        <>
          <p>
            Enter your home address below so we can find the right
            representative to contact:
          </p>

          <div>
            <input
              className="w-[calc(100%-1rem)] text-base md:text-xl"
              placeholder="enter address here"
              onChange={(e) =>
                setAddressSearch(e.target.value + ', California')
              }
            />
            <div>
              {addressResults
                ? addressResults.map((address, index) => {
                    return (
                      <button
                        className="!bg-bg hover:!bg-edit !border-button w-full !border-b px-0 py-2 text-left text-base md:text-lg"
                        data-umami-event="cta_select_address"
                        key={index}
                        onClick={() => retrieveDistricts(address)}
                      >
                        {address.properties.full_address}
                      </button>
                    );
                  })
                : ''}
            </div>
          </div>

          <label>{status}</label>
          <label>
            {selectedAddress
              ? 'Address: ' + selectedAddress['properties'].full_address
              : ''}
          </label>
        </>
      ) : (
        <div>
          {/* Legislator info */}
          {district && (
            <div className="mb-8 border border-dotted border-black p-4">
              <span>
                {`You are represented by ${district?.properties.post.role} ${
                  district?.properties.person.name
                } in district ${district?.id.toUpperCase()}`}{' '}
              </span>
            </div>
          )}

          {/* Body */}
          {body && (
            <p className="pb-8 whitespace-pre-wrap text-[#575757]">
              {renderTextWithLinks(body)}
            </p>
          )}

          {/* Phone CTA - requires geographic legislator lookup */}
          {district && isPhone && (
            <div className="bg-edit relative mb-8 border border-dotted border-black p-4">
              <div className="absolute top-0 -left-10 mt-3 -rotate-6 text-5xl">
                👉
              </div>
              <b>Call your representative: </b>
              <a
                className="whitespace-nowrap"
                data-umami-event="cta_click_phone"
                href={'tel:' + phone}
              >
                {phone}
              </a>
            </div>
          )}

          {/* Email CTA */}
          <div className="bg-edit relative mb-8 border border-dotted border-black p-4">
            <div className="absolute top-0 -left-10 mt-3 -rotate-6 text-5xl">
              👉
            </div>
            <a href={mailtoLink}>
              <button
                data-umami-event="cta_click_email"
                className="rounded-2xl !border !border-[rgb(44,168,127)] !bg-[aquamarine] px-3 py-2 text-xl text-black hover:!bg-[rgb(44,168,127)] hover:text-white"
              >
                <b className="whitespace-nowrap">Email your representative </b>
                <span className="whitespace-nowrap">
                  (Customize the bottom)
                </span>
              </button>
            </a>
          </div>

          {/* Mailto link */}
          <div className="mt-4 border-t border-dotted border-gray-400 pt-4 wrap-break-word">
            <label>
              {' '}
              <div onClick={() => setGenerateToggle(!generateToggle)}>
                {generateToggle ? '▼' : '▶'} Mailto Link
              </div>
              {generateToggle ? (
                <div className="bg-edit mt-2 rounded p-2 text-xs">
                  {mailtoLink}
                </div>
              ) : (
                ''
              )}
            </label>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="loader">
          <img src="/images/bus.png" />
          Calculating Your Representative
          <label>(this may take a moment)</label>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
