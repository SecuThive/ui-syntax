import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({ components });
  } catch (error: any) {
    console.error('Error fetching components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch components', details: error.message },
      { status: 500 }
    );
  }
}
