import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import React, { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import './geocoder.css';
import nieghborhoods from "../data/LA_Neighborhood_Councils.json";
import cds from "../data/LA_City_Council_Districts.json";


const Geocoder = ({ recieverList, setRecieverList, updateEmail }) => {

    const [place, setPlace] = useState('');
    const [locations, setLocations] = useState('');
    const [nieghborhood, setNeighborhood] = useState('');
    const [cd, setCD] = useState('');
    const [showDrop, setshowDrop] = useState(false);

    const findDistricts = (coords) => {
        console.log('coords:', coords)
        var pt = turf.point(coords);
        nieghborhoods.features.forEach(e => {
            var poly = e.geometry
            if (turf.booleanPointInPolygon(pt, poly)) { setNeighborhood(e.properties) }
        });
        cds.features.forEach(e => {
            var poly = e.geometry
            if (turf.booleanPointInPolygon(pt, poly)) { setCD(e.properties) }
        });
    }

    const addEmail = (localEmail, e) => {
        var list = recieverList
        if (!list.includes(localEmail)) {
            list.push(localEmail);
        } else {
            list.splice(list.indexOf(localEmail), 1);
        }

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
        <div id="geocoder">
            Geocoder
            <p class="tooltip">Use this to find the emails of electeds responsible for an address</p>
            <label>Enter Address</label>
            <input onChange={(e) => setPlace(e.target.value)}></input>
            <div id="dropdown">
                {locations ? locations.map(e => {
                    return (
                        <p onClick={() => findDistricts(e.center)}>{e.place_name}</p>)
                }) : ''}
            </div>

            <div id="geo_return">

                {cd ? <div class="geo_result">
                    <span class="geo_title">Council District</span>
                    <span>{cd.NAME}</span>
                    <span class="geo_selector" onClick={() => addEmail(cd.DEMAIL)}>
                        {cd.DEMAIL}
                    </span>
                </div> : ''}

                {nieghborhood ? <div class="geo_result">
                    <span class="geo_title">Nieghborhood Council: </span>
                    <span >{nieghborhood.NAME}</span>
                    <span class="geo_selector" onClick={() => addEmail(nieghborhood.DEMAIL)}>
                        {nieghborhood.DEMAIL}
                    </span>
                </div> : ''}
            </div>

        </div>
    );


}

export default Geocoder;