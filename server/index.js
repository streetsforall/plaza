require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;


const client = require('@mailchimp/mailchimp_marketing');

client.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER,
});

const getCampaigns = async () => {
    const response = await client.campaigns.list({ sort_field: "send_time", sort_dir: "DESC" });
    var campaign = response['campaigns'][0]
    console.log('campaigns', campaign);

    campaign_url = campaign['long_archive_url']
    campaign_subject = campaign['settings']['subject_line']
    campaign_time = campaign['send_time']

    return [{
        'url': campaign_url,
        'subject': campaign_subject,
        'date': campaign_time
    }];
}

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));


app.get('/api/cta', async (req, res) => {
    const Data = await getCampaigns();
    res.send({ Data });

});



app.get('/', function (req, res) {
    res.send({ mail: 'hello' })
});


app.get('/api', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
});