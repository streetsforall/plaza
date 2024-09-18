import { NextResponse } from 'next/server'
import {getMailchimp} from "../../mailto/helpers/mailchimp"



export async function GET(request: Request) {
  const mailchimpData = await getMailchimp()

  // const data = await mailchimpData.json()

  return NextResponse.json(mailchimpData)
}