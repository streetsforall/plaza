import { useEffect, useState } from 'react';
import { Checkbox, Dialog } from 'radix-ui';
import { Icon } from '@iconify/react';
import {
  type ContactsResponse,
  getCityCouncilMembers,
  getMetroBoardMembers,
  getNeighborhoodCouncils,
  getStateLegislators,
} from '@/app/helpers/contacts';

const categories = [
  {
    id: 'la-nc',
    label: 'LA Neighborhood Councils',
    retrieveContacts: () => getNeighborhoodCouncils(),
  },
  {
    id: 'la-metro',
    label: 'Metro',
    retrieveContacts: () => getMetroBoardMembers(),
  },
  {
    id: 'los-angeles',
    label: 'LA City Council',
    retrieveContacts: () => getCityCouncilMembers('los-angeles'),
  },
  {
    id: 'santa-monica',
    label: 'Santa Monica City Council',
    retrieveContacts: () => getCityCouncilMembers('santa-monica'),
  },
  {
    id: 'assembly',
    label: 'State Assembly',
    retrieveContacts: () => getStateLegislators('assembly'),
  },
  {
    id: 'senate',
    label: 'State Senate',
    retrieveContacts: () => getStateLegislators('senate'),
  },
] as const;
type CategoryId = (typeof categories)[number]['id'];

export default function ContactLibrary({ recipients, setRecipients }) {
  const [areDeputiesShown, setAreDeputiesShown] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>('la-nc');
  const [contactsResponse, setContactsResponse] = useState<ContactsResponse>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function updateActiveCategory() {
      setIsLoading(true);

      const activeCategory = categories.find(
        (category) => category.id === activeCategoryId,
      );

      if (!activeCategory) return;

      const data = await activeCategory.retrieveContacts();

      setContactsResponse(data);
      setIsLoading(false);
    }

    updateActiveCategory();
  }, [activeCategoryId]);

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
            <div className="flex flex-col overflow-auto">
              {/* Containing div required for horizontal scroll to work with vertical scroll in modal */}
              <div className="z-10">
                <div
                  aria-label="Legislative body"
                  aria-orientation="horizontal"
                  role="tablist"
                  className="overflow-x-auto whitespace-nowrap"
                >
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      role="tab"
                      data-state={
                        category.id === activeCategoryId ? 'active' : 'inactive'
                      }
                      onClick={() => setActiveCategoryId(category.id)}
                      className="inline-block border-2 border-black bg-white not-last:border-r-0 first:border-l-0 hover:bg-black data-[state=active]:cursor-auto data-[state=active]:border-b-white hover:data-[state=active]:bg-white hover:data-[state=active]:text-black"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-6 p-16">
                  <div className="circle-loader"></div>

                  <p className="text-lg">Loading...</p>
                </div>
              ) : (
                contactsResponse && (
                  <>
                    {/* Toolbar */}
                    <div className="flex items-center justify-between gap-8 border-b-2 p-4">
                      <span className="grow italic">
                        {contactsResponse.updatedAt &&
                          `Last updated ${new Date(
                            contactsResponse.updatedAt,
                          ).toLocaleDateString('en-US')}
                        `}
                      </span>

                      {/* Show deputies */}
                      {(activeCategoryId === 'la-metro' ||
                        activeCategoryId === 'los-angeles') && (
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
                        onClick={() => addAll(contactsResponse.contacts)}
                      >
                        Add All
                      </button>
                    </div>
                    {/* List */}
                    <table className="flex flex-col overflow-auto">
                      <tbody>
                        {contactsResponse.contacts.map((contact) => {
                          return (
                            <tr
                              key={contact.id}
                              className="cursor-pointer leading-normal not-last:border-b-2 hover:bg-black hover:text-white"
                              onClick={() => {
                                updateRecipients(
                                  contact.primaryEmail,
                                  contact.secondaryEmail,
                                );
                              }}
                            >
                              {contact.title && (
                                <td
                                  // Truncate but display on hover
                                  className="max-w-64 overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap"
                                  title={contact.title}
                                >
                                  {contact.title}
                                </td>
                              )}
                              <td
                                // Truncate but display on hover
                                className="max-w-84 overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap"
                                title={contact.name}
                              >
                                {contact.name}
                              </td>
                              <td className="w-[99%] px-4 py-2 whitespace-nowrap">
                                {contact.primaryEmail}
                              </td>
                              {areDeputiesShown && (
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {contact.secondaryEmail}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )
              )}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
