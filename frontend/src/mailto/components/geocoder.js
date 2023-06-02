import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import React, { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import './geocoder.css';
import nieghborhoods from "../LA_Neighborhood_Councils.json";


const Geocoder = () => {

    const [place, setPlace] = useState('');
    const [locations, setLocations] = useState('');
    const [nieghborhood, setNeighborhood] = useState('');

    const getCoords = () => {
        return fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + place + '.json?country=US&proximity=-118.2497,34.048707&limit=5&autocomplete=false&types=place,postcode,address&access_token=' + process.env.REACT_APP_Mapbox_Token)
            .then(response => response.json())
            .then(data => setLocations(data.features))
    }

    const findDistricts = (coords) => {
        console.log('coords:',coords)
        var pt = turf.point(coords);
        nieghborhoods.features.forEach(e => {
            var poly = e.geometry
            if (turf.booleanPointInPolygon(pt, poly)) {setNeighborhood(e.properties)}
        });
    }


    useEffect(() => {
        getCoords(place)
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