import { NextRequest, NextResponse } from 'next/server';

// Prisma는 DATABASE_URL이 설정된 경우에만 초기화
let prisma: any = null;

async function getPrisma() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!prisma) {
    const { PrismaClient: PC } = await import('@prisma/client');
    prisma = new PC();
  }

  return prisma;
}

export async function POST(request: NextRequest) {
  try {
    const prismaClient = await getPrisma();

    if (!prismaClient) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { title, description, category, variant, code } = body;

    // 유효성 검사
    if (!title || !description || !category || !variant || !code) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, variant, code' },
        { status: 400 }
      );
    }

    // 컴포넌트 생성 또는 업데이트
    const component = await prismaClient.component.upsert({
      where: {
        category_variant: {
          category,
          variant,
        },
      },
      update: {
        title,
        description,
        code,
        updatedAt: new Date(),
      },
      create: {
        title,
        description,
        category,
        variant,
        code,
      },
    });

    return NextResponse.json({
      success: true,
      component,
      message: 'Component added/updated successfully',
    });
  } catch (error: any) {
    console.error('Error adding component:', error);
    return NextResponse.json(
      { error: 'Failed to add component', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const prismaClient = await getPrisma();

    if (!prismaClient) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let components;
    if (category) {
      components = await prismaClient.component.findMany({
        where: { category, status: 'active' },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      components = await prismaClient.component.findMany({
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ components });
  } catch (error: any) {
    console.error('Error fetching components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch components', details: error.message },
      { status: 500 }
    );
  }
}
