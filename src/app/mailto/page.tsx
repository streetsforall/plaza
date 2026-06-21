'use client';

import React, { useState, useEffect, useRef } from 'react';
// import Geocoder from './components/geocoder'
import ContactLibrary from "./components/ContactLibrary";
import LandingPageSettings from './components/LandingPageSettings';
import RecipientField from './components/RecipientField';
import { setEmailTemplate } from './helpers/db';
import { textEncoding, textEscapes } from './helpers/text_cleanup';
import { validateString } from './helpers/validator';
import './mailto.css';

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
    event.target.innerText = 'Copied Link!';

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

    setMailtoLink(`mailto:${recieverList}?&cc=${cc}&bcc=${bcc}&subject=${encodeURIComponent(
      subject,
    )}&body=${body}`);
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

  return (
    <div>
      {validated ? (
        <>
          {error && (
            <div className="text-center text-red-500">
              {error}
            </div>
          )}

          <div className="flex m-auto mt-32 md:mt-8 mb-4 text-xs md:text-base max-w-full w-max">
            <div className="max-w-full w-1/2">
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

            <div className="bg-bg flex flex-col m-2 p-4 rounded-2xl max-w-[calc(100%-3rem)] w-1/2">
              <div className="flex justify-between mb-4">
                <div className="flex flex-col w-1/2">
                  <h1 className="font-bold mb-4 text-3xl">MailTo</h1>
                  <label>Use this to generate an email</label>
                </div>

                {/* Save/copy link button */}
                {hash ? (
                  <div className="flex flex-col justify-end max-w-max min-w-40 w-1/2">
                    <div className="mb-2 min-w-full">
                      <button
                        className="bg-button cursor-pointer m-1 px-2 py-1 rounded hover:underline w-full"
                        onClick={(e) =>
                          copyTextToClipboard(window.location.href, e)
                        }
                      >
                        Copy Editable Link
                      </button>
                    </div>
                    <div className="border border-button mb-2 min-w-full rounded-lg">
                      <button
                        className="m-1 px-2 py-1 rounded hover:underline"
                        onClick={() => updateDatabase()}
                      >
                        Save Page
                      </button>

                      <label className={'m-1 px-2 py-1 rounded !text-black ' + (saved == load ? 'saved' : 'unsaved')}>
                        {saved == load ? '✅ up to date' : '❗ unsaved changes'}
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-end max-w-max min-w-40 w-1/2">
                    <button className="m-1 px-2 py-1 rounded hover:underline" onClick={() => updateDatabase()}>
                      Save Draft
                    </button>
                  </div>
                )}
              </div>

              {mounted ? (
                <div className="flex flex-col">
                  <div>
                    <label className="mt-4">To</label>
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

                    <label
                      className={'inline cursor-pointer mr-2 hover:underline' + 
                        (showCC === true ? ' block mt-4' : '')
                      }
                      onClick={() => setshowCC(!showCC)}
                    >
                      Cc
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

                    <label
                      className={'inline cursor-pointer mr-2 hover:underline' + 
                        (showBcc === true ? ' block mt-4' : '')
                      }
                      onClick={() => setShowBcc(!showBcc)}
                    >
                      Bcc
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

                  {/* Subject */}
                  <label htmlFor="email-subject" className="mt-4">Subject (required)</label>
                  <input
                    value={decodeURIComponent(subject)}
                    id="email-subject"
                    onChange={(e) => {
                      setSubject(e.target.value);
                    }}
                    required
                  />

                  {/* Body */}
                  <label htmlFor="email-body" className="mt-4">Email Body (required)</label>
                  <textarea
                    value={decodeURIComponent(body)}
                    id="email-body"
                    rows={20}
                    onChange={(e) => {
                      setBody(e.target.value);
                    }}
                    required
                  />

                  <div className="bg-soft-bg mt-4 p-2 rounded-lg max-w-full overflow-hidden text-ellipsis whitespace-nowrap wrap-anywhere">{mailtoLink}</div>

                  <button className="!bg-copy hover:!bg-copyhigh !border !border-copyhigh hover:cursor-pointer font-semibold mt-1 mb-2 p-2 rounded-4xl text-lg" onClick={(e) => copyTextToClipboard(mailtoLink, e)}>
                    Copy Code
                  </button>
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
        </>
      ) : (
        <div className="bg-bg m-auto mt-[30vh] p-8">
          Please log in to access the mailto tool
          <form onSubmit={validate}>
            <div>
              <label>Password</label>
              <input ref={pwdInputRef} />
            </div>
            <button type="submit">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
