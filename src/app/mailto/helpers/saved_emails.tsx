'use server'

import { Octokit, App } from "octokit";


const octokit = new Octokit({ auth: process.env.GIT_KEY });


// read from our mailto database hosted on GitHub
export async function getSaved() {

  console.log('fetching emails')

    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: "streetsforall",
      repo: "library",
      path: "email_generator.json",
    })

    // console.log('data', data)


    const json = JSON.parse(atob(data.content))


    // console.log('json', json)
    return([json, data.sha]);

};


// read from our mailto database hosted on GitHub
export async function newSaved(data) {

    // get data we will be updating
      const loadEmails = async () => {
        const response = getSaved();
        return(response)
    }

    // update once loaded
    loadEmails().then(async emails => {

      console.log(emails)

      const json = emails[0]
      const SHA = emails[1]

      // console.log(json)
      console.log('SHA', SHA)
      console.log(data)

      // iterate through all saved drafts, see if URL matches same page
      const match = json.data.findIndex(val => val.url == data.url)

      console.log(match)

      // if match
      if (match != -1) {
        json.data[match] = data
      } else {
        data ? json.data.push(data) : ''
      }
  

      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: 'streetsforall',
        repo: 'library',
        sha: SHA,
        path: 'email_generator.json',
        message: 'updating DB',
        content:  btoa(JSON.stringify(json)),
      })

      return(btoa(JSON.stringify(json)));

    })
};
