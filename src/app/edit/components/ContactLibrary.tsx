import { useEffect, useState } from 'react';
import { Checkbox, Dialog, Tabs } from 'radix-ui';
import { Icon } from '@iconify/react';
import {
  type Contact,
  getCityCouncilMembers,
  getMetroBoardMembers,
  getNeighborhoodCouncils,
  getStateLegislators,
} from '@/app/helpers/contacts';

interface Category {
  id: string;
  label: string;
  data: Contact[];
  updatedAt?: Date;
}

export default function ContactLibrary({ recipients, setRecipients }) {
  const [areDeputiesShown, setAreDeputiesShown] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadContacts() {
      const losAngelesCityCouncilMembers =
        await getCityCouncilMembers('los-angeles');
      const santaMonicaCityCouncilMembers =
        await getCityCouncilMembers('santa-monica');
      const metroBoardMembers = await getMetroBoardMembers();
      const neighborhoodCouncils = await getNeighborhoodCouncils();
      const stateAssemblyMembers = await getStateLegislators('assembly');
      const stateSenateMembers = await getStateLegislators('senate');

      setCategories([
        {
          id: 'la-nc',
          label: 'LA Neighborhood Councils',
          data: neighborhoodCouncils.contacts,
          updatedAt: neighborhoodCouncils.updatedAt,
        },
        {
          id: 'la-metro',
          label: 'Metro',
          data: metroBoardMembers.contacts,
          updatedAt: metroBoardMembers.updatedAt,
        },
        {
          id: 'los-angeles',
          label: 'LA City Council',
          data: losAngelesCityCouncilMembers.contacts,
          updatedAt: losAngelesCityCouncilMembers.updatedAt,
        },
        {
          id: 'santa-monica',
          label: 'Santa Monica City Council',
          data: santaMonicaCityCouncilMembers.contacts,
          updatedAt: santaMonicaCityCouncilMembers.updatedAt,
        },
        {
          id: 'assembly',
          label: 'State Assembly',
          data: stateAssemblyMembers.contacts,
          updatedAt: stateAssemblyMembers.updatedAt,
        },
        {
          id: 'senate',
          label: 'State Senate',
          data: stateSenateMembers.contacts,
          updatedAt: stateSenateMembers.updatedAt,
        },
      ]);
    }
    loadContacts();
  }, []);

  /**
   * Add all the provided recipients
   * @param data - GeoJSON data object
   */
  function addAll(data) {
    const updatedRecipients = data
      // Filter out vacant
      .filter((contact) => contact.primaryEmail)
      // Combine all emails into a single-level array
      .flatMap((contact) => {
        if (areDeputiesShown && contact.secondaryEmail) {
          // Include deputy email if applicable
          return [contact.primaryEmail, contact.secondaryEmail];
        } else {
          return contact.primaryEmail;
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
              {/* Containing div required for horizontal scroll to work with vertical scroll in modal */}
              <div className="z-10">
                <Tabs.List
                  aria-label="Legislative body"
                  className="overflow-x-auto whitespace-nowrap"
                >
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
              </div>

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
                      {category.updatedAt &&
                        `Last updated ${new Date(
                          category.updatedAt,
                        ).toLocaleDateString('en-US')}
                        `}
                    </span>

                    {/* Show deputies */}
                    {(category.id === 'la-metro' ||
                      category.id === 'los-angeles') && (
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
                              <td
                                // Truncate but display on hover
                                className="max-w-64 overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap"
                                title={feature.title}
                              >
                                {feature.title}
                              </td>
                            )}
                            <td
                              // Truncate but display on hover
                              className="max-w-84 overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap"
                              title={feature.name}
                            >
                              {feature.name}
                            </td>
                            <td className="w-[99%] px-4 py-2 whitespace-nowrap">
                              {feature.primaryEmail}
                            </td>
                            {areDeputiesShown && (
                              <td className="px-4 py-2 whitespace-nowrap">
                                {feature.secondaryEmail}
                              </td>
                            )}
                          </tr>
                        );
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
