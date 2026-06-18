import { getMailchimp } from '../../mailto/helpers/mailchimp';
import { NextResponse } from 'next/server';

/**
 * Get latest Mailchimp campaign
 * @returns url, subject, date of campaign
 */
export async function GET() {
  try {
    const data = await getMailchimp();
    console.log(data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching Mailchimp data:', error);

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
