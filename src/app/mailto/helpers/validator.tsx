'use server';

import { getEmailTemplate } from './db';

/**
 * Validate password and load saved email template
 * @param pwd - Supplied password to validate
 * @param hash - URL hash (including #) of the email template to load
 * @returns Email template and password validation status
 */
async function validateString(pwd, hash) {
  if (pwd !== process.env.LOGIN) {
    return { emails: {}, valid: false };
  }

  const emails = (await getEmailTemplate(hash)) || {};

  return { emails: emails, valid: true };
}

export { validateString };
