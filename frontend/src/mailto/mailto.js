import React, { useState, useEffect } from 'react';
import './mailto.css';
import Data_field from './components/data_field'
import Geocoder from './components/geocoder'
import { useParams } from "react-router-dom";
import Outgoing from './components/outgoing';

const CTA = () => {
   //content state
   const [body, setBody] = useState('');
   const [subject, setSubject] = useState('');
   const [recieverList, setRecieverList] = useState([]);
   const [outList, setOutList] = useState([]);
   const [editable, setEditable] = useState(true);
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
         editable: editable,
         outgoing: outList,
         url: handle.hash,
         to: recieverList,
         cc: cc,
         bcc: bcc,
         subject: subject,
         body: body,
         time: new Date(times)
      })
   }, [recieverList, cc, bcc, body, subject, editable]);


   // set email on load
   useEffect(() => {
      const dataset = (handle.hash ? loadEmails() : '')
      updateEmail();
   }, []);

   const handle = useParams()

   // using our mailto api this grabs all mailto URLs
   // if one matches, it fills in that data to state & HTML body
   const loadEmails = async () => {
      setHash(handle.hash)
      const response = await fetch(process.env.REACT_APP_API + 'email/reader');
      const jsonData = await response.json();
      console.log(jsonData)
      const match = jsonData.data.find(val => val.url == handle.hash)
      if (match) {
         // if URL is valid, fill field with data
         setBody(match.body)
         setSubject(match.subject)
         setBcc(match.bcc)
         setCC(match.cc)
         setOutList(match.outlist)
         setRecieverList(match.to)
         setEditable(match.editable)
         document.getElementById("subject_field").value = match.subject;
         document.getElementById("body_field").value = match.body;
      }
      setSaved(load)
   }






   // this posts a new email hash
   const updateDatabase = async () => {

      var url = handle.hash ? hash : (Math.random() + 1).toString(36).substring(5)
      setHash(url)

      const response = await fetch(process.env.REACT_APP_API + 'email/poster', {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify(load)
      })

      // refresh page, or send to unique url if not already there
      window.location.href = window.location.href.includes(url) ? window.location.href : window.location.href + '/' + url;
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

   // async copy current email state to clipboard 
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
   if (handle.hash) {
      var shareable = (
         <div id="shareable">
            <div>
            <button onClick={(e) => copyTextToClipboard(window.location.href, e)} id="hash">
                  Create Outgoing Mailto
               </button>
               <button onClick={(e) => copyTextToClipboard(window.location.href, e)} id="hash">
                  Copy Shareable Link
               </button>
               {/* <label>url: <a href={window.location.href}>{window.location.href}</a></label> */}
            </div>
            <div>
               <button id="save" onClick={() => updateDatabase()}>Save Page</button>
               <label>{saved == load ? "✅ up to date" : "❗ unsaved changes"}</label>
            </div>
         </div>);
   } else {
      var shareable = <div id="shareable"><button onClick={() => updateDatabase()}>Save Template</button></div>
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
         <div class="recipient_list" id={name}>
            {list.map((email, i, arr) => {
               return (
               <>
                  <span onClick={(e) => {e.target.focus()}}class="recipient" tabindex={10 + i}>{email}
                     <div class="recipient_menu">
                        <span class={name != "to" ? "shown" : "hidden"} onClick={(e) => { addRecipients(email, recieverList, setRecieverList); remove(email, list, setList); }}>To</span>
                        <span class={name != "cc" ? "shown" : "hidden"} onClick={(e) => { addRecipients(email, cc, setCC); remove(email, list, setList); setshowCC(true) }}>Cc</span>
                        <span class={name != "bcc" ? "shown" : "hidden"} onClick={(e) => { addRecipients(email, bcc, setBcc); remove(email, list, setList); setShowBcc(true) }}>Bcc</span>
                        <span class="delete" onClick={() => { remove(email, list, setList) }}>Delete</span>
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
         <button id="geo_toggle" onClick={() => setshowGeo(!showGeo)}>
            <img src="/images/geotagger.png" />
            {showGeo ? 'Hide Geocoder' : "Show Geocoder"}
         </button>
         {showGeo ? <Geocoder setRecieverList={setRecieverList} recieverList={recieverList} updateEmail={updateEmail} /> : ''}
         {<Outgoing setOutList={setOutList} outList={outList} />}


         <div class="window" id="mailer">
            <div id="mailer_head">
               <div>
                  <img src="/images/mailto.png" />
                  MailTo
                  <label>Use this to generate an email</label>
               </div>
               {shareable}

            </div>

            <div>

               <label class="main_label">To</label>
               <RecipientForm name="to" list={recieverList} setList={setRecieverList} />

               <label class={showCC === true ? "label_header full" : "label_header"} onClick={() => setshowCC(!showCC)}>Cc</label>
               {showCC === true ? < RecipientForm list={cc} name="cc" setList={setCC} /> : ''}

               <label class={showBcc === true ? "label_header full" : "label_header"} onClick={() => setShowBcc(!showBcc)}>Bcc</label>
               {showBcc === true ? <RecipientForm name="bcc" list={bcc} setList={setBcc} /> : ''}

            </div>
            <Data_field setRecieverList={setRecieverList} recieverList={recieverList} updateEmail={updateEmail} />

            <label class="main_label">Subject</label>
            <input id="subject_field" onChange={(e) => { setSubject(e.target.value); updateEmail() }}>
            </input>

            <label class="main_label">Email Body</label>
            <textarea id="body_field" rows="20" onChange={(e) => { setBody(e.target.value); updateEmail() }} />


            <div id="preview">
               {email}
            </div>

            <button id="copy" onClick={(e) => handleCopyClick(e)} >
               Copy Code
            </button>


         </div>
         <button id="feed"><a href="/#/feed">mailto feed</a></button>
      </div>



   );
}

export default CTA;
