'use server';

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

import CA_AD from '../data/ca-ad.json';

/**
 * Address lookup
 * @param place - Search query
 * @returns Address
 */
export async function geo(place): Promise<GeoJSON.Feature[]> {
  return fetch(
    'https://api.mapbox.com/search/geocode/v6/forward?q=' +
      place.string +
      '?country=US&proximity=-118.2497,34.048707&limit=5&autocomplete=false&types=place,locality,neighborhood,address&access_token=' +
      process.env.Mapbox_Token,
  )
    .then((response) => response.json())
    .then((data) => {
      return data.features;
    });
}

// this inputs a district geojson and set of coordinates and finds what feature the coords are inside
export async function districtFinder(coords, district, people) {
  let foundDistrict = [];
  const pt = point(coords);

  // console.log('district', district)

  const startTime = performance.now();

  let foundPerson = [];

  console.log(district);

  for (const e of district.reverse()) {
    const poly = e.geometry;
    if (booleanPointInPolygon(pt, poly)) {
      foundDistrict = e.id;
      const district = people.features.filter((i) => i.id == e.id);
      foundPerson = district[0].properties.person;
      return foundPerson;
      break;
    }
  }

  const endTime = performance.now();
  let timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  const seconds = Math.round(timeDiff);
  console.log(seconds + ' seconds to calculate ');

  console.log(foundPerson);
  return foundPerson;
}

// this loads all district data but uses local geometry
export async function geoLoader(boundary, geo) {
  let district_link = '';

  console.log('package', boundary, geo);

  if (boundary == 'Assembly') {
    district_link = 'state-assembly-districts';
  } else if (boundary == 'Senate') {
    district_link = 'state-senate-districts';
  } else {
    return '';
  }

  const districts = CA_AD as GeoJSON.Feature[];

  let people = [];

  const startTime = performance.now();

  console.log('loading in districts');

  await fetch(
    `https://geo-api-8a9lx.ondigitalocean.app/v1/` +
      district_link +
      `?geom=` +
      false,
  )
    .then((response) => response.json())
    .then((res) => {
      people = res;
    });

  console.log('districts loaded');

  const endTime = performance.now();
  let timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  const seconds = Math.round(timeDiff);
  console.log(seconds + ' seconds to load' + boundary);

  // console.log('response', districts)
  return { districts, people };
}

/**
 * Retrieve district meta and optionally geometry from API
 * @param boundary - District type
 * @param coords - Coordinate to search for
 * @param geo - Whether to retrieve geometry
 * @returns District feature of the provided point
 */
export async function combinedGeo(
  boundary,
  coords,
  geo,
): Promise<GeoJSON.Feature | null> {
  let foundDistrict = null;

  const pt = point(coords);

  let district_link = '';
  const district_short = '';

  console.log('package', boundary, coords, geo);

  // Determine the API endpoint and district prefix based on the boundary
  if (boundary === 'Assembly') {
    district_link = 'state-assembly-districts';
  } else if (boundary === 'Senate') {
    district_link = 'state-senate-districts';
  } else {
    return null; // Return null if no valid boundary is passed
  }

  const startTime = performance.now();

  console.log('loading in districts');

  try {
    const response = await fetch(
      `https://geo-api-8a9lx.ondigitalocean.app/v1/${district_link}?geom=${geo}`,
    );
    const districts = await response.json();

    for (const district of districts.features) {
      const poly = district.geometry; // Get the district's geometry (polygon)

      // Check if the point is inside the district's polygon
      if (booleanPointInPolygon(pt, poly)) {
        foundDistrict = district; // Store district info if found
        console.log(district);
        console.log('found district');
        break; // Exit loop once the district is found
      }
    }
  } catch (error) {
    console.error('Error fetching district data:', error);
  }

  const endTime = performance.now();
  const timeDiff = (endTime - startTime) / 1000; // Convert to seconds
  console.log(`${Math.round(timeDiff)} seconds to search ${boundary}`);

  // Return the found district (or null if no district is found)
  return foundDistrict;
}

// /////

// export async function combinedGeo(boundary, coords, geo) {

//     var foundDistrict = []
//     var pt = point(coords);

//     var district_link = ""
//     var district_short = ''

//     console.log('package', boundary, coords, geo)

//     if (boundary == "Assembly") {
//         district_link = "state-assembly-districts"
//         district_short = "ad-"
//     } else if (boundary == "Senate") {
//         district_link = "state-senate-districts"
//         district_short = "sd-"
//     } else {
//         return ('')
//     }

//     var startTime = performance.now();

//     console.log('loading in districts')

//     var district: any = {}

//     const looper = [...Array(100)].map(async (_, i) => {
//         if (i != 0) {

//             // 'https://geo-api-8a9lx.ondigitalocean.app/v1/state-assembly-districts/ad-51?geom=true'

//             await fetch(`https://geo-api-8a9lx.ondigitalocean.app/v1/` + district_link + '/' + district_short + i + `?geom=` + geo)
//                 .then((response => response.json())).then((res) => {

//                     console.log(`https://geo-api-8a9lx.ondigitalocean.app/v1/` + district_link + '/' + district_short + i + `?geom=` + geo)

//                     console.log('res', res)

//                     var poly = res['geometry']

//                     if (booleanPointInPolygon(pt, poly)) {
//                         foundDistrict = res.properties.person
//                         console.log('found district 1')
//                         return (foundDistrict)
//                     }
//                 })
//         }

//     })

//     console.log('foundDistrict', foundDistrict)

//     var endTime = performance.now();
//     var timeDiff = endTime - startTime; //in ms
//     // strip the ms
//     timeDiff /= 1000;

//     // get seconds
//     var seconds = Math.round(timeDiff);
//     console.log(seconds + " seconds to load" + boundary);

//     // console.log('response', districts)
//     return (foundDistrict)

// }
