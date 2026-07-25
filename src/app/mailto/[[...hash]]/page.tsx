import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;

  // Handle old URL format
  // /mailto/{hash} -> /mailto/edit/{hash}
  if (hash) {
    redirect(`/mailto/edit/${hash}`, 'replace');
  } else {
    redirect('/mailto/edit', 'replace');
  }
}
