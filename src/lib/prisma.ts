import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

const prismaClientSingleton = () => {
  const datasourceUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';
  return new PrismaClient({
    log: ['error', 'warn'],
    datasourceUrl,
  });
};

if (process.env.NODE_ENV === 'production') {
  prisma = prismaClientSingleton();
} else {
  if (!global.prisma) {
    global.prisma = prismaClientSingleton();
  }
  prisma = global.prisma;
}

export default prisma;
