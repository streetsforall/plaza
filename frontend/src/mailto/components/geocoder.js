import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import React, { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import './geocoder.css';
import nieghborhoods from "../LA_Neighborhood_Councils.json";


const Geocoder = () => {

    const [place, setPlace] = useState('');
    const [locations, setLocations] = useState('');
    const [nieghborhood, setNeighborhood] = useState('');


    const findDistricts = (coords) => {
        console.log('coords:',coords)
        var pt = turf.point(coords);
        nieghborhoods.features.forEach(e => {
            var poly = e.geometry
            if (turf.booleanPointInPolygon(pt, poly)) {setNeighborhood(e.properties)}
        });
    }


    useEffect(() => {
        const getCoords = async () => {
            const body = {
                string: place
            }
            const response = await fetch(process.env.REACT_APP_API + 'geocoder', {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    'Content-type': 'application/json',
                 },
            });
            const jsonData = await response.json();
            setLocations(jsonData)
            console.log(jsonData)
         }
        if (place) {getCoords();}
        console.log(locations)
    }, [place]);




    return (
        <div id="geocoder">
            Geocoder
            <label>Enter Address</label>
            <input onChange={(e) => setPlace(e.target.value)}></input>
            <div id="dropdown">
                {locations ? locations.map(e => {
                    return (
                        <p onClick={() => findDistricts(e.center)}>{e.place_name}</p>)
                }) : ''}
            </div>

            {nieghborhood ? <div>nc: {nieghborhood.NAME}, {nieghborhood.DEMAIL}</div> : ''}

        </div>
    );


}

export default Geocoder;