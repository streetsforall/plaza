import { cache } from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCta } from '../../helpers/db';
import Output from '../components/Output';

// Utilize cache to avoid duplicate requests for both metadata and page
const getCachedCta = cache(getCta);

// Set head metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Get slug from URL path
  const slugs = (await params).slug;
  const slug = slugs && slugs[0];

  // Load saved email template
  const cta = await getCachedCta(slug);

  return {
    title: cta?.landingPage?.heading,
    openGraph: {
      title: cta?.landingPage?.heading,
    },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // Get slug and email from URL path
  const slugs = (await params).slug;
  const slug = slugs && slugs[0];
  const actorEmail = (await searchParams).email;

  // Load saved email template
  const cta = await getCachedCta(slug);

  if (cta) {
    return (
      <div className="flex flex-col">
        <h2 className="font-title mb-4 text-3xl font-bold sm:mb-8 sm:text-4xl">
          {cta?.landingPage?.heading}
        </h2>

        <Output
          actorEmail={actorEmail}
          geotargetDistrictTypes={cta.landingPage?.geotargetDistrictTypes}
          isPhone={cta.landingPage?.isPhone}
          body={cta.landingPage?.body}
          initMailtoTo={cta.mailto.to}
          mailtoCc={cta.mailto.cc}
          mailtoBcc={cta.mailto.bcc}
          mailtoSubject={cta.mailto.subject}
          mailtoBody={cta.mailto.body}
        />
      </div>
    );
  } else {
    notFound();
  }
}
