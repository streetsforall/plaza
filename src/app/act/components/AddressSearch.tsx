import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { searchAddress } from '../../helpers/geo';

export default function AddressSearch({ onSelectAddress }) {
  const params = useParams<{ slug: string }>();
  const slug = params.slug[0];

  const [addressQuery, setAddressQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [addressResults, setAddressResults] = useState<GeoJSON.Feature[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Wait for pause
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(addressQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [addressQuery]);

  // Search for address
  useEffect(() => {
    async function getCoords() {
      setIsLoading(true);

      const body = {
        string: debouncedQuery,
      };

      const jsonData = await searchAddress(body);
      setAddressResults(jsonData);
      setIsLoading(false);
    }

    if (debouncedQuery) {
      getCoords();
    }
  }, [debouncedQuery]);

  return (
    <div className="mb-4 flex flex-col gap-1">
      <label htmlFor="address-query">
        Enter your address so we can find the right representative to contact:
      </label>

      <div className="flex flex-col gap-2">
        <input
          id="address-query"
          className="w-full rounded border-2 border-stone-300 px-4 py-3 leading-none text-stone-600"
          placeholder="Enter address here"
          onChange={(e) => setAddressQuery(e.target.value + ', California')}
        />
        {addressResults?.length || isLoading ? (
          <ul className="w-full overflow-hidden rounded border-2 border-stone-300">
            {isLoading && (
              <li className="w-full border-b border-dotted border-stone-400 px-4 py-3 text-left text-stone-600">
                Loading...
              </li>
            )}
            {addressResults?.map((address, index) => {
              return (
                <li key={index}>
                  <button
                    className="w-full cursor-pointer border-b border-dotted border-stone-400 px-4 py-3 text-left text-stone-600 hover:bg-stone-100"
                    data-umami-event="select-address"
                    data-umami-event-slug={slug}
                    onClick={() => onSelectAddress(address)}
                  >
                    {address.properties?.full_address}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
