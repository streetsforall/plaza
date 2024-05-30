import React, { useState, useEffect } from 'react';

const Outgoing = ({ outList, setOutList }) => {

    // this component manages the outlist 


    const addOut = (item) => {

        var itemlist = outList
        if(!itemlist.includes(item)){          //checking if array contains the id
            itemlist.push(item);               //adding to array because value doesnt exists
        }else{
            itemlist.splice(itemlist.indexOf(item), 1);  //deleting
        }
        setOutList(itemlist)
        console.log(outList)
    }



    return (
        <div>
            <div>
                Pick emailfields for the audience to autofill:
                <button onClick={(e) => { addOut('Assembly') }}>Assembly</button>
                <button onClick={(e) => { addOut('Senate') }}>Senate</button>
                {outList}
            </div>
        </div>

    )


}

export default Outgoing