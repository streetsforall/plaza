import Head from 'next/head';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getEmailTemplate } from '../../helpers/db';
import Footer from '../../components/footer';
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
      <div className="flex min-h-screen flex-col justify-between">
        <Head>
          <title>{cta?.actionable?.header}</title>
          <meta
            property="og:title"
            content={cta?.actionable?.header}
            key="title"
          />
          <link rel="icon" href="/images/SFA_logo.png" />
        </Head>

        <div className="mx-auto my-4 flex w-max flex-col text-center">
          <a href="https://www.streetsforall.org/">
            <Image
              src="/images/SFA_logo_wide.png"
              alt="Streets For All logo"
              height={0}
              width={320}
              className="h-auto max-w-full"
            />
          </a>
          <label>Mailto ID: {hash}</label>
        </div>

        <div className="m-auto mt-12 w-[calc(100%-2rem)] max-w-xl rounded-2xl bg-white p-4 text-xl">
          <h2 className="mt-4 mb-8 text-3xl font-bold">
            {cta?.actionable?.header}
          </h2>

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

        <Footer />
      </div>
    );
  } else {
    notFound();
  }
}
