'use server';

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import { geotargetOptions, GeotargetOptions } from '@/types/geo';

const GEODATA_API_BASE_URL = process.env.GEODATA_API_BASE_URL;
const MAPBOX_TOKEN = process.env.Mapbox_Token;

/**
 * Address lookup
 * @param place - Search query
 * @returns Address
 */
async function searchAddress(place): Promise<GeoJSON.Feature[]> {
  return fetch(
    `https://api.mapbox.com/search/geocode/v6/forward?q=${place.string}?country=US&proximity=-118.2497,34.048707&limit=5&autocomplete=false&types=place,locality,neighborhood,address&access_token=${MAPBOX_TOKEN}`,
  )
    .then((response) => response.json())
    .then((data) => {
      return data.features;
    });
}

/**
 * Retrieve district from API based on coordinates
 * @param type - District type
 * @param coords - Coordinates to locate
 * @returns District feature of the provided point
 */
async function findDistrict(
  type: GeotargetOptions,
  coords: GeoJSON.Position,
): Promise<GeoJSON.Feature | null> {
  let foundDistrict = null;

  const pt = point(coords);

  console.log('package', type, coords);

  // Determine API endpoint and district prefix based on type
  const endpoint =
    geotargetOptions.find((option) => option.name === type)?.endpoint || null; // Return null if no valid type provided

  const startTime = performance.now();

  console.log('loading in districts');

  try {
    const response = await fetch(
      `${GEODATA_API_BASE_URL}/v1/${endpoint}?geom=true`,
    );
    const districts = (await response.json()).features;

    for (const district of districts) {
      const poly = district.geometry; // Get district's geometry (polygon)

      // Check if point is inside district's polygon
      if (booleanPointInPolygon(pt, poly)) {
        foundDistrict = district; // Store district info if found
        console.log(district);
        console.log('found district');

        break; // Exit loop once district found
      }
    }
  } catch (error) {
    console.error('Error fetching district data:', error);
  }

  const endTime = performance.now();
  const timeDiff = (endTime - startTime) / 1000; // Convert to seconds
  console.log(`${Math.round(timeDiff)} seconds to search ${type}`);

  // Return found district (or null if no district found)
  return foundDistrict;
}

export { findDistrict, searchAddress };
