'use server'

const client = require("@mailchimp/mailchimp_marketing");

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

client.setConfig({
  apiKey: process.env.MAILCHIMP_KEY,
  server: "us4",
});


export async function addMailchimp(email: string, merge_fields: any) {
  console.log(email, merge_fields)

  const run = async () => {
    const response = await client.lists.setListMember('948112d831',
      email,
      {
        email_address: email,
        merge_fields: merge_fields,
        status: "subscribed",
      });
    console.log(response);
  };

  run();

}

export async function getMailchimp() {
  const response = await client.campaigns.list({ list_id: "948112d831", status: "sent", sort_field: "send_time", sort_dir: "DESC" });

  var campaign = response['campaigns'][0]

  var campaign_url = campaign['long_archive_url']
  var campaign_subject = campaign['settings']['subject_line']
  var campaign_time = campaign['send_time']
  return [{
      'url': campaign_url,
      'subject': campaign_subject,
      'date': campaign_time
  }];
}

