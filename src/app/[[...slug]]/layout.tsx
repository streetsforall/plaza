import { redirect } from 'next/navigation';

export default async function EditorLayout({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug?.length && slug[0] === 'mailto') {
    // Handle old URL format
    if (slug[1] === 'out') {
      // /mailto/out/{hash} -> /act/{hash}
      redirect(`/act/${slug[2]}`, 'replace');
    } else {
      // /mailto/{hash} -> /edit/{hash}
      redirect(`/edit/${slug[1]}`, 'replace');
    }
  } else {
    // / -> /edit
    redirect('/edit', 'replace');
  }
}
