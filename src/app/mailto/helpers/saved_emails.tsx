'use server'

import { Octokit, App } from "octokit";


const octokit = new Octokit({ auth: process.env.GIT_KEY });




// read from our mailto database hosted on GitHub
export async function getAllSaved() {
  console.log('fetching emails')

  const { data }: any = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: "streetsforall",
    repo: "library",
    path: "email_generator.json",
  })
  const json = JSON.parse(atob(data.content))
  // console.log('json', json)
  return ([json, data.sha]);
};

// get single matching mailto from database hosted on GitHub
export async function getSaved(hash) {

  console.log('fetching emails')

  const { data }: any = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: "streetsforall",
    repo: "library",
    path: "email_generator.json",
  })

  // console.log(data)

  const json = JSON.parse(atob(data.content))

  // console.log(json)

  const match = json.data.find(val => val.url == hash)
  if (match) {
    return (match)
  }
};


// post to our mailto database hosted on GitHub
export async function newSaved(data) {

  console.log('updating emails')
  console.log(data)
  if (data.url) {

    // get data we will be updating
    const loadEmails = async () => {
      const response = getAllSaved();
      return (response)
    }

    // update once loaded
    loadEmails().then(async emails => {

      const json = emails[0]
      const SHA = emails[1]

      // console.log(json)
      console.log('SHA', SHA)
      // console.log(data)

      // iterate through all saved drafts, see if URL matches same page
      const match = json.data.findIndex(val => val.url == data.url)

      console.log(match)

      // if match
      if (match != -1) {
        json.data[match] = data
      } else {
        data ? json.data.push(data) : ''
      }

      console.log('json being save', json)

      try {
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner: 'streetsforall',
          repo: 'library',
          sha: SHA,
          path: 'email_generator.json',
          message: 'updating DB',
          content: btoa(JSON.stringify(json)),
        })
        return (btoa(JSON.stringify(json)));
      } catch (err) {
        console.error('error', err);
        return ('saving failed');
      }


    

    })
  }
  console.log('no hash to save to')
};
