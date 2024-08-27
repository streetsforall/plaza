'use server'

import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";


export async function geo(place) {

    return fetch('https://api.mapbox.com/search/geocode/v6/forward?q=' + place.string + '?country=US&proximity=-118.2497,34.048707&limit=5&autocomplete=false&types=place,locality,neighborhood,address&access_token=' + process.env.Mapbox_Token)
    
    .then(response => response.json())
            .then(data => {
                return(data.features)
            })
}



// this inputs a district geojson and set of coordinates and finds what feature the coords are inside
export async function districtFinder(coords, district) {

    var foundDistrict = []
    var pt = point(coords);

    // console.log('district', district)

    var startTime = performance.now();

    await district.features.map(e => {
        var poly = e.geometry
        if (booleanPointInPolygon(pt, poly)) {
            foundDistrict = e.properties.person
            console.log('found district 1')
            return('')
            }
            
    });
    console.log('foundDistrict 2', foundDistrict)

    var endTime = performance.now();
    var timeDiff = endTime - startTime; //in ms 
    // strip the ms 
    timeDiff /= 1000; 
    
    // get seconds 
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds to calculate ");
    
    return(foundDistrict)
}


// this loads all districts
export async function geoLoader(boundary, geo) {
    var district_link = ""  

    console.log('package', boundary,geo )

    if (boundary == "Assembly") { 
        district_link="state-assembly-districts"
    } else if (boundary == "Senate") { 
        district_link="state-senate-districts"
    } else {
        return('')
    }

    var districts = []

    var startTime = performance.now();

    await fetch(`https://geo-api-8a9lx.ondigitalocean.app/v1/`+district_link+`?geom=`+geo)
    .then((response => response.json())).then((res) =>  {
        districts = res
    })

    var endTime = performance.now();
    var timeDiff = endTime - startTime; //in ms 
    // strip the ms 
    timeDiff /= 1000; 
    
    // get seconds 
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds to load"+boundary);

    // console.log('response', districts)
    return(districts)
}
