import React, { useState, useEffect } from 'react';
import './cta.css';
import nieghborhoods from "./LA_Neighborhood_Councils.json";
import { useParams } from "react-router-dom";

const CTA = () => {
   const [body, setBody] = useState('');
   const [copy, setCopy] = useState('');
   const [subject, setSubject] = useState('');
   const [recieverList, setRecieverList] = useState([])
   const [email, setEmail] = useState('');
   const [data, setData] = useState('');
   const [hash, setHash] = useState('');
   const [hashData, setHashData] = useState('');

   // set email
   useEffect(() => {
      updateEmail();
   }, []);

   const handle = useParams()


   if (handle.hash) {
      console.log(handle.hash)
      fetch('/email/reader')
        .then(response => response.json())
        .then(data => console.log(data));
   }


   useEffect(() => {
      updateEmail();
   }, [recieverList]);

   const createHash = async () => {

      var url = handle.hash ? hash : (Math.random() + 1).toString(36).substring(2)
      setHash(url)

      var load = { url: url, to: recieverList, subject: subject, body: body }

      const response = await fetch('/email/poster', {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify(load)
      })

      const data = await response.json();
      console.log(url);
   }

   const getData = (dataSource) => {
      if (data !== '') { setData('') } else if (dataSource === "nc") { setData(nieghborhoods.features) }
      console.log(nieghborhoods.features)
   }

   // add email from selector array
   const addEmail = (localEmail, e) => {
      var list = recieverList
      list.push(localEmail)
      setRecieverList(list)
      updateEmail()
   }

   // remove email from 'To' field
   const remove = (e) => {
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

   if (handle.hash) {
      var shareable = <div id="hash"><a href={window.location.href}>{window.location.href}</a></div>;
   } else if (hash) {
      var shareable = <div id="hash"><a href={window.location.href + hash}>{window.location.href + hash}</a></div>;
   } else {
      var shareable = <button onClick={() => createHash()}>Create Shareable Link</button>
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
            {data != '' ? data.map((locals) => {
               return (<span onClick={(e) => { addEmail(locals.properties.DEMAIL, e) }}> {locals.properties.NAME} </span>)
            }) : ''}
         </div>

         <label>Subject</label>
         <input onChange={(e) => { setSubject(e.target.value); updateEmail() }}>
         </input>

         <label>Email</label>
         <textarea rows="20" onChange={(e) => { setBody(e.target.value); updateEmail() }} />

         <button id="copy" onClick={() => handleCopyClick()} >
            <span>{copy ? "Copied!" : "Copy"}</span>
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
