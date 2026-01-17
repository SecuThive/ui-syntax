import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Set DATABASE_URL in environment.' },
        { status: 503 }
      );
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { title, description } = body || {};

    try {
      if (!prisma) {
        throw new Error('Prisma client not initialized');
      }

      // Find design
      const design = await prisma.design.findUnique({ where: { id } });
      if (!design) {
        await prisma.$disconnect();
        return NextResponse.json({ error: 'Design not found' }, { status: 404 });
      }

      // Publish design
      const published = await prisma.design.update({
        where: { id },
        data: { status: 'published' },
      });

      // Reflect into component code
      await prisma.component.update({
        where: { id: design.componentId },
        data: {
          code: published.code,
          title: title ?? undefined,
          description: description ?? undefined,
          updatedAt: new Date(),
        },
      });

      await prisma.$disconnect();
      return NextResponse.json({ success: true, design: published });
    } catch (prismaError: any) {
      return NextResponse.json(
        { error: 'Database connection failed', details: prismaError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to publish design', details: error.message },
      { status: 500 }
    );
  }
}
