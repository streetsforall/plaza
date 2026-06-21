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
    <div className="flex flex-wrap bg-edit border border-dotted border-gray-400 p-1 pb-0 rounded-lg text-bg">
      {/* Added emails */}
      {thisList.map((email, index) => {
        return (
          <React.Fragment key={index}>
            <span
              onClick={(e: any) => {
                e.target.focus();
              }}
              className="group align-middle focus:bg-soft-bg border border-button focus:border-bold mb-1 p-1 rounded-lg text-black"
              tabIndex={10 + index}
            >
              {email}

              {/* Move to different field */}
              <div className="absolute hidden group-hover:!flex bg-bg border border-button cursor-pointer p-1 shadow-sm rounded shadow-gray-200 text-sm">
                {/* To */}
                <span
                  className={'border border-edit cursor-pointer m-0.5 px-1 py-0.5 rounded-lg hover:underline' + (thisList === toList ? '  hidden' : '')}
                  onClick={(e) => {
                    addRecipient(email, toList, setToList);
                    removeRecipient(email, thisList, setThisList);
                  }}
                >
                  To
                </span>

                {/* CC */}
                <span
                  className={'border border-edit cursor-pointer m-0.5 px-1 py-0.5 rounded-lg hover:underline' + (thisList === ccList ? ' hidden' : '')}
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
                  className={'border border-edit cursor-pointer m-0.5 px-1 py-0.5 rounded-lg hover:underline' + (thisList === bccList ? ' hidden' : '')}
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
                  className="border-l border-gray-300 cursor-pointer m-0.5 px-2 py-0.5 hover:underline"
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
        className="bg-edit inline-block mb-1"
        autoComplete="off"
        onSubmit={processRecipientInput}
      >
        <input
          tabIndex={thisList.length + 11}
          required
          placeholder="add email"
          type="email"
          multiple
          className="align-middle focus:!bg-soft-bg hover:!bg-soft-bg !border-0 !m-0 !p-1 !outline-0 text-black"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          onBlur={processRecipientInput}
        />
      </form>

      <p className="hover:bg-button cursor-pointer m-0 ml-auto p-1 text-sm text-gray-400 rounded h-fit w-max" onClick={() => setThisList([])}>
        CLEAR
      </p>
    </div>
  );
}
