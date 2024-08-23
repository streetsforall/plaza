import React, { useState, useEffect } from 'react';
import nieghborhoods from "../data/LA_Neighborhood_Councils.json";
import metro from "../data/metro.json";
import cds from "../data/LA_City_Council_Districts.json";
// import assembly from "../data/CA_Assembly_Districts.json";
import senate from "../data/CA_Senate_Districts.json";
import Santa_Monica from "../data/Santa_Monica.json";


import { geoLoader } from '../helpers/geo';




const Data_field = ({ recieverList, setRecieverList, updateEmail }) => {

    interface datafeatures {
        OBJECTID: number;
         NAME: string; 
         WADDRESS: string; 
         DWEBSITE: string; 
         DEMAIL: string; 
         DPHONE: string; 
         NC_ID: number; 
         CERTIFIED: string;
        TOOLTIP: string; 
        NLA_URL: string; 
        SERVICE_RE: string;
    }


    const [data, setData] = useState<any>([]);
    const [deputies, setDeputies] = useState(false)
    const [dataSource, setdataSource] = useState('')

    useEffect(() => {
        if (dataSource === "nc") { setData(nieghborhoods.features) }
        else if (dataSource === "cd") { setData(cds.features) }
        else if (dataSource === "metro") { setData(metro.features) }
        else if (dataSource === "santamonica") { setData(Santa_Monica.features) }
        // else if (dataSource === "assembly") { setData(assembly.features) }
        else if (dataSource === "senate") { setData(senate.features) }
        console.log(data)
    }, [dataSource])

    // need to rewrite this whole componenet to injest from our API
    // const geodata = geoLoader(e, false);

    const addAll = () => {
        const emails = data.map(e => e.properties.DEMAIL).join();
        var deputiesList = ''
        if (deputies) {
            var deputiesList : string = data.map(e => e.properties.Deputy).join();
            console.log('deputiesList', deputiesList)
        }

        var combined = deputiesList + ',' + emails
        console.log(combined)

        // var addedlist = []
        // // if (recieverList != null) { 
        // //     var addedlist = recieverList.concat(deputiesList, emailsList) 
        // //     console.log('added', addedlist)
        // // }
        // // else if (recieverList.length == 0) { var addedlist = emailsList }
        // console.log(combined)
        // addEmail(combined)
    }




    // add email from selector array
    const addEmail = (localEmail, deputyEmail) => {

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
        <div className="data_field">
<h3>Email Library</h3>     
<label>Use this to select emails of representatives</label> <br/> <br/>
            <div id="filter" >
                <button className={dataSource === 'nc' ? 'selected': ""} onClick={() => { setdataSource('nc'); setDeputies(false) }}>LA Nieghborhood Councils</button>
                <button className={dataSource === 'cd' ? 'selected': ""}onClick={() => { setdataSource('cd') }}>LA City Council</button>
                <button className={dataSource === 'metro' ? 'selected': ""} onClick={() => { setdataSource('metro') }}>Metro</button>
                <button className={dataSource === 'santamonica' ? 'selected': ""} onClick={() => { setdataSource('santamonica') }}>Santa Monica</button>
                <button className={dataSource === 'assembly' ? 'selected': ""} onClick={() => { setdataSource('assembly') }}>Assembly</button>
                <button className={dataSource === 'senate' ? 'selected': ""} onClick={() => { setdataSource('senate') }}>Senate</button>
            </div >

            <div className={data != '' ? "shown" : "hidden"} id="options">
                <div id="filter_header">
                    <button onClick={(e) => { addAll() }}>Add All</button>
                    <button className={dataSource == 'metro' || dataSource == 'cd' ? "shown" : "hidden"} onClick={(e) => { setDeputies(!deputies) }}>{!deputies ? 'Include Deputies' : 'Exclude Deputies'}</button>
                    <button className="hider" onClick={() => { setData(''); setdataSource('')  }}>X</button>
                </div>
                <table>


                    {data != '' ? data.map((locals, i) => {
                        if (locals.properties.DEMAIL) {
                            return (
                                <tr data-email={locals.properties.DEMAIL}
                                    className="geo_selector"
                                    onClick={(e) => { addEmail(locals.properties.DEMAIL, locals.properties.Deputy) }}>
                                    <td className={locals.properties.District ? "short shown" : "short hidden"}>{locals.properties.District}</td>
                                    <td>{locals.properties.NAME}</td>
                                    <td className="data_email">{locals.properties.DEMAIL}</td>
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
