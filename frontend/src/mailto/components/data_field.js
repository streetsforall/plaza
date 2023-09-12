import React, { useState, useEffect } from 'react';
import nieghborhoods from "../data/LA_Neighborhood_Councils.json";
import metro from "../data/metro.json";
import cds from "../data/LA_City_Council_Districts.json";
import assembly from "../data/CA_Assembly_Districts.json";
import senate from "../data/CA_Senate_Districts.json";
import Santa_Monica from "../data/Santa_Monica.json";



const Data_field = ({ recieverList, setRecieverList, updateEmail }) => {


    const [data, setData] = useState('');
    const [deputies, setDeputies] = useState(false)
    const [dataSource, setdataSource] = useState('')

    useEffect(() => {
        if (dataSource === "nc") { setData(nieghborhoods.features) }
        else if (dataSource === "cd") { setData(cds.features) }
        else if (dataSource === "metro") { setData(metro.features) }
        else if (dataSource === "santa monica") { setData(Santa_Monica.features) }
        else if (dataSource === "assembly") { setData(assembly.features) }
        else if (dataSource === "senate") { setData(senate.features) }
        console.log(data)
    }, [dataSource])

    const addAll = () => {
        const emails = data.map(e => e.properties.DEMAIL).join();
        var deputiesList = ''
        if (deputies) {
            var deputiesList = data.map(e => e.properties.Deputy).join();
            console.log('deputiesList', deputiesList)
        }


        
        var combined = deputiesList + ',' + emails
        console.log(combined)

        var addedlist = []
        // if (recieverList != null) { 
        //     var addedlist = recieverList.concat(deputiesList, emailsList) 
        //     console.log('added', addedlist)
        // }
        // else if (recieverList.length == 0) { var addedlist = emailsList }
        console.log(combined)
        addEmail(combined)
    }




    // add email from selector array
    const addEmail = (localEmail, deputyEmail, e, i) => {

        if (deputies && deputyEmail) {
            localEmail = localEmail + ', ' + deputyEmail
            console.log(localEmail)
        }

        localEmail =  localEmail.toString()


        var list = recieverList

        console.log(localEmail)
        // this cleans out nulls and unifies array
        var localEmail = localEmail.split(",").flat().filter(Boolean)
        localEmail.forEach(email => {
            // filters out nulls and duplicates
            if (!list.includes(email)) {
                console.log('good', email)
                list.push(email);
                list  = list.flat()
            } else {
                console.log('bad', email)
                list.splice(list.indexOf(email), 1);
            }
        })
        // add if email is new
        

        console.log(list)

        setRecieverList(list)
        updateEmail()
    }




    return (
        <div id="data_field">

            <label>Email Library</label>
            <div id="filter" >
                <button class={dataSource === 'nc' ? 'selected': ""} onClick={() => { setdataSource('nc'); setDeputies(false) }}>LA Nieghborhood Councils</button>
                <button class={dataSource === 'cd' ? 'selected': ""}onClick={() => { setdataSource('cd') }}>LA City Council</button>
                <button class={dataSource === 'metro' ? 'selected': ""} onClick={() => { setdataSource('metro') }}>Metro</button>
                <button class={dataSource === 'santamonica' ? 'selected': ""} onClick={() => { setdataSource('santa monica') }}>Santa Monica</button>
                <button class={dataSource === 'assembly' ? 'selected': ""} onClick={() => { setdataSource('assembly') }}>Assembly</button>
                <button class={dataSource === 'senate' ? 'selected': ""} onClick={() => { setdataSource('senate') }}>Senate</button>
            </div >

            <div class={data != '' ? "shown" : "hidden"} id="options">
                <div id="filter_header">
                    <button onClick={(e) => { addAll(data) }}>Add All</button>
                    <button class={dataSource == 'metro' || dataSource == 'cd' ? "shown" : "hidden"} onClick={(e) => { setDeputies(!deputies) }}>{!deputies ? 'Include Deputies' : 'Exclude Deputies'}</button>
                    <button class="hider" onClick={() => { setData(''); setdataSource('')  }}>X</button>
                </div>
                <table>


                    {data != '' ? data.map((locals, i) => {
                        if (locals.properties.DEMAIL) {
                            return (
                                <tr data-email={locals.properties.DEMAIL}
                                    class="geo_selector" index={i}
                                    onClick={(e) => { addEmail(locals.properties.DEMAIL, locals.properties.Deputy, e, i) }}>
                                    <td class={locals.properties.District ? "short shown" : "short hidden"}>{locals.properties.District}</td>
                                    <td>{locals.properties.NAME}</td>
                                    <td class="data_email">{locals.properties.DEMAIL}</td>
                                    <td>{deputies ? locals.properties.Deputy : ''}</td>
                                </tr>
                            )
                        }
                    }) : ''}
                </table>
            </div>
        </div >
    )
}

export default Data_field;
