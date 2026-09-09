'use server';

import { Prisma } from 'generated/prisma/client';
import prisma from '../../lib/prisma';

/**
 * Get single matching mailto from database
 * @param slug - URL slug including #
 * @returns Saved mailto email template
 */
async function getCta(slug: string) {
  try {
    console.log(`Fetching CTA ${slug}`);

    const cta = await prisma.cTA.findUnique({
      where: { slug },
    });

    return cta;
  } catch (error) {
    console.error(error);

    return;
  }
}

/**
 * Get all mailtos from database
 * @returns Saved mailto email templates
 */
async function getAllCtas() {
  try {
    console.log('Fetching all CTAs');

    const ctas = await prisma.cTA.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return ctas;
  } catch (error) {
    console.error(error);

    return;
  }
}

/**
 * Save mailto to database
 * @param data - JSON object
 */
async function setCta(data: Prisma.CTACreateInput) {
  try {
    console.log('Updating CTA');
    console.debug(data);

    // Update or create
    const cta = await prisma.cTA.upsert({
      where: {
        slug: data.slug,
      },
      update: data,
      create: data,
    });

    return cta;
  } catch (error) {
    console.error(error);

    return 'Saving failed';
  }
}

export { getCta, getAllCtas, setCta };
