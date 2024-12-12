
import { NextRequest, NextResponse } from "next/server";


export default async function handler(req, res) {
if (req.method === 'POST') {
  return fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + req.body.string + '.json?country=US&proximity=-118.2497,34.048707&limit=5&autocomplete=false&types=place,postcode,address&access_token=' + process.env.Mapbox_Token)
            .then(response => response.json())
            .then(data => res.send(data.features))
} else {
  // Handle any other HTTP method
  res.setHeader('Allow', ['GET']);
  res.status(200).end(`Method ${req.method} Not Allowed`, req.body);
}
}
