import React, { useEffect, useState } from 'react';
import { Checkbox, Dialog, Tabs } from 'radix-ui';
import { Icon } from '@iconify/react';
import { geoLoader } from '../../helpers/geo';
import metro from '../../data/metro.json';
import cds from '../../data/LA_City_Council_Districts.json';
//import assembly from '../data/CA_Assembly_Districts.json';
import senate from '../../data/CA_Senate_Districts.json';
import Santa_Monica from '../../data/Santa_Monica.json';
import { getNeighborhoodCouncils } from '@/app/helpers/contacts';

interface datafeatures {
  OBJECTID: number;
  NAME: string;
  WADDRESS: string;
  DWEBSITE: string;
  DEMAIL: string;
  DPHONE: string;
  NC_ID: number;
  CERTIFIED: string;
  TOOLTIP: string;
  NLA_URL: string;
  SERVICE_RE: string;
}

interface Category {
  id: string;
  label: string;
  data:
    | GeoJSON.Feature[]
    | {
        updatedAt: Date;
        contacts: Contact[];
      };
  updatedAt?: Date;
}

interface Contact {
  id: string;
  title: string;
  name: string;
  primaryEmail: string;
  secondaryEmail: string;
}

export default function ContactLibrary({ recipients, setRecipients }) {
  const [areDeputiesShown, setAreDeputiesShown] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadContacts() {
      const neighborhoodCouncils = await getNeighborhoodCouncils();

      setCategories([
        {
          id: 'nc',
          label: 'LA Neighborhood Councils',
          data: neighborhoodCouncils.contacts,
          updatedAt: neighborhoodCouncils.updatedAt,
        },
        /*{
        id: 'cd',
        label: 'LA City Council',
        data: cds.features,
      },*/
        {
          id: 'metro',
          label: 'Metro',
          data: metro.features,
        },
        {
          id: 'santamonica',
          label: 'Santa Monica',
          data: Santa_Monica.features,
        },
        /*{
        id: 'assembly',
        label: 'Assembly',
        data: assembly.features,
      },
      {
        id: 'senate',
        label: 'Senate',
        data: senate.features,
      }*/
      ]);
    }
    loadContacts();
  }, []);

  // TODO: Rewrite this whole componenet to injest from our API
  // const geodata = geoLoader(e, false);

  /**
   * Add all the provided recipients
   * @param data - GeoJSON data object
   */
  function addAll(data) {
    const updatedRecipients = data.flatMap((feature) => {
      if (feature.properties) {
        // Raw feature from GeoJSON (old)
        if (areDeputiesShown && feature.properties.Deputy) {
          // Include deputy email if applicable
          return [feature.properties.DEMAIL, feature.properties.Deputy];
        } else {
          return feature.properties.DEMAIL;
        }
      } else {
        // Parsed contact from API (new)
        if (areDeputiesShown && feature.secondaryEmail) {
          // Include deputy email if applicable
          return [feature.primaryEmailL, feature.secondaryEmail];
        } else {
          return feature.primaryEmail;
        }
      }
    });

    // Replace the existing list, not append to it
    setRecipients(updatedRecipients);
  }

  /**
   * Add/remove recipients
   * @param contactEmail - Primary contact email
   * @param deputyEmail - Deputy email if applicable
   */
  function updateRecipients(contactEmail, deputyEmail) {
    const selectedEmails = [contactEmail];

    // Include deputy email if applicable
    if (areDeputiesShown && deputyEmail) {
      selectedEmails.push(deputyEmail);
    }

    const updatedRecipients = Array.from(recipients);

    selectedEmails.forEach((email) => {
      if (!updatedRecipients.includes(email)) {
        updatedRecipients.push(email);
      } else {
        updatedRecipients.splice(updatedRecipients.indexOf(email), 1);
      }
    });

    setRecipients(updatedRecipients);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex items-center justify-center gap-1.5 border-none hover:bg-transparent hover:text-black hover:underline">
        <Icon icon="material-symbols:work-outline" /> Contact library
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-white opacity-50" />
        {/* flex flex-col overflow-auto - all the way down to make "sticky" header work*/}
        <Dialog.Content className="fixed top-1/2 left-1/2 z-10 flex max-h-[85vh] w-3xl max-w-screen -translate-x-1/2 -translate-y-1/2 flex-col overflow-auto border-2 bg-white">
          <Dialog.Close
            className="absolute top-2.5 right-2.5 inline-flex size-6.25 items-center justify-center border-none p-0 text-2xl"
            aria-label="Close"
          >
            <Icon icon="material-symbols:close" />
          </Dialog.Close>

          <header className="flex flex-col gap-4 p-8">
            <Dialog.Title className="text-xl font-bold">
              Contact Library
            </Dialog.Title>
          </header>

          {/* Tabs */}
          {categories.length ? (
            <Tabs.Root
              defaultValue={categories[0].id}
              className="flex flex-col overflow-auto"
              onValueChange={(test) => {
                console.log(test);
              }}
            >
              <Tabs.List aria-label="Legislative body" className="z-10">
                {categories.map((category) => (
                  <Tabs.Trigger
                    key={category.id}
                    value={category.id}
                    className="border-2 border-black bg-white not-last:border-r-0 first:border-l-0 hover:bg-black data-[state=active]:cursor-auto data-[state=active]:border-b-white hover:data-[state=active]:bg-white hover:data-[state=active]:text-black"
                  >
                    {category.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              {/* Content */}
              {categories.map((category) => (
                <Tabs.Content
                  key={category.id}
                  value={category.id}
                  className="-mt-0.5 flex flex-col overflow-auto border-t-2 border-black bg-white text-sm"
                >
                  {/* Toolbar */}
                  <div className="flex items-center justify-between gap-8 border-b-2 p-4">
                    <span className="grow italic">
                      {category.updatedAt
                        ? `Last updated ${new Date(
                            category.updatedAt,
                          ).toLocaleDateString('en-US')}
                        `
                        : 'NOTE: These have not been updated post-November 2024 election.'}
                    </span>

                    {/* Show deputies */}
                    {category.id === 'metro' && (
                      <div className="flex items-center gap-2.5 whitespace-nowrap">
                        <Checkbox.Root
                          id="deputies"
                          checked={areDeputiesShown}
                          onCheckedChange={() => {
                            setAreDeputiesShown(!areDeputiesShown);
                          }}
                          className="flex size-6 items-center justify-center border-2 border-black p-0"
                        >
                          <Checkbox.Indicator>
                            <Icon icon="material-symbols:check" />
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                        <label htmlFor="deputies">Show deputies</label>
                      </div>
                    )}

                    <button
                      className="whitespace-nowrap"
                      onClick={() => addAll(category.data)}
                    >
                      Add All
                    </button>
                  </div>
                  {/* List */}
                  <table className="flex flex-col overflow-auto">
                    <tbody>
                      {category.data.map((feature, index) => {
                        if (feature.properties) {
                          // Raw feature from GeoJSON (old)
                          return (
                            <tr
                              key={index}
                              data-email={feature.properties.DEMAIL}
                              className="cursor-pointer leading-normal not-last:border-b-2 hover:bg-black hover:text-white"
                              onClick={() => {
                                updateRecipients(
                                  feature.properties.DEMAIL,
                                  feature.properties.Deputy,
                                );
                              }}
                            >
                              {feature.properties.District && (
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {feature.properties.District}
                                </td>
                              )}
                              <td className="px-4 py-2 whitespace-nowrap">
                                {feature.properties.NAME}
                              </td>
                              <td className="w-[99%] px-4 py-2">
                                {feature.properties.DEMAIL}
                              </td>
                              <td className="px-4 py-2">
                                {areDeputiesShown && feature.properties.Deputy}
                              </td>
                            </tr>
                          );
                        } else {
                          // Parsed contact from API (new)
                          return (
                            <tr
                              key={index}
                              className="cursor-pointer leading-normal not-last:border-b-2 hover:bg-black hover:text-white"
                              onClick={() => {
                                updateRecipients(
                                  feature.primaryEmail,
                                  feature.secondaryEmail,
                                );
                              }}
                            >
                              {feature.title && (
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {feature.title}
                                </td>
                              )}
                              <td className="px-4 py-2 whitespace-nowrap">
                                {feature.name}
                              </td>
                              <td className="w-[99%] px-4 py-2">
                                {feature.primaryEmail}
                              </td>
                              {areDeputiesShown && (
                                <td className="px-4 py-2">
                                  {feature.secondaryEmail}
                                </td>
                              )}
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                </Tabs.Content>
              ))}
            </Tabs.Root>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
