'use server';

import { Prisma } from 'generated/prisma/client';
import prisma from '../../../lib/prisma';

/**
 * Get single matching mailto from database
 * @param hash - URL hash including #
 * @returns Saved mailto email template
 */
async function getEmailTemplate(hash: string) {
  try {
    console.log('Fetching email templates');

    const emailTemplate = await prisma.emailTemplate.findUnique({
      where: { url: hash },
    });

    return emailTemplate;
  } catch (error) {
    console.error(error);

    return;
  }
}

/**
 * Get all mailtos from database
 * @returns Saved mailto email templates
 */
async function getAllEmailTemplates() {
  try {
    console.log('Fetching email templates')

    const emailTemplates = await prisma.emailTemplate.findMany();

    return emailTemplates;
  } catch (error) {
    console.error(error);

    return;
  }
}

/**
 * Save mailto to database
 * @param data - JSON object
 * @returns 
 */
async function setEmailTemplate(data: Prisma.EmailTemplateCreateInput) {
  try {
    console.log('Updating email template');
    console.debug(data);

    // Update or create
    const emailTemplate = await prisma.emailTemplate.upsert({
      where: {
        url: data.url,
      },
      update: data,
      create: data,
    });

    return emailTemplate;
  } catch (error) {
    console.error(error);

    return 'Saving failed';
  }
}

export { getEmailTemplate, getAllEmailTemplates, setEmailTemplate };
