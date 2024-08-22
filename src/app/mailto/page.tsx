'use client'

import React, { useState, useEffect } from 'react';
import './mailto.css';
import Data_field from './components/email_library'
import Geocoder from './components/geocoder'
import Outgoing from './components/outgoing.tsx';
import { newSaved, getSaved} from './helpers/saved_emails';

const CTA = () => {
   //content state
   const [body, setBody] = useState('');
   const [subject, setSubject] = useState('');
   const [recieverList, setRecieverList] = useState([]);
   const [isShareable, setIsShareable] = useState(false);
   const [districtVar, setDistrictVar] = useState(['test', 'test']);
   const [cc, setCC] = useState([]);
   const [bcc, setBcc] = useState(['contact@streetsforall.org']);
   const [load, setLoad] = useState({})
   const [saved, setSaved] = useState({})


   // UI state
   const [email, setEmail] = useState('');
   const [hash, setHash] = useState('');
   const [copy, setCopy] = useState('');
   const [showGeo, setshowGeo] = useState(false);
   const [showCC, setshowCC] = useState(false);
   const [showBcc, setShowBcc] = useState(false);


   //update email string whenever a change is made
   useEffect(() => {
      updateEmail();
      var times = Date.now()
      setLoad({
         shareable: isShareable,
         district_var: districtVar,
         url: window.location.hash,
         to: recieverList,
         cc: cc,
         bcc: bcc,
         subject: subject,
         body: body,
         time: new Date(times)
      })
   }, [recieverList, cc, bcc, body, subject, isShareable, districtVar]);


   // set email on load
   useEffect(() => {
      const dataset = (window.location.hash ? fetchEmails() : '')
      updateEmail();
   }, []);


   // using our mailto api this grabs all mailto URLs
   // if one matches, it fills in that data to state & HTML body
   const fetchEmails = async () => {

      const loadEmails = async () => {
         const response = getSaved(window.location.hash);
         console.log('response', response)
         return(response)
     }

     loadEmails().then(result => {
      setHash(window.location.hash)

      const match = result

      if (match) {
         // if URL is valid, fill field with data
         setBody(match.body)
         setSubject(match.subject)
         setBcc(match.bcc)
         setCC(match.cc)
         setIsShareable(match.shareable)
         setDistrictVar(match.district_var)
         setRecieverList(match.to)
         document.getElementById("subject_field").value = match.subject;
         document.getElementById("body_field").value = match.body;
      }
      }).catch(err => {
         console.log(err)
   })
      setSaved(load)
   }






   // this posts a new email hash
   const updateDatabase = async () => {

      var url = window.location.hash ? hash : (Math.random() + 1).toString(36).substring(5)
      setHash(url)

      newSaved(load)

      window.location.href = window.location.href.includes(url) ? window.location.href : window.location.href + '#' + url;
      setSaved(load)
   }


   // remove email from 'To' field
   const remove = (email, list, setList) => {
      var bye = email.replace()
      list = list.filter(item => item !== email)
      setList(list)
   }


   // takes the subject and body states and updates the email state
   const updateEmail = () => {
      // this converts any spaces to '%20', a
      function spaced(text) {
         var spacer = encodeURI(text.trim())
         return (spacer)
      }

      var output = `mailto:${recieverList}?&cc=${cc}&bcc=${bcc}&subject=${spaced(subject)}&body=${spaced(body)}`
      setEmail(output);
      console.log('updated')
   }


   // async copy current email state to clipboard use
   async function copyTextToClipboard(content, e) {
      console.log(content)
      e.target.innerText = 'Copied Link!'
      navigator.clipboard.writeText(content).then(function () {
         console.log('Async: Copying to clipboard was successful!');
      }, function (err) {
         console.error('Async: Could not copy text: ', err);
      });
   }

   const handleCopyClick = (e) => {
      copyTextToClipboard(email, e)
   }



   // sets the share button dependant on state
   if (window.location.hash) {
      var editable = (
         <div id="editable">
            <div>
               <button className="m_button"  style={{width: "100%"}} onClick={(e) => copyTextToClipboard(window.location.href, e)} id="hash">
                  Copy Editable Link
               </button>
               {/* <label>url: <a href={window.location.href}>{window.location.href}</a></label> */}
            </div>
            <div  className="sub_menu">
               <button className="m_button" id="save" onClick={() => updateDatabase()}>Save Page</button>
               <label className={saved == load ? "saved" : "unsaved"} >{saved == load ? "✅ up to date" : "❗ unsaved changes"}</label>
            </div>
         </div>);
   } else {
      var editable = <div id="editable"><button onClick={() => updateDatabase()}>Save Template</button></div>
   }


   // add email to recipients, clean up any spaces and split comma-seperated list into multiple
   const addRecipients = (email, list, setList, e) => {
      if (e) { e.preventDefault() }
      console.log(email)
      if (!email) return
      var clean = email.replace(/\s/g, '')
      var clean = clean.split(",");
      list.push(clean)
      setList(list.flat())
      if (e) { e.target.reset() }
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



   // this the form component that manages emails, deleting, changing to cc/bcc, formatting
   const RecipientForm = ({ list, setList, name}) => {
      if (list != null) {
      return (
         <div className="recipient_list" id={name}>
            {list.map((email, i, arr) => {
               return (
               <>
                  <span onClick={(e) => {e.target.focus()}}className="recipient" tabindex={10 + i}>{email}
                     <div className="recipient_menu">
                        <span className={name != "to" ? "shown" : "hidden"} onClick={(e) => { addRecipients(email, recieverList, setRecieverList); remove(email, list, setList); }}>To</span>
                        <span className={name != "cc" ? "shown" : "hidden"} onClick={(e) => { addRecipients(email, cc, setCC); remove(email, list, setList); setshowCC(true) }}>Cc</span>
                        <span className={name != "bcc" ? "shown" : "hidden"} onClick={(e) => { addRecipients(email, bcc, setBcc); remove(email, list, setList); setShowBcc(true) }}>Bcc</span>
                        <span className="delete" onClick={() => { remove(email, list, setList) }}>Delete</span>
                     </div>
                  </span>,
               </>
               )
            })}
            <form id="recipients_form" autoComplete="off" onSubmit={(e) => { addRecipients(e.target.firstChild.value, list, setList, e) }}>
               <input tabindex={list.length + 11} required placeholder="add email" type="email" multiple id="recipients"></input>
            </form>
            <p id="clear" onClick={() => setList([])}>CLEAR</p>
         </div>
      )}
   }





   return (
      <div id="container">
         {/* <button id="geo_toggle" onClick={() => setshowGeo(!showGeo)}>
            {/* <img src="/images/geotagger.png" /> */}
            {/* {showGeo ? 'Hide Geocoder' : "Show Geocoder"} */}
         {/* </button> */}

         <div id='toolset'>



         <Outgoing hash={hash} districtVar={districtVar} setDistrictVar={setDistrictVar} isShareable={isShareable} setIsShareable={setIsShareable}  />

         <Geocoder setRecieverList={setRecieverList} recieverList={recieverList} updateEmail={updateEmail} />
         <Data_field setRecieverList={setRecieverList} recieverList={recieverList} updateEmail={updateEmail} />

         </div>

         <div className="window" id="mailer">
            <div id="mailer_head">
               <div>
               
                  <h1>MailTo</h1>
                  <label>Use this to generate an email</label>
               </div>
               {editable}

            </div>

            <div>

               <label className="main_label">To</label>
               <RecipientForm name="to" list={recieverList} setList={setRecieverList} />

               <label className={showCC === true ? "label_header full" : "label_header"} onClick={() => setshowCC(!showCC)}>Cc</label>
               {showCC === true ? < RecipientForm list={cc} name="cc" setList={setCC} /> : ''}

               <label className={showBcc === true ? "label_header full" : "label_header"} onClick={() => setShowBcc(!showBcc)}>Bcc</label>
               {showBcc === true ? <RecipientForm name="bcc" list={bcc} setList={setBcc} /> : ''}

            </div>

            <label className="main_label">Subject</label>
            <input id="subject_field" onChange={(e) => { setSubject(e.target.value); updateEmail() }}>
            </input>

            <label className="main_label">Email Body</label>
            <textarea id="body_field" rows="20" onChange={(e) => { setBody(e.target.value); updateEmail() }} />


            <div id="preview">
               {email}
            </div>

            <button id="copy" onClick={(e) => handleCopyClick(e)} >
               Copy Code
            </button>


         </div>
         <button id="feed"><a href="/mailto/drafts">mailto drafts</a></button>
      </div>



   );
}

export default CTA;
