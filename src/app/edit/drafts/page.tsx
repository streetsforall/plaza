import Link from 'next/link';
import { getAllEmailTemplates } from '../../helpers/db';

export default async function Page() {
  const emailTemplates = await getAllEmailTemplates();

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
                Hash
              </th>
              <th className="border-b-2 border-black px-4 py-2 text-left">
                Modified
              </th>
            </tr>
          </thead>
          <tbody>
            {emailTemplates &&
              emailTemplates.map((template) => {
                // Remove # symbol
                const hash = template.url.substring(1);

                return (
                  <tr
                    key={template.id}
                    className="group cursor-pointer hover:bg-black hover:text-white"
                    aria-label="Load"
                  >
                    <td className="relative w-1/2 max-w-0 overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap group-not-last:border-b-2">
                      <Link href={hash} className="absolute inset-0" />
                      {decodeURIComponent(template.subject || '-')}
                    </td>
                    <td className="relative w-1/2 max-w-0 overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap group-not-last:border-b-2">
                      <Link href={hash} className="absolute inset-0" />
                      {decodeURIComponent(template.actionable?.header || '-')}
                    </td>
                    <td className="relative px-4 py-2 font-mono text-sm group-not-last:border-b-2">
                      <Link href={hash} className="absolute inset-0" />
                      {hash}
                    </td>
                    <td className="relative px-4 py-2 group-not-last:border-b-2">
                      <Link href={hash} className="absolute inset-0" />
                      {template.time
                        ? new Date(template.time).toISOString().slice(0, 10)
                        : ''}{' '}
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
