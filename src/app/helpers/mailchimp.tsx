'use server';

import client from '@mailchimp/mailchimp_marketing';

interface MergeFields {
  ADD_ST: string;
  ADD_CITY: string;
  ADD_ZIP: string;
  ADD_STATE: string;
  ADD_COUNTR: string;
}

client.setConfig({
  apiKey: process.env.MAILCHIMP_KEY,
  server: 'us4',
});

export async function addMailchimp(email: string, merge_fields: MergeFields) {
  console.log(email, merge_fields);

  const run = async () => {
    const response = await client.lists.setListMember('948112d831', email, {
      email_address: email,
      merge_fields: merge_fields,
      status: 'subscribed',
    });
    console.log(response);
  };

  run();
}

export async function getMailchimp() {
  const response = await client.campaigns.list({
    list_id: '948112d831',
    status: 'sent',
    sort_field: 'send_time',
    sort_dir: 'DESC',
  });

  const campaign = response['campaigns'][0];

  const campaign_url = campaign['long_archive_url'];
  const campaign_subject = campaign['settings']['subject_line'];
  const campaign_time = campaign['send_time'];
  return [
    {
      url: campaign_url,
      subject: campaign_subject,
      date: campaign_time,
    },
  ];
}
