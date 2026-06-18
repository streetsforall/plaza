'use client';

import React, { useState, useEffect, useRef } from 'react';
// import Geocoder from './components/geocoder'
import ContactLibrary from "./components/ContactLibrary";
import LandingPageSettings from './components/LandingPageSettings';
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

/**
 * Form component that acts as an input for emails
 * @param props.thisList - Email list of current field
 * @param props.setThisList - State setter function for this list
 * @param props.toList - Email list for To field
 * @param props.setToList - State setter function for To list
 * @param props.ccList - Email list for CC field
 * @param props.setCcList - State setter function for CC list
 * @param props.setIsCcVisible - State setter function for CC field visibility
 * @param props.bccList - Email list for BCC field
 * @param props.setBccList - State setter function for BCC list
 * @param props.setIsBccVisible - State setter function for BCC field visibility
 * @returns
 */
function RecipientField({
  thisList,
  setThisList,
  toList,
  setToList,
  ccList,
  setCcList,
  setIsCcVisible,
  bccList,
  setBccList,
  setIsBccVisible,
}) {
  /**
   * Add email to list
   * @param email - Email to add
   * @param list - List to add to
   * @param setList - State setter function
   */
  function addRecipient(email, list, setList) {
    // Clean up any spaces and split comma-seperated list
    const updatedEmail = email.replace(/\s/g, '').split(',');
    const updatedList = [...list, updatedEmail];

    setList(updatedList.flat());
  }

  /**
   * Remove email from list
   * @param email - Email to remove
   * @param list - List to remove from
   * @param setList - State setter function
   */
  function removeRecipient(email, list, setList) {
    const updatedList = list.filter((item) => item !== email);

    setList(updatedList);
  }

  return (
    <div className="recipient_list">
      {/* Added emails */}
      {thisList.map((email, index) => {
        return (
          <React.Fragment key={index}>
            <span
              onClick={(e: any) => {
                e.target.focus();
              }}
              className="recipient"
              tabIndex={10 + index}
            >
              {email}

              {/* Move to different field */}
              <div className="recipient_menu">
                {/* To */}
                <span
                  className={thisList !== toList ? 'shown' : 'hidden'}
                  onClick={(e) => {
                    addRecipient(email, toList, setToList);
                    removeRecipient(email, thisList, setThisList);
                  }}
                >
                  To
                </span>

                {/* CC */}
                <span
                  className={thisList !== ccList ? 'shown' : 'hidden'}
                  onClick={(e) => {
                    addRecipient(email, ccList, setCcList);
                    removeRecipient(email, thisList, setThisList);
                    setIsCcVisible(true);
                  }}
                >
                  Cc
                </span>

                {/* BCC */}
                <span
                  className={thisList !== bccList ? 'shown' : 'hidden'}
                  onClick={(e) => {
                    addRecipient(email, bccList, setBccList);
                    removeRecipient(email, thisList, setThisList);
                    setIsBccVisible(true);
                  }}
                >
                  Bcc
                </span>

                {/* Delete */}
                <span
                  className="delete"
                  onClick={() => {
                    removeRecipient(email, thisList, setThisList);
                  }}
                >
                  Delete
                </span>
              </div>
            </span>
            ,
          </React.Fragment>
        );
      })}

      {/* Add new email */}
      <form
        id="recipients_form"
        autoComplete="off"
        onSubmit={(e: any) => {
          e.preventDefault();
          addRecipient(e.target.firstChild.value, thisList, setThisList);
          e.target.reset();
        }}
      >
        <input
          tabIndex={thisList.length + 11}
          required
          placeholder="add email"
          type="email"
          multiple
          id="recipients"
        />
      </form>
      <p id="clear" onClick={() => setThisList([])}>
        CLEAR
      </p>
    </div>
  );
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
      if (match) {
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
    <div id="page">
      <div className={validated ? 'hidden' : ''} id="log-in">
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

      <div className={validated ? '' : 'hidden'} id="container">
        <div id="toolset">
          <LandingPageSettings
            hash={hash}
            isShareable={isShareable}
            setIsShareable={setIsShareable}
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
              <label className="main_label">Subject</label>
              <input
                value={decodeURIComponent(subject)}
                id="subject_field"
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
              />

              {/* Body */}
              <label className="main_label">Email Body</label>
              <textarea
                value={decodeURIComponent(body)}
                id="body_field"
                rows={20}
                onChange={(e) => {
                  setBody(e.target.value);
                }}
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
