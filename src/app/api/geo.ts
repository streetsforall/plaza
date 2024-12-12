
import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  return fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + req.body.string + '.json?country=US&proximity=-118.2497,34.048707&limit=5&autocomplete=false&types=place,postcode,address&access_token=' + process.env.Mapbox_Token)
            .then(response => response.json())
            .then(data => res.send(data.features))
}