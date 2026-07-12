'use client';

import { useState, useEffect } from 'react';
import { Prisma } from 'generated/prisma/client';
import { getAllEmailTemplates } from '../helpers/db';

function Drafts() {
  const [drafts, setDrafts] = useState<Prisma.EmailTemplateModel[]>();

  useEffect(() => {
    async function loadEmailTemplates() {
      const emailTemplates = await getAllEmailTemplates();

      setDrafts(emailTemplates);
    }

    loadEmailTemplates();
  }, []);

  return (
    <div className="container m-auto min-h-screen">
      <header className="flex justify-between py-8">
        <span className="block self-center bg-black px-3 text-2xl font-bold text-white uppercase">
          SFA Mailto Tool
        </span>
      </header>

      <div className="mx-auto border-2 border-black bg-white">
        <table className="border-separate border-spacing-0">
          <thead className="sticky top-0 bg-white">
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
            {drafts &&
              drafts.map((draft) => {
                // Remove # symbol
                const hash = draft.url.substring(1);

                return (
                  <tr
                    key={draft.id}
                    className="group cursor-pointer hover:bg-black hover:text-white"
                    onClick={() => (location.href = `/mailto/${hash}`)}
                    aria-label="Load"
                  >
                    <td className="w-1/2 max-w-0 overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap group-not-last:border-b-2">
                      {decodeURIComponent(draft.subject || '-')}
                    </td>
                    <td className="w-1/2 max-w-0 overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap group-not-last:border-b-2">
                      {decodeURIComponent(draft.actionable?.header || '-')}
                    </td>
                    <td className="px-4 py-2 font-mono text-sm group-not-last:border-b-2">
                      {hash}
                    </td>
                    <td className="px-4 py-2 group-not-last:border-b-2">
                      {draft.time
                        ? new Date(draft.time).toISOString().slice(0, 10)
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

export default Drafts;
