'use server'

const client = require("@mailchimp/mailchimp_marketing");

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
