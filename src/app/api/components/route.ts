import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // DATABASE_URL이 없으면 데이터베이스 미설정
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Set DATABASE_URL environment variable in Vercel.' },
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

    // Prisma Client 동적 로드
    try {
      // @ts-ignore - Prisma 7 export type issue
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      // 컴포넌트 생성 또는 업데이트
      const component = await prisma.component.upsert({
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

      await prisma.$disconnect();

      return NextResponse.json({
        success: true,
        component,
        message: 'Component added/updated successfully',
      });
    } catch (prismaError: any) {
      console.error('Prisma initialization error:', prismaError.message);
      return NextResponse.json(
        { error: 'Database connection failed', details: prismaError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error adding component:', error.message);
    return NextResponse.json(
      { error: 'Failed to add component', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // DATABASE_URL이 없으면 데이터베이스 미설정
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    try {
      // @ts-ignore - Prisma 7 export type issue
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const searchParams = request.nextUrl.searchParams;
      const category = searchParams.get('category');

      let components;
      if (category) {
        components = await prisma.component.findMany({
          where: { category, status: 'active' },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        components = await prisma.component.findMany({
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
        });
      }

      await prisma.$disconnect();

      return NextResponse.json({ components });
    } catch (prismaError: any) {
      console.error('Prisma initialization error:', prismaError.message);
      return NextResponse.json(
        { error: 'Database connection failed', details: prismaError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error fetching components:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch components', details: error.message },
      { status: 500 }
    );
  }
}
