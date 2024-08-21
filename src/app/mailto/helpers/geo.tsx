'use server'

export default async function geo(place) {

    return fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + place.string + '.json?country=US&proximity=-118.2497,34.048707&limit=5&autocomplete=false&types=place,postcode,address&access_token=' + process.env.Mapbox_Token)
            .then(response => response.json())
            .then(data => {return(data.features)})
}