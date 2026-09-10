'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { setCta } from '@/app/helpers/db';
import { type GeotargetOptions } from '@/types/geo';
import ContactLibrary from './ContactLibrary';
import LandingPageSettings from './LandingPageSettings';
import RecipientField from './RecipientField';
import Tooltip from './Tooltip';

interface EditorProps {
  initSlug?: string;
  initMailtoTo?: string[];
  initMailtoCc?: string[];
  initMailtoBcc?: string[];
  initMailtoSubject?: string;
  initMailtoBody?: string;
  initLandingPageGeotargetDistrictTypes?: string[];
  initLandingPageIsPhone?: boolean;
  initLandingPageHeading?: string;
  initLandingPageBody?: string;
}

export default function Editor({
  initSlug = '',
  initMailtoTo = [],
  initMailtoCc = [],
  initMailtoBcc = ['contact@streetsforall.org'],
  initMailtoSubject = '',
  initMailtoBody = '',
  initLandingPageGeotargetDistrictTypes = [],
  initLandingPageIsPhone = true, // Default to displaying phone CTA
  initLandingPageHeading = '',
  initLandingPageBody = '',
}: EditorProps) {
  const [currentSlug, setCurrentSlug] = useState(initSlug);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Email template
  const [mailtoTo, setMailtoTo] = useState<string[]>(initMailtoTo);
  const [mailtoCc, setMailtoCc] = useState<string[]>(initMailtoCc);
  const [mailtoBcc, setMailtoBcc] = useState<string[]>(initMailtoBcc);
  const [mailtoSubject, setMailtoSubject] = useState<string>(initMailtoSubject);
  const [mailtoBody, setMailtoBody] = useState<string>(initMailtoBody);

  // Landing page
  const [
    landingPageGeotargetDistrictTypes,
    setLandingPageGeotargetDistrictTypes,
  ] = useState<string[]>(initLandingPageGeotargetDistrictTypes);
  const [landingPageIsPhone, setLandingPageIsPhone] = useState<boolean>(
    initLandingPageIsPhone,
  );
  const [landingPageHeading, setLandingPageHeading] = useState<string>(
    initLandingPageHeading,
  );
  const [landingPageBody, setLandingPageBody] =
    useState<string>(initLandingPageBody);

  // UI state
  const [showCC, setshowCC] = useState<boolean>(false);
  const [showBcc, setShowBcc] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Calculated values
  const [savedState, setSavedState] = useState<string>(
    // Sort to ignore toggle order
    JSON.stringify(initLandingPageGeotargetDistrictTypes?.sort()) +
      initLandingPageIsPhone +
      initLandingPageHeading +
      initLandingPageBody +
      initMailtoTo +
      initMailtoCc +
      initMailtoBcc +
      initMailtoSubject +
      initMailtoBody,
  );
  const draftState =
    // Sort to ignore toggle order
    JSON.stringify(landingPageGeotargetDistrictTypes.sort()) +
    landingPageIsPhone +
    landingPageHeading +
    landingPageBody +
    mailtoTo +
    mailtoCc +
    mailtoBcc +
    mailtoSubject +
    mailtoBody;
  const mailtoLink = `mailto:${mailtoTo}?&cc=${mailtoCc}&bcc=${mailtoBcc}&subject=${encodeURIComponent(
    mailtoSubject,
  )}&body=${encodeURIComponent(mailtoBody)}`;

  /**
   * Autosave
   */
  // Wait for pause
  const [debouncedDraftState, setDeboucedDraftState] = useState(draftState);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDeboucedDraftState(draftState);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [draftState]);

  // Trigger save
  useEffect(() => {
    async function autosave() {
      await updateDatabase();
    }

    // Only autosave if saved before
    if (currentSlug) {
      autosave();
    }
  }, [debouncedDraftState]);

  /**
   * Warn of unsaved changes
   * The only scenarios this doesn't cover is navigating back on history created by next/navigation
   */
  // Browser-based navigation (e.g., close tab)
  useEffect(() => {
    // If saved, jump to return handler below
    if (savedState == draftState) return;

    function beforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [draftState, isSaving]);

  // For Next.js router-based navigation (e.g., next/navigation), which are not registered as browser events; used in Open button below
  const router = useRouter();

  /**
   * Generate new URL slug or save to database
   */
  async function updateDatabase() {
    // TODO: Clean up potential json escapes

    setError('');
    setIsSaving(true);

    if (!mailtoSubject || !mailtoBody || !landingPageHeading) {
      setError('Please fill in the required fields.');
      setIsSaving(false);

      return;
    }

    // If no slug, create one and add to URL
    let newSlug;
    if (!currentSlug) {
      newSlug = (Math.random() + 1).toString(36).substring(5);

      setCurrentSlug(newSlug);

      // Add to end of existing path
      window.history.pushState(null, '', `${window.location.href}/${newSlug}`);
    }

    // Save to database
    await setCta({
      // Add # symbol when saving
      slug: `#${currentSlug || newSlug}`,
      mailto: {
        to: mailtoTo,
        cc: mailtoCc,
        bcc: mailtoBcc,
        subject: encodeURIComponent(mailtoSubject),
        body: encodeURIComponent(mailtoBody),
      },
      landingPage: {
        // Sort to ignore toggle order
        geotargetDistrictTypes: landingPageGeotargetDistrictTypes.sort(),
        isPhone: landingPageIsPhone,
        heading: landingPageHeading,
        body: landingPageBody,
      },
    });

    // Add local saved state to compare against
    setSavedState(draftState);

    setIsSaving(false);
  }

  /**
   * Copy content to clipboard
   * @param content - Content to copy
   * @param event - Trigger event to update UI
   */
  async function copyTextToClipboard(content, event) {
    event.target.innerText = 'Copied!';

    navigator.clipboard.writeText(content);
  }

  return (
    <>
      <header className="flex justify-between py-8">
        <span className="block self-center bg-black px-3 text-2xl font-bold text-white uppercase">
          SFA CTA Editor
        </span>

        <div className="flex items-center gap-4">
          <span className="flex w-full items-center justify-center gap-1.5 text-sm">
            {isSaving ? (
              <>
                <Icon icon="line-md:loading-loop" />
                Saving...
              </>
            ) : savedState == draftState ? (
              /* Only if saved before */
              currentSlug ? (
                <>
                  <Icon icon="material-symbols:check" />
                  All changes saved
                </>
              ) : null
            ) : (
              <>
                <Icon icon="material-symbols:warning-outline" />
                Unsaved changes
              </>
            )}
          </span>

          <button
            className="submit flex items-center justify-center gap-1.5"
            onClick={() => updateDatabase()}
          >
            <Icon icon="material-symbols:save-outline" />
            Save
          </button>
        </div>
      </header>

      {error && (
        <div className="my-4 rounded-sm bg-red-800 p-2 px-8 text-center text-white">
          {error}
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Left column */}
        <div className="flex w-1/2 flex-col gap-6 border-2 border-black bg-white p-8">
          <h2 className="font-title flex items-center gap-1.5 text-2xl font-bold">
            Email Template
            <Tooltip>
              Preconfigure an email that advocates can use to reach out to their
              legislators/representatives, either by directly providing them
              the&nbsp;
              <span className="font-bold">Mailto link</span>&nbsp;at the bottom
              via a hyperlink or by setting up a landing page that will include
              a hyperlink by default, both of which should automatically
              populate their mail client.
            </Tooltip>
          </h2>

          <div className="flex flex-col gap-6">
            {/* To */}
            <div>
              <div className="flex items-end justify-between">
                <label>To</label>
                <ContactLibrary
                  recipients={mailtoTo}
                  setRecipients={setMailtoTo}
                />
              </div>

              <RecipientField
                thisList={mailtoTo}
                setThisList={setMailtoTo}
                toList={mailtoTo}
                setToList={setMailtoTo}
                ccList={mailtoCc}
                setCcList={setMailtoCc}
                setIsCcVisible={setshowCC}
                bccList={mailtoBcc}
                setBccList={setMailtoBcc}
                setIsBccVisible={setShowBcc}
              />
            </div>

            <div
              className={
                'flex gap-x-4 gap-y-6' + (showCC || showBcc ? ' flex-col' : '')
              }
            >
              {/* CC */}
              <div>
                <label
                  className={
                    'cursor-pointer hover:underline' +
                    (showCC === true ? ' block' : ' inline')
                  }
                  onClick={() => setshowCC(!showCC)}
                >
                  CC
                </label>
                {showCC === true ? (
                  <RecipientField
                    thisList={mailtoCc}
                    setThisList={setMailtoCc}
                    toList={mailtoTo}
                    setToList={setMailtoTo}
                    ccList={mailtoCc}
                    setCcList={setMailtoCc}
                    setIsCcVisible={setshowCC}
                    bccList={mailtoBcc}
                    setBccList={setMailtoBcc}
                    setIsBccVisible={setShowBcc}
                  />
                ) : (
                  ''
                )}
              </div>

              {/* BCC */}
              <div className={showBcc ? 'block' : 'inline'}>
                <label
                  className={
                    'cursor-pointer hover:underline' +
                    (showBcc === true ? ' block' : ' inline')
                  }
                  onClick={() => setShowBcc(!showBcc)}
                >
                  BCC
                </label>
                {showBcc === true ? (
                  <RecipientField
                    thisList={mailtoBcc}
                    setThisList={setMailtoBcc}
                    toList={mailtoTo}
                    setToList={setMailtoTo}
                    ccList={mailtoCc}
                    setCcList={setMailtoCc}
                    setIsCcVisible={setshowCC}
                    bccList={mailtoBcc}
                    setBccList={setMailtoBcc}
                    setIsBccVisible={setShowBcc}
                  />
                ) : (
                  ''
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="email-subject">
                Subject
                <span
                  aria-label="Required"
                  title="Required"
                  className="text-red-500"
                >
                  *
                </span>
              </label>
              <input
                value={decodeURIComponent(mailtoSubject)}
                id="email-subject"
                className="w-full"
                onChange={(e) => {
                  setMailtoSubject(e.target.value);
                }}
                required
              />
            </div>

            {/* Body */}
            <div>
              <label htmlFor="email-body" className="flex items-center gap-1.5">
                Email Body
                <span
                  aria-label="Required"
                  title="Required"
                  className="text-red-500"
                >
                  *
                </span>
              </label>
              <textarea
                value={decodeURIComponent(mailtoBody)}
                id="email-body"
                rows={12}
                className="min-h-80 w-full"
                onChange={(e) => {
                  setMailtoBody(e.target.value);
                }}
                required
              />
            </div>

            {/* Mailto link */}
            <div>
              <label className="font-sans text-sm">Mailto link</label>
              <div className="flex bg-gray-100 p-1">
                <span className="grow overflow-hidden rounded-sm px-2 py-2 font-mono text-sm text-ellipsis whitespace-nowrap">
                  {mailtoLink}
                </span>

                <button
                  aria-label="Copy mailto link to clipboard"
                  className="border-none px-2.5 py-2 hover:bg-black"
                  onClick={(e) => copyTextToClipboard(mailtoLink, e)}
                >
                  <Icon icon="material-symbols:content-copy-outline" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-1/2 max-w-full">
          <LandingPageSettings
            slug={currentSlug}
            geotargetDistrictTypes={
              landingPageGeotargetDistrictTypes as GeotargetOptions[]
            }
            setGeotargetDistrictTypes={setLandingPageGeotargetDistrictTypes}
            isPhone={landingPageIsPhone}
            setIsPhone={setLandingPageIsPhone}
            heading={landingPageHeading}
            setHeading={setLandingPageHeading}
            body={landingPageBody}
            setBody={setLandingPageBody}
          />
        </div>
      </div>

      {/* Open button */}
      <Link
        href="/edit/drafts"
        className="submit fixed bottom-4 left-4 flex items-center justify-center gap-1.5 no-underline"
        onClick={(e) => {
          e.preventDefault();

          // Halt navigation
          if (
            savedState !== draftState &&
            !window.confirm(
              'There are unsaved changes. Are you sure you want to leave?',
            )
          ) {
            return;
          }

          router.push('/edit/drafts');
        }}
      >
        <Icon icon="material-symbols:folder-open-outline" />
        Open
      </Link>
    </>
  );
}
