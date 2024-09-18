
import {getMailchimp} from "../../app/mailto/helpers/mailchimp"
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method === "GET") {
        try {
            const mailchimpData = await getMailchimp()
            console.log(mailchimpData)

            res.status(200).send(mailchimpData)

        } catch (error: any) {
            
            if (error instanceof Error) {
                console.error(`An error occurred retrieving emails: ${error.message}`);
            }

            res.status(500).send("An error occurred retrieving emails");
        }
    }
}