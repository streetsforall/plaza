import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;

  // Handle old URL format
  if (hash) {
    if (hash[0] === 'out') {
      // /mailto/out/{hash} -> /mailto/act/{hash}
      redirect(`/mailto/act/${hash[1]}`, 'replace');
    } else {
      // /mailto/{hash} -> /mailto/edit/{hash}
      redirect(`/mailto/edit/${hash}`, 'replace');
    }
  } else {
    redirect('/mailto/edit', 'replace');
  }
}
