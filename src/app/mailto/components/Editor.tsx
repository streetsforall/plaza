'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { setEmailTemplate } from '../helpers/db';
import ContactLibrary from '../components/ContactLibrary';
import LandingPageSettings from '../components/LandingPageSettings';
import RecipientField from '../components/RecipientField';

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
  initHash,
  initReceiverList,
  initCc,
  initBcc,
  initSubject,
  initBody,
  initDistrictVar,
  initIsPhone,
  initActionable,
}: EditorProps) {
  const [currentHash, setCurrentHash] = useState(initHash || '');

  // Email template
  const [recieverList, setRecieverList] = useState<string[]>(
    initReceiverList || [],
  );
  const [cc, setCc] = useState<string[]>(initCc || []);
  const [bcc, setBcc] = useState<string[]>(
    initBcc || ['contact@streetsforall.org'],
  );
  const [subject, setSubject] = useState<string>(initSubject || '');
  const [body, setBody] = useState<string>(initBody || '');

  // Landing page
  const [districtVar, setDistrictVar] = useState<string[]>(
    initDistrictVar || [],
  );
  const [isPhone, setPhone] = useState<boolean>(initIsPhone || true); // Default to displaying phone CTA
  const [actionable, setActionable] = useState<{
    body: string;
    header: string;
  }>(initActionable || { body: '', header: '' });

  // UI state
  const [showCC, setshowCC] = useState<boolean>(false);
  const [showBcc, setShowBcc] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Calculated values
  const [savedState, setSavedState] = useState<string>(
    JSON.stringify(initDistrictVar) +
      JSON.stringify(initActionable) +
      initReceiverList +
      initCc +
      initBcc +
      initSubject +
      initBody +
      initIsPhone,
  );
  const draftState =
    JSON.stringify(districtVar) +
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
   * Generate new URL hash or save to database
   */
  async function updateDatabase() {
    // TODO: Clean up potential json escapes

    setError('');

    if (!subject || !body || !actionable.header) {
      setError('Please fill in the required fields.');

      return;
    }

    // If no hash, create one and add to URL
    let newHash;
    if (!currentHash) {
      newHash = (Math.random() + 1).toString(36).substring(5);

      setCurrentHash(newHash);
      window.history.pushState(null, '', `/mailto/${newHash}`);
    }

    // Save to database
    const times = Date.now();

    setEmailTemplate({
      district_var: districtVar,
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
          SFA Mailto Tool
        </span>

        <div className="flex items-center gap-4">
          <span className="flex w-full items-center justify-center gap-1.5 text-sm">
            {currentHash && savedState == draftState ? (
              <>
                <Icon icon="material-symbols:check" />
                All changes saved
              </>
            ) : (
              <>
                <Icon icon="material-symbols:exclamation" />
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
                className="min-h-96 w-full"
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
        href="/mailto/drafts"
        className="submit fixed bottom-4 left-4 flex items-center justify-center gap-1.5 no-underline"
      >
        <Icon icon="material-symbols:folder-open-outline" />
        Open
      </Link>
    </>
  );
}
