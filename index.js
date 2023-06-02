require('dotenv').config();


const express = require('express')
const fetch = require("node-fetch");

const PORT = process.env.PORT || 3001;
const app = express()

const cors = require('cors')
const helmet = require('helmet')
const client = require('@mailchimp/mailchimp_marketing');
const { Octokit, App } = require("octokit");

const octokit = new Octokit({ auth: process.env.GIT_KEY });

client.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER,
});

app.use(express.json());

const library = {
    owner: "streetsforall",
    repo: "library",
    path: "email_generator.json",
}

app.use(cors())
app.use(helmet())

// This displays message that the server running and listening to specified port
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


// this gets the most recent mailchimp blast for serving to the streetsforall.org splash page
const getCampaigns = async () => {
    const response = await client.campaigns.list({ list_id: "948112d831", status: "sent", sort_field: "send_time", sort_dir: "DESC" });

    var campaign = response['campaigns'][0]

    campaign_url = campaign['long_archive_url']
    campaign_subject = campaign['settings']['subject_line']
    campaign_time = campaign['send_time']
    return [{
        'url': campaign_url,
        'subject': campaign_subject,
        'date': campaign_time
    }];
}


// read from our mailto database hosted on GitHub
app.get('/email/reader', async (req, res) => {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: "streetsforall",
      repo: "library",
      path: "email_generator.json",
    })
    json = JSON.parse(atob(data.content))
    console.log(json)
    res.json(json);

});

// post to our mailto database hosted on GitHub
app.post('/email/poster', async (req, res) => {

      const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: "streetsforall",
        repo: "library",
        path: "email_generator.json",
      })

      json = JSON.parse(atob(data.content))
      const match = json.data.findIndex(val => val.url == req.body.url)

      if (match != -1) {
        json.data[match] = req.body
      } else {
        req.body ? json.data.push(req.body) : ''
      }
      
      const SHA = data.sha

      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: 'streetsforall',
        repo: 'library',
        sha: SHA,
        path: 'email_generator.json',
        message: 'updating DB',
        content:  btoa(JSON.stringify(json)),
      })

      res.json(btoa(JSON.stringify(json)));
});

app.post('/geo', async (req, res) => {
    const place = req.body

    // const place = JSON.parse(req.body)
    return fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + place.string + '.json?country=US&proximity=-118.2497,34.048707&limit=5&autocomplete=false&types=place,postcode,address&access_token=' + process.env.Mapbox_Token)
            .then(response => response.json())
            .then(data => res.send(data.features))
})


app.get('/cta', async (req, res) => {
    const Data = await getCampaigns();
    res.send({ Data });
});

app.get('/test', async (req, res) => {
    res.send({ 'test':'do we have a living backend????' });
});

app.get('/', async (req, res) => {
    res.send( 'welcome to the SFA API' );
});