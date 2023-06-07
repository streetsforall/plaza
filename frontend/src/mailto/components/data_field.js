import React, { useState, useEffect } from 'react';
import nieghborhoods from "../data/LA_Neighborhood_Councils.json";
import contacts from "../data/metro.json";
import cds from "../data/LA_City_Council_Districts.json";



const Data_field = ({recieverList, setRecieverList, updateEmail}) => {


    const [data, setData] = useState('');

    const getData = (dataSource) => {
        if (dataSource === "nc") { setData(nieghborhoods.features) }
        else if (dataSource === "cd") { setData(cds.features) }
        else if (dataSource === "metro") { setData(contacts.Metro) }
        console.log(data)
    }

    const addAll = () => {
        const result = data.map(e => e.properties.DEMAIL).join();
        const list = result.split(",")
        console.log(recieverList, list)
        var addedlist = []
        if (recieverList.length > 0) {var addedlist = recieverList.concat(list) }
        else if (recieverList.length == 0 ) {var addedlist  = list}
        setRecieverList(addedlist)
    }


    // add email from selector array
    const addEmail = (localEmail, e) => {
        // if (e) { e.target.classList.toggle('chosen')}
        var list = recieverList
        // add if email is new
        if (!list.includes(localEmail)) {
            list.push(localEmail);
        } else {
            list.splice(list.indexOf(localEmail), 1);
        }

        setRecieverList(list)
        updateEmail()
    }




    return (
        <div id="data_field">

            <div id="filter" >
                <button onClick={() => { getData('nc') }}>LA Nieghborhood Councils</button>
                <button onClick={() => { getData('cd') }}>LA City Council</button>
                <button onClick={() => { getData('metro') }}>Metro</button>
                <button onClick={() => { setData('') }}>X</button>
            </div >

            <div class={data != '' ? "shown" : "hidden"} id="options">
            {data != '' ? <span class="geo_selector" onClick={(e) => { addAll(data) }}>ADD ALL</span> : '' }
                {data != '' ? data.map((locals, i) => {
                    if (locals.properties.DEMAIL) {return(

                    <span data-email={locals.properties.DEMAIL} 
                    class="geo_selector" index={i} 
                    onClick={(e) => { addEmail(locals.properties.DEMAIL, e, i) }}>
                    <span class={locals.properties.District ? "short shown" : "short hidden" }>{locals.properties.District}</span>
                    <span>{locals.properties.NAME}</span>
                    <span>{locals.properties.DEMAIL}</span>
                    </span>
                )}}) : ''}
               
            </div>
        </div >
    )
}

export default Data_field;
