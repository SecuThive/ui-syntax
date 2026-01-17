import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Set DATABASE_URL in environment.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { title, description, category, variant, code, status = 'draft', metadata, source = 'gemini' } = body;

    if (!title || !category || !variant || !code) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, variant, code' },
        { status: 400 }
      );
    }

    try {
      if (!prisma) {
        throw new Error('Prisma client not initialized');
      }

      // Ensure component exists
      const component = await prisma.component.upsert({
        where: { category_variant: { category, variant } },
        update: { title, description: description ?? '', updatedAt: new Date() },
        create: { title, description: description ?? '', category, variant, code },
      });

      // Create design entry
      const design = await prisma.design.create({
        data: {
          componentId: component.id,
          title,
          description,
          code,
          source,
          status,
          metadata,
        },
      });

      // If published/active, reflect latest into component
      if (status === 'published' || status === 'active') {
        await prisma.component.update({
          where: { id: component.id },
          data: { title, description: description ?? component.description, code },
        });
      }

      await prisma.$disconnect();

      return NextResponse.json({ success: true, design });
    } catch (prismaError: any) {
      return NextResponse.json(
        { error: 'Database connection failed', details: prismaError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to add design', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    try {
      if (!prisma) {
        throw new Error('Prisma client not initialized');
      }

      const searchParams = request.nextUrl.searchParams;
      const category = searchParams.get('category');
      const variant = searchParams.get('variant');
      const status = searchParams.get('status') || 'published';
      const limitParam = searchParams.get('limit');
      const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 10, 1), 50) : 10;

      let designs;
      if (category && variant) {
        const component = await prisma.component.findUnique({
          where: { category_variant: { category, variant } },
        });

        if (!component) {
          await prisma.$disconnect();
          return NextResponse.json({ designs: [] });
        }

        designs = await prisma.design.findMany({
          where: { componentId: component.id, status },
          orderBy: { createdAt: 'desc' },
          take: limit,
        });
      } else if (category) {
        const components = await prisma.component.findMany({
          where: { category },
          select: { id: true },
        });
        const componentIds = components.map((c: { id: string }) => c.id);
        designs = await prisma.design.findMany({
          where: { componentId: { in: componentIds }, status },
          orderBy: { createdAt: 'desc' },
          take: limit,
        });
      } else {
        designs = await prisma.design.findMany({
          where: { status },
          orderBy: { createdAt: 'desc' },
          take: limit,
        });
      }

      await prisma.$disconnect();
      return NextResponse.json({ designs });
    } catch (prismaError: any) {
      return NextResponse.json(
        { error: 'Database connection failed', details: prismaError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch designs', details: error.message },
      { status: 500 }
    );
  }
}
