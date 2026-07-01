import React, { useState } from 'react';
import { Checkbox, Dialog, Tabs } from 'radix-ui';
import { Icon } from '@iconify/react';
import { geoLoader } from '../helpers/geo';
import neighborhoods from '../data/LA_Neighborhood_Councils.json';
import metro from '../data/metro.json';
import cds from '../data/LA_City_Council_Districts.json';
//import assembly from '../data/CA_Assembly_Districts.json';
import senate from '../data/CA_Senate_Districts.json';
import Santa_Monica from '../data/Santa_Monica.json';

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

export default function ContactLibrary({ recipients, setRecipients }) {
  const [areDeputiesShown, setAreDeputiesShown] = useState(false);

  const categories = [
    {
      id: 'nc',
      label: 'LA Neighborhood Councils',
      data: neighborhoods.features,
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
  ];

  // TODO: Rewrite this whole componenet to injest from our API
  // const geodata = geoLoader(e, false);

  /**
   * Add all the provided recipients
   * @param data - GeoJSON data object
   */
  function addAll(data) {
    const updatedRecipients = data.flatMap((feature) => {
      if (areDeputiesShown && feature.properties.Deputy) {
        // Include deputy email if applicable
        return [feature.properties.DEMAIL, feature.properties.Deputy];
      } else {
        return feature.properties.DEMAIL;
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
        <Dialog.Content className="fixed top-1/2 left-1/2 flex max-h-[85vh] w-3xl max-w-screen -translate-x-1/2 -translate-y-1/2 flex-col overflow-auto border-2 bg-white">
          <Dialog.Close
            className="absolute top-2.5 right-2.5 inline-flex size-[25px] items-center justify-center border-none p-0 text-2xl"
            aria-label="Close"
          >
            <Icon icon="material-symbols:close" />
          </Dialog.Close>

          <header className="flex flex-col gap-4 p-8">
            <Dialog.Title className="text-xl font-bold">
              Contact Library
            </Dialog.Title>

            <Dialog.Description className="text-gray-400 italic">
              NOTE: These have not been updated post-November 2024 election.
            </Dialog.Description>
          </header>

          {/* Tabs */}
          <Tabs.Root
            defaultValue={categories[0].id}
            className="flex flex-col overflow-auto"
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
                <div className="flex justify-between border-b-2 p-4">
                  <button className="" onClick={() => addAll(category.data)}>
                    Add All
                  </button>

                  {/* Show deputies */}
                  {category.id === 'metro' && (
                    <div className="flex items-center gap-2.5">
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
                </div>

                {/* List */}
                <table className="flex flex-col overflow-auto">
                  <tbody>
                    {category.data.map((feature, index) => {
                      if (feature.properties.DEMAIL) {
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
                      }
                    })}
                  </tbody>
                </table>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
