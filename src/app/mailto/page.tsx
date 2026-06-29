'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
// import Geocoder from './components/geocoder'
import ContactLibrary from './components/ContactLibrary';
import LandingPageSettings from './components/LandingPageSettings';
import RecipientField from './components/RecipientField';
import { setEmailTemplate } from './helpers/db';
import { textEncoding, textEscapes } from './helpers/text_cleanup';
import { validateString } from './helpers/validator';
import LoginPage from './components/LoginPage';

interface SavedEmail {
  body?: string;
  subject?: string;
  bcc?: string[];
  cc?: string[];
  actionable?: { body: string; header: string };
  shareable?: boolean;
  district_var?: any[];
  to?: any[];
  phone?: boolean;
}

export default function Page() {
  // Email template
  const [body, setBody] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [recieverList, setRecieverList] = useState<any[]>([]);
  const [isShareable, setIsShareable] = useState<boolean>(false);
  const [districtVar, setDistrictVar] = useState<any[]>([]);
  const [actionable, setActionable] = useState<{
    body: string;
    header: string;
  }>({ body: '', header: '' });
  const [cc, setCC] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>(['contact@streetsforall.org']);
  const [load, setLoad] = useState<any>({});
  const [saved, setSaved] = useState<any>({});
  const [isPhone, setPhone] = useState<boolean>(true); // Default to displaying phone CTA
  const [match, setMatch] = useState<SavedEmail | null>(null); // This is the key fix!

  // UI state
  const [validated, setValidated] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [mailtoLink, setMailtoLink] = useState<string>('');
  const [hash, setHash] = useState<string>();
  const [copy, setCopy] = useState<string>('');
  const [showGeo, setshowGeo] = useState<boolean>(false);
  const [showCC, setshowCC] = useState<boolean>(false);
  const [showBcc, setShowBcc] = useState<boolean>(false);
  const [feed, setFeed] = useState<boolean>(false);
  const [error, setError] = useState('');

  const pwdInputRef = useRef<HTMLInputElement>(null);

  /**
   * Validate password and load saved email template
   */
  async function validate(event) {
    event.preventDefault();

    const supplied = pwdInputRef.current?.value;

    const auth = await validateString(supplied, window.location.hash);

    setMatch(auth['emails'] as SavedEmail | null); // Type assertion here
    setValidated(auth['valid']);
  }

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

    if (!hash) {
      // If no hash, create one and add to URL
      var url = '#' + (Math.random() + 1).toString(36).substring(5);

      setHash(url);
      window.location.hash = url;
    } else {
      // Save to database
      setEmailTemplate(load);

      // Add local saved state to compare against
      setSaved(load);
    }
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

  // script to delete on keypress but kinda nasty ew
  // window.addEventListener('keydown', (e) => {
  //    if (e.repeat) return;
  //    console.log('fire')
  //    // Check for allowed keys on keydown
  //    if (e.key === "Backspace" || e.key === "Delete") {
  //       var current_focus = document.activeElement
  //       console.log(current_focus)
  //       if (current_focus.classList.contains('recipient')) {
  //          var content = current_focus.firstChild.textContent
  //          console.log(content)
  //          var form = current_focus.parentElement.id
  //          if (form == 'to') {remove(content, recieverList, setRecieverList)} else
  //          if (form == 'cc') {remove(content, cc, setCC)} else
  //          if (form == 'bcc') {remove(content, bcc, setBcc)}
  //       }
  //    }
  //  });

  /**
   * Load data from saved template
   */
  useEffect(() => {
    if (validated) {
      if (hash && match) {
        // Now TypeScript knows about these properties
        setBody(match.body ? decodeURIComponent(match.body) : '');
        setSubject(match.subject ? decodeURIComponent(match.subject) : '');
        setBcc(match.bcc || []);
        setCC(match.cc || []);
        setActionable(match.actionable || { body: '', header: '' });
        setIsShareable(match.shareable || false);
        setDistrictVar(match.district_var || []);
        setRecieverList(match.to || []);
        setPhone(match.phone || false);
      }
      setMounted(true);
    }

    setSaved(load);
    setHash(window.location.hash);
  }, [validated]);

  /**
   * Update data whenever a change is made
   */
  useEffect(() => {
    const times = Date.now();

    setLoad({
      shareable: isShareable,
      district_var: districtVar,
      url: hash,
      actionable: actionable,
      to: recieverList,
      cc: cc,
      bcc: bcc,
      subject: encodeURIComponent(subject),
      body: encodeURIComponent(body),
      time: new Date(times),
      phone: isPhone,
    });

    setMailtoLink(
      `mailto:${recieverList}?&cc=${cc}&bcc=${bcc}&subject=${encodeURIComponent(
        subject,
      )}&body=${body}`,
    );
  }, [
    recieverList,
    actionable,
    cc,
    bcc,
    body,
    hash,
    subject,
    isShareable,
    districtVar,
    isPhone,
  ]);

  return validated ? (
    <div>
      {error && <div className="text-center text-red-500">{error}</div>}

      <div className="mb-4 flex justify-between">
        {/* Save/copy link button */}
        {hash ? (
          <div className="flex w-1/2 max-w-max min-w-40 flex-col justify-end">
            <div className="mb-2 min-w-full">
              <button
                className="bg-button m-1 w-full cursor-pointer rounded px-2 py-1 hover:underline"
                onClick={(e) => copyTextToClipboard(window.location.href, e)}
              >
                Copy Editable Link
              </button>
            </div>
            <div className="border-button mb-2 min-w-full rounded-lg border">
              <button
                className="m-1 rounded px-2 py-1 hover:underline"
                onClick={() => updateDatabase()}
              >
                Save Page
              </button>

              <label
                className={
                  'm-1 rounded px-2 py-1 !text-black' +
                  (saved == load
                    ? ' border-[green] bg-[rgb(128,231,128)]'
                    : ' border-[red] bg-[rgb(243,156,156)]')
                }
              >
                {saved == load ? '✅ up to date' : '❗ unsaved changes'}
              </label>
            </div>
          </div>
        ) : (
          <div className="flex w-1/2 max-w-max min-w-40 flex-col justify-end">
            <button
              className="m-1 rounded px-2 py-1 hover:underline"
              onClick={() => updateDatabase()}
            >
              Save Draft
            </button>
          </div>
        )}
      </div>

      <div className="container m-auto flex gap-4">
        <div className="w-1/2 max-w-full">
          <LandingPageSettings
            hash={hash}
            legislativeTargets={districtVar}
            setLegislativeTargets={setDistrictVar}
            actionable={actionable}
            setActionable={setActionable}
            isPhone={isPhone}
            setIsPhone={setPhone}
          />

          {/* <Geocoder setRecieverList={setRecieverList} recieverList={recieverList} /> */}
          <ContactLibrary
            recipients={recieverList}
            setRecipients={setRecieverList}
          />
        </div>

        <div className="flex w-1/2 flex-col gap-6 border-2 border-black bg-white p-8">
          <h2 className="font-title text-2xl font-bold">Mailto</h2>

          {mounted ? (
            <div className="flex flex-col gap-6">
              {/* To */}
              <div>
                <label>To</label>
                <RecipientField
                  thisList={recieverList}
                  setThisList={setRecieverList}
                  toList={recieverList}
                  setToList={setRecieverList}
                  ccList={cc}
                  setCcList={setCC}
                  setIsCcVisible={setshowCC}
                  bccList={bcc}
                  setBccList={setBcc}
                  setIsBccVisible={setShowBcc}
                />
              </div>

              <div
                className={
                  'flex gap-x-4 gap-y-6' +
                  (showCC || showBcc ? ' flex-col' : '')
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
                      setThisList={setCC}
                      toList={recieverList}
                      setToList={setRecieverList}
                      ccList={cc}
                      setCcList={setCC}
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
                      setCcList={setCC}
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
                <label
                  htmlFor="email-body"
                  className="flex items-center gap-1.5"
                >
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
          ) : (
            'loading'
          )}
        </div>
        <div>
          <button className="absolute bottom-4 left-4">
            <a href="/mailto/drafts">mailto drafts</a>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <LoginPage pwdInputRef={pwdInputRef} validateAction={validate} />
  );
}
