import { cache } from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEmailTemplate } from '../../helpers/db';
import Output from '../components/Output';

// Utilize cache to avoid duplicate requests for both metadata and page
const getCachedEmailTemplate = cache(getEmailTemplate);

// Set head metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ hash: string }>;
}): Promise<Metadata> {
  // Get hash from URL path
  const { hash } = await params;

  // Load saved email template
  // Add # symbol back to match DB
  const cta = await getCachedEmailTemplate(`#${hash}`);

  return {
    title: cta?.actionable?.header,
    openGraph: {
      title: cta?.actionable?.header,
    },
  };
}

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
  const cta = await getCachedEmailTemplate(`#${hash}`);

  if (cta) {
    return (
      <div className="flex flex-col">
        <h2 className="font-title mb-4 text-3xl font-bold sm:mb-8 sm:text-4xl">
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
    );
  } else {
    notFound();
  }
}
