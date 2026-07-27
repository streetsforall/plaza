import Head from 'next/head';
import { notFound } from 'next/navigation';
import { getEmailTemplate } from '../../helpers/db';
import Output from '../components/Output';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ hash: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // Get hash and email from URL path
  const { hash } = await params;
  const actorEmail = (await searchParams).email;

  // Load saved email template
  // Add # symbol back to match DB
  const cta = await getEmailTemplate(`#${hash}`);

  if (cta) {
    return (
      <div className="flex flex-col">
        <Head>
          <title>{cta?.actionable?.header}</title>
          <meta
            property="og:title"
            content={cta?.actionable?.header}
            key="title"
          />
          <link rel="icon" href="/images/SFA_logo.png" />
        </Head>

        <h2 className="font-title text-4xl font-bold mb-8">{cta?.actionable?.header}</h2>

        <Output
          actorEmail={actorEmail}
          districtLookup={cta?.district_var}
          body={cta?.actionable?.body}
          isPhone={cta?.phone}
          initTo={cta?.to}
          cc={cta?.cc}
          bcc={cta?.bcc}
          subject={cta?.subject}
          emailBody={cta?.body}
        />
      </div>
    );
  } else {
    notFound();
  }
}
