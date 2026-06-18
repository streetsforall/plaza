import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Instead of req.json() b/c errors when request body null
  const body = JSON.parse(await req.text());

  const response = await fetch(
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      body.string +
      '.json?country=US&proximity=-118.2497,34.048707&limit=5&autocomplete=false&types=place,postcode,address&access_token=' +
      process.env.Mapbox_Token,
  );
  const data = await response.json();

  return NextResponse.json(data.features, { status: 200 });
}
