
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