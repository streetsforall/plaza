import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import React, { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import './geocoder.css';
import nieghborhoods from "../data/LA_Neighborhood_Councils.json";
import cds from "../data/LA_City_Council_Districts.json";
import assemblies from "../data/CA_Assembly_Districts.json";
import senates from "../data/CA_Senate_Districts.json";


const Geocoder = ({ recieverList, setRecieverList, updateEmail }) => {

    const [place, setPlace] = useState('');
    const [locations, setLocations] = useState('');
    const [nieghborhood, setNeighborhood] = useState('');
    const [cd, setCD] = useState('');
    const [assembly, setAssembly] = useState('');
    const [senate, setSenate] = useState('');
    const [showDrop, setshowDrop] = useState(false);

    const findDistricts = (coords) => {
        var pt = turf.point(coords);
        nieghborhoods.features.forEach(e => {
            var poly = e.geometry
            if (turf.booleanPointInPolygon(pt, poly)) { setNeighborhood(e.properties) }
        });
        cds.features.forEach(e => {
            var poly = e.geometry
            if (turf.booleanPointInPolygon(pt, poly)) { setCD(e.properties) }
        });
        assemblies.features.forEach(e => {
            var poly = e.geometry
            if (turf.booleanPointInPolygon(pt, poly)) { setAssembly(e.properties) }
        });
        senates.features.forEach(e => {
            var poly = e.geometry
            if (turf.booleanPointInPolygon(pt, poly)) { setSenate(e.properties) }
        });
        setshowDrop(false)
    }

    const addEmail = (localEmail, e) => {
        var list = recieverList
        localEmail = localEmail.toString()
        var localEmail = localEmail.split(",").flat().filter(Boolean)
        if (!list.includes(localEmail)) {
            list.push(localEmail);
        } else {
            list.splice(list.indexOf(localEmail), 1);
        }
        list = list.flat()
        setRecieverList(list)
        updateEmail()
    }


    useEffect(() => {

        const getCoords = async () => {

            var body = {
                string: place
            }
            var body = JSON.stringify(body)
            const response = await fetch(process.env.REACT_APP_API + 'geo', {
                method: "POST",
                body: body,
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const jsonData = await response.json();
            setLocations(jsonData)
        }
        if (place) { getCoords(); }
        console.log(locations)
    }, [place]);




    return (

        <div class="window" id="geocoder">
            {/* <button class="hider" onClick={() => setshowGeo(!showGeo)}>X</button> */}
            Geocoder
            <label >Use this to find the emails of electeds responsible for an address</label>
            <div id="geo_body">
                <label>Enter Address</label>
                <input onChange={(e) => setPlace(e.target.value)}></input>
                <div id="dropdown">
                    {locations ? locations.map(e => {
                        return (
                            <p onClick={() => findDistricts(e.center)}>{e.place_name}</p>)
                    }) : ''}
                </div>

                <div class={senate ? 'shown' : "hidden"} id="geo_return">

                    <div id="header">
                        <button onClick={() => addEmail([cd.DEMAIL + ',' + nieghborhood.DEMAIL + ',' + assembly.DEMAIL + ',' + senate.DEMAIL])}>
                            ADD ALL
                        </button>
                    </div>

                    <table>

                        {cd ? <tr onClick={() => addEmail(cd.DEMAIL)} class="geo_selector">
                            <td class="geo_title">Council District:</td>
                            <td>{cd.NAME}</td>
                            <td class="geo_mail" >
                                {cd.DEMAIL}
                            </td>
                        </tr> : ''}

                        {nieghborhood ? <tr onClick={() => addEmail(nieghborhood.DEMAIL)} class="geo_selector">
                            <td class="geo_title">Nieghborhood Council: </td>
                            <td >{nieghborhood.NAME}</td>
                            <td class="geo_mail" >
                                {nieghborhood.DEMAIL}
                            </td>
                        </tr> : ''}
                        {assembly ? <tr onClick={() => addEmail(assembly.DEMAIL)} class="geo_selector">
                            <td class="geo_title">Assembly: </td>
                            <td >{assembly.NAME}</td>
                            <td class="geo_mail" >
                                {assembly.DEMAIL}
                            </td>
                        </tr> : ''}
                        {senate ? <tr onClick={() => addEmail(senate.DEMAIL)} class="geo_selector">
                            <td class="geo_title">Senate: </td>
                            <td >{senate.NAME}</td>
                            <td class="geo_mail" >
                                {senate.DEMAIL}
                            </td>
                        </tr> : ''}
                    </table>
                </div>
            </div>

        </div>
    );


}

export default Geocoder;