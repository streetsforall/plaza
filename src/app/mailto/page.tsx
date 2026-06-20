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
      {!validated && (
        <div className="bg-bg m-auto mt-[30vh] p-8">
          Please log in to access the mailto tool
          <form onSubmit={validate}>
            <div>
              <label>Password</label>
              <input ref={pwdInputRef} id="password" />
            </div>
            <button className="button_m" type="submit">
              Submit
            </button>
          </form>
        </div>
      )}

      {error && (
        <div style={{ color: 'red', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div className={validated ? '' : 'hidden'} id="container">
        <div id="toolset">
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

        <div className="window" id="mailer">
          <div id="mailer_head">
            <div>
              <h1>MailTo</h1>
              <label>Use this to generate an email</label>
            </div>

            {/* Save/copy link button */}
            {hash ? (
              <div id="editable">
                <div>
                  <button
                    className="m_button"
                    style={{ width: '100%' }}
                    onClick={(e) =>
                      copyTextToClipboard(window.location.href, e)
                    }
                    id="hash"
                  >
                    Copy Editable Link
                  </button>
                </div>
                <div className="sub_menu">
                  <button
                    className="m_button"
                    id="save"
                    onClick={() => updateDatabase()}
                  >
                    Save Page
                  </button>

                  <label className={saved == load ? 'saved' : 'unsaved'}>
                    {saved == load ? '✅ up to date' : '❗ unsaved changes'}
                  </label>
                </div>
              </div>
            ) : (
              <div id="editable">
                <button className="m_button" onClick={() => updateDatabase()}>
                  Save Draft
                </button>
              </div>
            )}
          </div>

          {mounted ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <label className="main_label">To</label>
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
                  className={
                    showCC === true ? 'label_header full' : 'label_header'
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
                  className={
                    showBcc === true ? 'label_header full' : 'label_header'
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
              <label className="main_label">Subject (required)</label>
              <input
                value={decodeURIComponent(subject)}
                id="subject_field"
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
                required
              />

              {/* Body */}
              <label className="main_label">Email Body (required)</label>
              <textarea
                value={decodeURIComponent(body)}
                id="body_field"
                rows={20}
                onChange={(e) => {
                  setBody(e.target.value);
                }}
                required
              />

              <div id="preview">{mailtoLink}</div>

              <button id="copy" onClick={(e) => copyTextToClipboard(mailtoLink, e)}>
                Copy Code
              </button>
            </div>
          ) : (
            'loading'
          )}
        </div>
        <div>
          <button id="feed">
            <a href="/mailto/drafts">mailto drafts</a>
          </button>
        </div>
      </div>
    </div>
  );
}
