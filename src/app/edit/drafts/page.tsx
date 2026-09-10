import Link from 'next/link';
import { getAllCtas } from '../../helpers/db';

// Prevent stale cache
export const dynamic = 'auto';

export default async function Page() {
  const ctas = await getAllCtas();

  return (
    <div className="container m-auto min-h-screen">
      <header className="flex justify-between py-8">
        <span className="block self-center bg-black px-3 text-2xl font-bold text-white uppercase">
          SFA CTA Editor
        </span>
      </header>

      <div className="mx-auto border-2 border-black bg-white">
        <table className="border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-white">
            <tr>
              <th className="border-b-2 border-black px-4 py-2 text-left">
                Email subject
              </th>
              <th className="border-b-2 border-black px-4 py-2 text-left">
                Landing page header
              </th>
              <th className="border-b-2 border-black px-4 py-2 text-left">
                Slug
              </th>
              <th className="border-b-2 border-black px-4 py-2 text-right">
                Modified
              </th>
              <th className="border-b-2 border-black px-4 py-2 text-right">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {ctas &&
              ctas.map((cta) => {
                return (
                  <tr
                    key={cta.id}
                    className="group cursor-pointer hover:bg-black hover:text-white"
                    aria-label="Load"
                  >
                    <td className="relative w-1/2 max-w-0 overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap group-not-last:border-b-2">
                      <Link href={cta.slug} className="absolute inset-0" />
                      {decodeURIComponent(cta.mailto.subject || '-')}
                    </td>
                    <td className="relative w-1/2 max-w-0 overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap group-not-last:border-b-2">
                      <Link href={cta.slug} className="absolute inset-0" />
                      {decodeURIComponent(cta.landingPage?.heading || '-')}
                    </td>
                    <td className="relative px-4 py-2 font-mono text-sm group-not-last:border-b-2">
                      <Link href={cta.slug} className="absolute inset-0" />
                      {cta.slug}
                    </td>
                    <td className="relative px-4 py-2 text-right group-not-last:border-b-2">
                      <Link href={cta.slug} className="absolute inset-0" />
                      {cta.updatedAt &&
                        new Date(cta.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="relative px-4 py-2 text-right group-not-last:border-b-2">
                      <Link href={cta.slug} className="absolute inset-0" />
                      {cta.createdAt &&
                        new Date(cta.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
