import React, { useState, useEffect } from 'react';
import nieghborhoods from "../LA_Neighborhood_Councils.json";



const Data_field = ({recieverList, setRecieverList, updateEmail}) => {


    const [data, setData] = useState('');

    const getData = (dataSource) => {
        if (data !== '') { setData('') } else if (dataSource === "nc") { setData(nieghborhoods.features) }

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

        setRecieverList(list)
        updateEmail()
    }


    return (
        <div>

            <div id="filter" >
                <button onClick={() => { getData('nc') }}>LA Nieghborhood Councils</button>
            </div >

            <div id="options">
                {data != '' ? data.map((locals, i) => {
                    return (<span data-email={locals.properties.DEMAIL} class="geo_selector" index={i} onClick={(e) => { addEmail(locals.properties.DEMAIL, e, i) }}> {locals.properties.NAME} </span>)
                }) : ''}
            </div>
        </div >
    )
}

export default Data_field;
