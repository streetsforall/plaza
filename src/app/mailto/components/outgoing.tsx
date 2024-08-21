import React, { useState, useEffect } from 'react';

const Outgoing = ({ districtVar, hash, setDistrictVar, isShareable, setIsShareable }) => {


    const itemlist = [...districtVar]

    // this component manages the outlist 
    const addOut = (item) => {
        if (!itemlist.includes(item)) {          //checking if array contains the id
            itemlist.push(item);               //adding to array because value doesnt exists
        } else {
            itemlist.splice(itemlist.indexOf(item), 1);  //deleting
        }
        setDistrictVar(itemlist)
        console.log(districtVar)
    }

    // async copy current email state to clipboard use
    async function copyLink(e) {

        // need to generate link 
        const content = location.href.replace(location.hash,"") +"/out"+hash

        e.target.innerText = 'Copied Link!'
        navigator.clipboard.writeText(content).then(function () {
            console.log('Async: Copying to clipboard was successful!');
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }



    return (
        <div className="data_field">
            <h3>Sharable Link Generator</h3>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>

                <label style={{ marginRight: ".5rem", width: '58%' }}>Use this to select the catagories of representative that will be sent to audience members and autofilled based on their address.</label>
                <button className="m_button" id="shareable" onClick={() => setIsShareable(!isShareable)}>{isShareable ? "🗣️ Shareable" : "⛔ Not Shareable"}</button>

                {isShareable ?
                    <button className="m_button" onClick={(e) => copyLink(e)}>
                        Copy Shareable Link
                    </button>

                    : ""}

            </div>
            {
                isShareable ?

                    <div>
                        <button className={'m_button' + (itemlist.includes("Assembly", 0) ? " selected" : "")} onClick={(e) => { addOut('Assembly') }}>Assembly</button>
                        <button className={'m_button' + (itemlist.includes("Senate", 0) ? " selected" : "")} onClick={(e) => { addOut('Senate') }} >Senate</button>
                        {/* {districtVar} */}
                    </div> : ""
            }
        </div >

    )


}

export default Outgoing