// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import React, { useEffect, useState } from 'react';
// import * as turf from '@turf/turf';
// import './geocoder.css';
// import nieghborhoods from "../data/LA_Neighborhood_Councils.json";
// import cds from "../data/LA_City_Council_Districts.json";
// import assemblies from "../data/CA_Assembly_Districts.json";
// import senates from "../data/CA_Senate_Districts.json";
// import {geo} from "../helpers/geo"


// const Geocoder = ({ recieverList, setRecieverList, updateEmail }) => {

//     const [place, setPlace] = useState('');
//     const [locations, setLocations] = useState('');
//     const [nieghborhood, setNeighborhood] = useState<any>();
//     const [cd, setCD] = useState();
//     const [assembly, setAssembly] = useState();
//     const [senate, setSenate] = useState('');
//     const [showDrop, setshowDrop] = useState(false);

//     const findDistricts = (coords) => {
//         var pt = turf.point(coords);
//         nieghborhoods.features.forEach(e => {
//             var poly = e.geometry
//             if (turf.booleanPointInPolygon(pt, poly)) { setNeighborhood(e.properties) }
//         });
//         cds.features.forEach(e => {
//             var poly = e.geometry
//             if (turf.booleanPointInPolygon(pt, poly)) { setCD(e.properties) }
//         });
//         assemblies.features.forEach(e => {
//             var poly = e.geometry
//             if (turf.booleanPointInPolygon(pt, poly)) { setAssembly(e.properties) }
//         });
//         senates.features.forEach(e => {
//             var poly = e.geometry
//             if (turf.booleanPointInPolygon(pt, poly)) { setSenate(e.properties) }
//         });
//         setshowDrop(false)
//     }

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


//     useEffect(() => {

//         const getCoords = async () => {

//             var body = {
//                 string: place
//             }

//             // var body = JSON.stringify(body)

//             // const response = await fetch(process.env.REACT_APP_API + 'geo', {
//             //     method: "POST",
//             //     body: body,
//             //     headers: {
//             //         'Content-type': 'application/json',
//             //     },
//             // });
//             const jsonData = await geo(body);
//             setLocations(jsonData)
//         }
//         if (place) { getCoords(); }
//         console.log(locations)
//     }, [place]);




//     return (

//         <div className="bg-bg m-auto mt-12 p-4 rounded-2xl text-xl max-w-xl w-[calc(100%-2rem)]">
//             {/* <button className="sticky !bg-bg hover:!bg-button !border !border-gray-400 left-[770px] top-0 m-1 px-2 py-0.5 rounded hover:underline w-8" onClick={() => setshowGeo(!showGeo)}>X</button> */}
//             <h3>Geocoder</h3>
//             <label >Use this to find the emails of electeds responsible for an address</label>
//             <div id="geo_body">
//                 <label>Enter Address</label>
//                 <input className="text-base text-xl w-[calc(100%-1rem)]" onChange={(e) => setPlace(e.target.value)}></input>
//                 <div id="dropdown">
//                     {locations ? locations.map(e => {
//                         return (
//                             <p onClick={() => findDistricts(e.center)}>{e.place_name}</p>)
//                     }) : ''}
//                 </div>

//                 <div className={!senate ? 'hidden' : ""} id="geo_return">

//                     <div id="header">
//                         <button className="text-sm md:text-base" onClick={() => addEmail([cd.DEMAIL + ',' + nieghborhood.DEMAIL + ',' + assembly.DEMAIL + ',' + senate.DEMAIL])}>
//                             ADD ALL
//                         </button>
//                     </div>

//                     <table>

//                         {cd ? <tr onClick={() => addEmail(cd.DEMAIL)} className="hover:!bg-soft-bg cursor-pointer leading-normal p-1 min-w-full w-full">
//                             <td className="geo_title">Council District:</td>
//                             <td>{cd.NAME}</td>
//                             <td className="geo_mail" >
//                                 {cd.DEMAIL}
//                             </td>
//                         </tr> : ''}

//                         {nieghborhood ? <tr onClick={() => addEmail(nieghborhood.DEMAIL)} className="hover:!bg-soft-bg cursor-pointer leading-normal p-1 min-w-full w-full">
//                             <td className="geo_title">Nieghborhood Council: </td>
//                             <td >{nieghborhood.NAME}</td>
//                             <td className="geo_mail" >
//                                 {nieghborhood.DEMAIL}
//                             </td>
//                         </tr> : ''}
//                         {assembly ? <tr onClick={() => addEmail(assembly.DEMAIL)} className="hover:!bg-soft-bg cursor-pointer leading-normal p-1 min-w-full w-full">
//                             <td className="geo_title">Assembly: </td>
//                             <td >{assembly.NAME}</td>
//                             <td className="geo_mail" >
//                                 {assembly.DEMAIL}
//                             </td>
//                         </tr> : ''}
//                         {senate ? <tr onClick={() => addEmail(senate.DEMAIL)} className="hover:!bg-soft-bg cursor-pointer leading-normal p-1 min-w-full w-full">
//                             <td className="geo_title">Senate: </td>
//                             <td >{senate.NAME}</td>
//                             <td className="geo_mail" >
//                                 {senate.DEMAIL}
//                             </td>
//                         </tr> : ''}
//                     </table>
//                 </div>
//             </div>

//         </div>
//     );


// }

// export default Geocoder;