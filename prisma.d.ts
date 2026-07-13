// Custom types for Prisma schema
declare global {
  namespace PrismaJson {
    type ActionableType = {
      body: string;
      header: string;
    };
  }
}

// This file must be a module.
export {};
