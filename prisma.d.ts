// Custom types for Prisma schema
declare global {
  namespace PrismaJson {
    type LandingPageType = {
      isActive?: boolean;
      geotargetDistrictTypes?: string[];
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
