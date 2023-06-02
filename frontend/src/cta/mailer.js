import React, { useState, useEffect } from 'react';
import './cta.css';
import nieghborhoods from "./LA_Neighborhood_Councils.json";
import { useParams } from "react-router-dom";

const CTA = () => {
   //content state
   const [body, setBody] = useState('');
   const [subject, setSubject] = useState('');
   const [recieverList, setRecieverList] = useState([]);
   const [editable, setEditable] = useState(true);

   // UI state
   const [email, setEmail] = useState('');
   const [data, setData] = useState('');
   const [hash, setHash] = useState('');
   const [copy, setCopy] = useState('');

   // set email
   useEffect(() => {
      const dataset = (handle.hash ? loadEmails() : '')
      console.log(dataset)
      updateEmail();
      // set field values 
   }, []);

   const handle = useParams()

   // using our email api this grabs all emails
   const loadEmails = async () => {
      setHash(handle.hash)
      const response = await fetch('/email/reader');
      const jsonData = await response.json();
      const match = jsonData.data.find(val => val.url == handle.hash)
      console.log(match)
      if (match) {
         // if URL is valid, fill field with data
         setBody(match.body)
         setSubject(match.subject)
         setRecieverList(match.to)
         setEditable(match.editable)
         document.getElementById("subject_field").value = match.subject;
         document.getElementById("body_field").value = match.body;
      }
   }


   useEffect(() => {
      updateEmail();
   }, [recieverList]);


   // this posts a new email hash
   const updateDatabase = async () => {

      var url = handle.hash ? hash : (Math.random() + 1).toString(36).substring(5)
      setHash(url)

      var load = {
         editable: editable,
         url: url,
         to: recieverList,
         subject: subject,
         body: body
      }

      const response = await fetch('/email/poster', {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify(load)
      })

      // refresh page, or send to unique url if not already there
      window.location.href = window.location.href.includes(url) ? window.location.href : window.location.href + url;
   }

   const getData = (dataSource) => {
      if (data !== '') { setData('') } else if (dataSource === "nc") { setData(nieghborhoods.features) }
      console.log(nieghborhoods.features)
   }

   // add email from selector array
   const addEmail = (localEmail, e) => {
      e.target.classList.toggle('chosen')

      var list = recieverList
      if (!list.includes(localEmail)) {
         list.push(localEmail);
      } else {
         list.splice(list.indexOf(localEmail), 1);
      }
      // list.push(localEmail)
      setRecieverList(list)
      updateEmail()
   }

   // remove email from 'To' field
   const remove = (e) => {
      var selectors = Array.from(document.querySelectorAll(".chosen"));
      const selected = selectors.find(a => a.dataset.email.includes(e.target.textContent.slice(0, -2)))
      selected.classList.remove('chosen')
      var list = recieverList
      var bye = e.target.textContent.replace()
      list = list.filter(item => item !== bye.slice(0, -2))
      setRecieverList(list)
   }

   // add email to recipients, clean up any spaces and split comma-seperated list into multiple
   const addRecipients = (e) => {
      var newmails = document.getElementById('recipients')
      var clean = newmails.value.replace(/\s/g, '')
      var clean = clean.split(",");
      var list = recieverList
      list.push(clean)
      setRecieverList(list.flat())
      e.target.reset();
      e.preventDefault();
   }

   // takes the subject and body states and updates the email state
   const updateEmail = () => {
      // this converts any spaces to '%20'
      function spaced(text) {
         var spacer = encodeURI(text.trim())
         return (spacer)
      }

      var output = `mailto:${recieverList}?&bcc=cta@streetsforall.org&subject=${spaced(subject)}&body=${spaced(body)}`
      setEmail(output);
      console.log('updated')
   }

   // async copy current email state to clipboard 
   async function copyTextToClipboard() {
      navigator.clipboard.writeText(email).then(function () {
         console.log('Async: Copying to clipboard was successful!');
      }, function (err) {
         console.error('Async: Could not copy text: ', err);
      });
   }

   const handleCopyClick = () => {
      copyTextToClipboard(body)
      setCopy(true);
   }

   // sets the share button dependant on state
   if (hash) {
      var shareable = (
         <div id="shareable">
            <div id="hash">
               <a href={window.location.href}>{window.location.href}</a>
            </div>
            <button id="save" onClick={() => updateDatabase()}>Save</button>
         </div>);
   } else if (hash) {
      var shareable = <div id="hash"><a href={window.location.href}>{window.location.href}</a></div>;
   } else {
      var shareable = <button onClick={() => updateDatabase()}>Create Shareable Link</button>
   }





   return (
      <div id="mailer">

         <label>To</label>
         <div id="recipient_list">
            {recieverList.map((e, i, arr) => {
               return (<span onClick={(e) => { remove(e) }}>{e}, </span>)
            })}
            <form id="recipients_form" autocomplete="off" onSubmit={(e) => { addRecipients(e) }}>
               <input required type="email" multiple id="recipients"></input>
            </form>
         </div>


         <div id="filter">
            <button onClick={() => { getData('nc') }}>LA Nieghborhood Councils</button>
         </div>

         <div id="options">
            {data != '' ? data.map((locals, i) => {
               return (<span data-email={locals.properties.DEMAIL} class="geo_selector" index={i} onClick={(e) => { addEmail(locals.properties.DEMAIL, e, i) }}> {locals.properties.NAME} </span>)
            }) : ''}
         </div>

         <label>Subject</label>
         <input id="subject_field" onChange={(e) => { setSubject(e.target.value); updateEmail() }}>
         </input>

         <label>Email</label>
         <textarea id="body_field" rows="20" onChange={(e) => { setBody(e.target.value); updateEmail() }} />

         <button id="copy" onClick={() => handleCopyClick()} >
            <span>{copy ? "Copied!" : "Copy MailTo"}</span>
         </button>

         {shareable}

         <label>Output</label>

         <div id="preview">
            {email}
         </div>


      </div>

   );
}

export default CTA;
