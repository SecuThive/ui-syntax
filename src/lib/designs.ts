'use server';


// Lazy load Prisma via require to avoid ESM export issues
export async function getLatestPublishedDesignCode(category: string, variant: string): Promise<string | null> {
  try {
    if (!process.env.DATABASE_URL) {
      return null;
    }

    // @ts-ignore - Prisma 7 export type issue
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const component = await prisma.component.findUnique({
      where: { category_variant: { category, variant } },
      select: { id: true },
    });

    if (!component) {
      await prisma.$disconnect();
      return null;
    }

    const design = await prisma.design.findFirst({
      where: { componentId: component.id, status: 'published' },
      orderBy: { createdAt: 'desc' },
      select: { code: true },
    });

    await prisma.$disconnect();
    return design?.code ?? null;
  } catch {
    return null;
  }
}
