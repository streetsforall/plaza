require('dotenv').config();

const express = require('express')

const PORT = process.env.PORT || 3001;
const app = express()

const cors = require('cors')
const helmet = require('helmet')
const client = require('@mailchimp/mailchimp_marketing');


client.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER,
});

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