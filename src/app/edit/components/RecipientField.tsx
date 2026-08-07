import React, { FormEvent, useState } from 'react';

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
export default function RecipientField({
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
  const [recipient, setRecipient] = useState('');

  /**
   * Add recipient to list if proper email
   */
  function processRecipientInput(e: FormEvent) {
    e.preventDefault();

    const isEmail = String(recipient)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );

    if (isEmail) {
      addRecipient(recipient, thisList, setThisList);
      setRecipient('');
    }
  }

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
    <div className="focus-within:border-blue flex flex-wrap gap-2 border-2 border-black p-2">
      {/* Added emails */}
      {thisList.map((email, index) => {
        return (
          <React.Fragment key={index}>
            <span
              onClick={(e: any) => {
                e.target.focus();
              }}
              className="group focus:bg-soft-bg relative flex items-center rounded-sm border-2 border-dotted border-black px-1 text-black"
              tabIndex={10 + index}
            >
              {email}

              {/* Move to different field */}
              <div className="absolute top-6 hidden cursor-pointer rounded-sm bg-black font-mono text-sm text-white group-hover:flex">
                {/* To */}
                <button
                  aria-label="Move to 'To' field"
                  className={
                    'cursor-pointer rounded-sm border-none px-2 py-1 hover:bg-gray-700' +
                    (thisList === toList ? ' hidden' : '')
                  }
                  onClick={(e) => {
                    addRecipient(email, toList, setToList);
                    removeRecipient(email, thisList, setThisList);
                  }}
                >
                  To
                </button>

                {/* CC */}
                <button
                  aria-label="Move to 'CC' field"
                  className={
                    'cursor-pointer rounded-sm border-none px-2 py-1 hover:bg-gray-700' +
                    (thisList === ccList ? ' hidden' : '')
                  }
                  onClick={(e) => {
                    addRecipient(email, ccList, setCcList);
                    removeRecipient(email, thisList, setThisList);
                    setIsCcVisible(true);
                  }}
                >
                  CC
                </button>

                {/* BCC */}
                <button
                  aria-label="Move to 'BCC' field"
                  className={
                    'cursor-pointer rounded-sm border-none px-2 py-1 hover:bg-gray-700' +
                    (thisList === bccList ? ' hidden' : '')
                  }
                  onClick={(e) => {
                    addRecipient(email, bccList, setBccList);
                    removeRecipient(email, thisList, setThisList);
                    setIsBccVisible(true);
                  }}
                >
                  BCC
                </button>

                {/* Delete */}
                <button
                  aria-label="Remove recipient"
                  className="cursor-pointer rounded-sm rounded-l-none border-l border-none border-white px-2 py-1 hover:bg-gray-700"
                  onClick={() => {
                    removeRecipient(email, thisList, setThisList);
                  }}
                >
                  Delete
                </button>
              </div>
            </span>
          </React.Fragment>
        );
      })}

      {/* Add new email */}
      <form autoComplete="off" onSubmit={processRecipientInput}>
        <input
          tabIndex={thisList.length + 11}
          required
          placeholder="add email"
          type="email"
          multiple
          className="rounded-sm border-0 px-1 py-0.5 align-middle hover:bg-gray-200 focus:bg-gray-200"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          onBlur={processRecipientInput}
        />
      </form>

      {/* Clear */}
      <button
        aria-label="Remove all recipients from field"
        className="ml-auto rounded-sm border-none px-2 py-1 font-mono text-sm text-gray-400 uppercase hover:bg-gray-200"
        onClick={() => setThisList([])}
      >
        Clear
      </button>
    </div>
  );
}
