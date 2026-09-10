import { GeotargetOptions } from './geo';

declare global {
  // Custom types for Prisma schema
  namespace PrismaJson {
    type LandingPageType = {
      isActive?: boolean;
      geotargetDistrictTypes?: GeotargetOptions[];
      isPhone?: boolean;
      heading: string;
      body?: string;
    };

    type MailtoType = {
      to: string[];
      cc: string[];
      bcc: string[];
      subject: string;
      body: string;
    };
  }
}

// This file must be a module.
export {};
