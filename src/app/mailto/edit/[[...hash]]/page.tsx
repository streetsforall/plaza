import { notFound } from 'next/navigation';
import { getEmailTemplate } from '../../helpers/db';
import Editor from '../../components/Editor';

export default async function Page({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  // Get hash from URL path
  const { hash } = await params;

  if (hash) {
    // If hash, load saved email template
    // Add # symbol back to match DB
    const saved = await getEmailTemplate(`#${hash}`);

    if (saved) {
      return (
        <div className="container m-auto min-h-screen">
          <Editor
            initHash={hash}
            initReceiverList={saved.to}
            initCc={saved.cc}
            initBcc={saved.bcc}
            initSubject={decodeURIComponent(saved.subject)}
            initBody={decodeURIComponent(saved.body)}
            initDistrictVar={saved.district_var}
            initIsPhone={saved.phone}
            initActionable={saved.actionable}
          />
        </div>
      );
    } else {
      notFound();
    }
  } else {
    // If no hash, blank editor
    return (
      <div className="container m-auto min-h-screen">
        <Editor />
      </div>
    );
  }
}
