

import { NextResponse } from 'next/server'
import {getMailchimp} from "../../mailto/helpers/mailchimp"

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const mailchimpData = await getMailchimp()
  // if (!mailchimpData) {
  //   return NextResponse.json({
  //     notFound: true,
  //   })
  // }
  return NextResponse.json(mailchimpData)


  // const data = await mailchimpData.json()

  return NextResponse.json(mailchimpData)
}