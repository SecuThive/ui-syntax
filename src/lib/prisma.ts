// Prisma 7 compatibility: use pg adapter for database connection
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PrismaPkg = require('@prisma/client');
const PrismaClientConstructor = PrismaPkg.PrismaClient || (PrismaPkg.default ? PrismaPkg.default.PrismaClient : null);

const globalForPrisma = global as unknown as { prisma: any };

let prismaInstance: any = null;

function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (prismaInstance) {
    return prismaInstance;
  }

  try {
    // @ts-ignore
    const { Pool } = require('pg');
    // @ts-ignore
    const { PrismaPg } = require('@prisma/adapter-pg');
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClientConstructor({ adapter });
  } catch {
    // Fallback if pg adapter not available
    prismaInstance = new PrismaClientConstructor();
  }

  return prismaInstance;
}

export const prisma: any = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
