import React, { useState, useEffect } from 'react';
import './cta.css';
import nieghborhoods from "./LA_Neighborhood_Councils.json";
import { contentSecurityPolicy } from 'helmet';


const CTA = () => {
   const [body, setBody] = useState('');
   const [copy, setCopy] = useState('');
   const [subject, setSubject] = useState('');
   const [recieverList, setRecieverList] = useState([])
   const [email, setEmail] = useState('');
   const [data, setData] = useState('');

   var receivers = ''

   // set email
   useEffect(() => {
      updateEmail();
   }, []);



   const getData = (dataSource) => {
      if (data !== '') {setData('')} else if (dataSource === "nc") {setData(nieghborhoods.features)}
      console.log(nieghborhoods.features)
   }

   // add email from selector field
   const addEmail = (localEmail, e) => {
      e.target.classList.toggle("chosen");
      var list = recieverList
      list.push(localEmail)
      setRecieverList(list)
      updateEmail();
   }

   // remove email from to field
   const remove = (e) => {
      e.target.classList.toggle("chosen");
      var list = recieverList
      const item = data.findIndex(i => i.DEMAIL ===  e.target.textContent.slice(0,-1));
      console.log(item)
      var bye = e.target.textContent.replace()
      list = list.filter(item => item !== bye.slice(0,-2))
      setRecieverList(list)
      updateEmail();
   }

   // add email to recipients, clean up any spaces and split comma-seperated list into multiple
   const addRecipients = (e) => { 
      var newmails = document.getElementById('recipients')
      var clean = newmails.value.replace(/\s/g, '') 
      var clean = clean.split(",");
      var list = recieverList
      list.push(clean)
      setRecieverList(list.flat())
      updateEmail();
      e.target.reset();
      e.preventDefault();
   }

   // takes the subject and body states, converts spaces to '%20', and updates the email state
   const updateEmail = () => {
      function spaced(text) {
         var spacer = encodeURI(text.trim())
         return (spacer)
      }

      var output = `mailto:${recieverList}?&bcc=cta@streetsforall.org&subject=${spaced(subject)}&body=${spaced(body)}`
      setEmail(output);
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

   return (
      <div id="mailer">

<label>To</label>
         <div id="recipient_list">
            {recieverList.map((e, i , arr) => {
               return(<span onClick={(e) => {remove(e)}}>{e}, </span>)
            })}
            <form id="recipients_form" autocomplete="off" onSubmit={(e) => {addRecipients(e)}}>
               <input required type="email" multiple id="recipients"></input>
         </form>
         </div>


         <div id="filter">
            <button onClick={() => {getData('nc')}}>LA Nieghborhood Councils</button>
         </div>

         <div id="options">
            {data != '' ? data.map((locals) => {
              return(<span onClick={(e) => {addEmail(locals.properties.DEMAIL, e)}}> {locals.properties.NAME} </span>)
            }) : ''}
         </div>

         <label>Subject</label>
         <input onChange={(e) => { setSubject(e.target.value); updateEmail() }}>
         </input>

         <label>Email</label>
         <textarea rows="20" onChange={(e) => { setBody(e.target.value); updateEmail() }} />

         <button id="copy" onClick={handleCopyClick} >
            <span>{copy ? "Copied!" : "Copy"}</span>
         </button>

         <button>Create Shareable Link</button>

         <label>Output</label>

         <div id="preview">
            {email}
         </div>


      </div>

   );
}

export default CTA;
