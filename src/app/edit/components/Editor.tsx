'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { setEmailTemplate } from '../../helpers/db';
import ContactLibrary from './ContactLibrary';
import LandingPageSettings from './LandingPageSettings';
import RecipientField from './RecipientField';

interface EditorProps {
  initHash?;
  initReceiverList?;
  initCc?;
  initBcc?;
  initSubject?;
  initBody?;
  initDistrictVar?;
  initIsPhone?;
  initActionable?;
}

export default function Editor({
  initHash = '',
  initReceiverList = [],
  initCc = [],
  initBcc = ['contact@streetsforall.org'],
  initSubject = '',
  initBody = '',
  initDistrictVar = [],
  initIsPhone = true, // Default to displaying phone CTA
  initActionable = { header: '', body: '' },
}: EditorProps) {
  const [currentHash, setCurrentHash] = useState(initHash);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Email template
  const [recieverList, setRecieverList] = useState<string[]>(initReceiverList);
  const [cc, setCc] = useState<string[]>(initCc);
  const [bcc, setBcc] = useState<string[]>(initBcc);
  const [subject, setSubject] = useState<string>(initSubject);
  const [body, setBody] = useState<string>(initBody);

  // Landing page
  const [districtVar, setDistrictVar] = useState<string[]>(initDistrictVar);
  const [isPhone, setPhone] = useState<boolean>(initIsPhone);
  const [actionable, setActionable] = useState<{
    body: string;
    header: string;
  }>(initActionable);

  // UI state
  const [showCC, setshowCC] = useState<boolean>(false);
  const [showBcc, setShowBcc] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Calculated values
  const [savedState, setSavedState] = useState<string>(
    // Sort to ignore toggle order
    JSON.stringify(initDistrictVar?.sort()) +
      JSON.stringify(initActionable) +
      initReceiverList +
      initCc +
      initBcc +
      initSubject +
      initBody +
      initIsPhone,
  );
  const draftState =
    // Sort to ignore toggle order
    JSON.stringify(districtVar.sort()) +
    JSON.stringify(actionable) +
    recieverList +
    cc +
    bcc +
    subject +
    body +
    isPhone;
  const mailtoLink = `mailto:${recieverList}?&cc=${cc}&bcc=${bcc}&subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

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
    if (currentHash) {
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
   * Generate new URL hash or save to database
   */
  async function updateDatabase() {
    // TODO: Clean up potential json escapes

    setError('');
    setIsSaving(true);

    if (!subject || !body || !actionable.header) {
      setError('Please fill in the required fields.');
      setIsSaving(false);

      return;
    }

    // If no hash, create one and add to URL
    let newHash;
    if (!currentHash) {
      newHash = (Math.random() + 1).toString(36).substring(5);

      setCurrentHash(newHash);

      // Add to end of existing path
      window.history.pushState(null, '', `${window.location.href}/${newHash}`);
    }

    // Save to database
    const times = Date.now();

    await setEmailTemplate({
      // Sort to ignore toggle order
      district_var: districtVar.sort(),
      // Add # symbol when saving
      url: `#${currentHash || newHash}`,
      actionable: actionable,
      to: recieverList,
      cc: cc,
      bcc: bcc,
      subject: encodeURIComponent(subject),
      body: encodeURIComponent(body),
      time: new Date(times),
      phone: isPhone,
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
              currentHash ? (
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
          <h2 className="font-title text-2xl font-bold">Mailto</h2>

          <div className="flex flex-col gap-6">
            {/* To */}
            <div>
              <div className="flex items-end justify-between">
                <label>To</label>
                <ContactLibrary
                  recipients={recieverList}
                  setRecipients={setRecieverList}
                />
              </div>

              <RecipientField
                thisList={recieverList}
                setThisList={setRecieverList}
                toList={recieverList}
                setToList={setRecieverList}
                ccList={cc}
                setCcList={setCc}
                setIsCcVisible={setshowCC}
                bccList={bcc}
                setBccList={setBcc}
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
                    thisList={cc}
                    setThisList={setCc}
                    toList={recieverList}
                    setToList={setRecieverList}
                    ccList={cc}
                    setCcList={setCc}
                    setIsCcVisible={setshowCC}
                    bccList={bcc}
                    setBccList={setBcc}
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
                    thisList={bcc}
                    setThisList={setBcc}
                    toList={recieverList}
                    setToList={setRecieverList}
                    ccList={cc}
                    setCcList={setCc}
                    setIsCcVisible={setshowCC}
                    bccList={bcc}
                    setBccList={setBcc}
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
                value={decodeURIComponent(subject)}
                id="email-subject"
                className="w-full"
                onChange={(e) => {
                  setSubject(e.target.value);
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
                value={decodeURIComponent(body)}
                id="email-body"
                rows={12}
                className="min-h-80 w-full"
                onChange={(e) => {
                  setBody(e.target.value);
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
            hash={currentHash}
            legislativeTargets={districtVar}
            setLegislativeTargets={setDistrictVar}
            actionable={actionable}
            setActionable={setActionable}
            isPhone={isPhone}
            setIsPhone={setPhone}
          />

          {/* <Geocoder setRecieverList={setRecieverList} recieverList={recieverList} /> */}
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
