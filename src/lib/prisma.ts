import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

const prismaClientSingleton = () => {
  console.log(`[Prisma] Initializing client, NODE_ENV: ${process.env.NODE_ENV}`);
  
  // DATABASE_URL 확인
  const databaseUrl = process.env.DATABASE_URL;
  console.log(`[Prisma] DATABASE_URL set: ${!!databaseUrl}`);
  
  // 개발 환경에서 DB 파일 존재 여부 확인
  if (process.env.NODE_ENV !== 'production') {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const dbExists = fs.existsSync(dbPath);
    console.log(`[Prisma] Dev DB path: ${dbPath}, exists: ${dbExists}`);
  }
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
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
