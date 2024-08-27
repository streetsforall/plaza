'use server'

import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";


export async function geo(place) {

    return fetch('https://api.mapbox.com/search/geocode/v6/forward?q=' + place.string + '?country=US&proximity=-118.2497,34.048707&limit=5&autocomplete=false&types=place,locality,neighborhood,address&access_token=' + process.env.Mapbox_Token)
    
    .then(response => response.json())
            .then(data => {
                console.log(data.features)
                return(data.features)
            })
}



// this inputs a district geojson and set of coordinates and finds what feature the coords are inside
export async function districtFinder(coords, district) {

    var foundDistrict = []
    var pt = point(coords);

    // console.log('district', district)

    await district.features.forEach(e => {
        var poly = e.geometry
        console.log(e)
        if (booleanPointInPolygon(pt, poly)) {
            foundDistrict = e.properties.person
            }
    });
    // console.log('foundDistrict', foundDistrict)
    
    return(foundDistrict)
}

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

    await fetch(`https://geo-api-8a9lx.ondigitalocean.app/v1/`+district_link+`?geom=`+geo)
    .then((response => response.json())).then((res) =>  {
        districts = res
    })

    // console.log('response', districts)
    return(districts)
}








// export async function districtFinder(localEmail) {
//     const addEmail = (localEmail) => {
//         var list = recieverList
//         localEmail = localEmail.toString()
//         var localEmail = localEmail.split(",").flat().filter(Boolean)
//         if (!list.includes(localEmail)) {
//             list.push(localEmail);
//         } else {
//             list.splice(list.indexOf(localEmail), 1);
//         }
//         list = list.flat()
//         setRecieverList(list)
//         updateEmail()
//     }


// const getCoords = async () => {

//     var body = {
//         string: place
//     }

//     const jsonData = await geo(body);

// }
