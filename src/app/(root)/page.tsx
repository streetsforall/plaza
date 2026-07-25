import Link from 'next/link';

export default function Page() {
  return (
    <div className="bg-sfa-tan min-h-screen p-4 font-mono text-xs">
      <p className="mb-4">
        Welcome to the{' '}
        <a href="https://www.streetsforall.org/">Streets for All</a> Plaza
      </p>

      <div>
        <Link href="/mailto/edit">Call to Action Builder</Link>
      </div>

      <pre></pre>
    </div>
  );
}
