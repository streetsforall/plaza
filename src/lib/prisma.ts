import { PrismaClient } from '../../generated/prisma/client';

// Create global Prisma client so only one instance is created
// Helps resolve issues with hot reloading that can occur with Next.js in development mode
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
