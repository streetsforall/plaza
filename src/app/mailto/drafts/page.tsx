'use client';

import React, { useState, useEffect } from 'react';
import { Prisma } from 'generated/prisma/client';
import { getAllEmailTemplates } from '../helpers/db';
import '../mailto.css';

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
    <div id="feeder">
      {drafts &&
        drafts.map((draft) => {
          return (
            <p key={draft.id}>
              <a href={'/mailto' + draft.url}>
                {draft.time
                  ? new Date(draft.time).toISOString().slice(0, 10)
                  : ''}{' '}
                • {decodeURIComponent(draft.subject)}
              </a>
            </p>
          );
        })}
    </div>
  );
}

export default Drafts;
