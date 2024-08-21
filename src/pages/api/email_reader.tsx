import { NextApiRequest, NextApiResponse } from "next";

// read from our mailto database hosted on GitHub
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: "streetsforall",
      repo: "library",
      path: "email_generator.json",
    })
    const json = JSON.parse(atob(data.content))
    console.log(json)
    res.json(json);

};
