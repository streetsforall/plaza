
import {getMailchimp} from "../../app/mailto/helpers/mailchimp"
import { NextRequest, NextResponse } from "next/server";


export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await getMailchimp();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching Mailchimp data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



// function requestHandler (_request: NextRequest): NextResponse {
//     const mailchimpData = getMailchimp()
//     console.log(mailchimpData)
    
//   return NextResponse.json({ 
//     message: mailchimpData
//  });
// }

// export { requestHandler as GET };


// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {

//     if (req.method === "GET") {
//         try {
//             const mailchimpData = await getMailchimp()
//             console.log(mailchimpData)

//             res.status(200).send(mailchimpData)

//         } catch (error: any) {
            
//             if (error instanceof Error) {
//                 console.error(`An error occurred retrieving emails: ${error.message}`);
//             }

//             res.status(500).send("An error occurred retrieving emails");
//         }
//     }
// }