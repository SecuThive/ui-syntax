// Prisma 7 compatibility: use CommonJS require to avoid ESM default export issues
// and initialize only when available in the environment.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PrismaPkg = require('@prisma/client');
const PrismaClient = PrismaPkg.PrismaClient || (PrismaPkg.default ? PrismaPkg.default.PrismaClient : null);

const globalForPrisma = global as unknown as { prisma: any };

export const prisma: any =
  globalForPrisma.prisma ||
  (PrismaClient
    ? new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query'] : [],
      })
    : null);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
