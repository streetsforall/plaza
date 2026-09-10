import { notFound } from 'next/navigation';
import { getCta } from '../../helpers/db';
import Editor from '../components/Editor';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Get slug from URL path
  const slugs = (await params).slug;
  const slug = slugs && slugs[0];

  if (slug) {
    // If slug, load saved email template
    const saved = await getCta(slug);

    if (saved) {
      return (
        <Editor
          initSlug={slug}
          initMailtoTo={saved.mailto.to}
          initMailtoCc={saved.mailto.cc}
          initMailtoBcc={saved.mailto.bcc}
          initMailtoSubject={decodeURIComponent(saved.mailto.subject)}
          initMailtoBody={decodeURIComponent(saved.mailto.body)}
          initLandingPageGeotargetDistrictTypes={
            saved.landingPage?.geotargetDistrictTypes
          }
          initLandingPageIsPhone={saved.landingPage?.isPhone}
          initLandingPageHeading={saved.landingPage?.heading}
          initLandingPageBody={saved.landingPage?.body}
        />
      );
    } else {
      notFound();
    }
  } else {
    // If no slug, blank editor
    return <Editor />;
  }
}
