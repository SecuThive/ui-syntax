import { NextResponse } from 'next/server';

const { PrismaClient } = require('@prisma/client');
const { prisma } = require('@/lib/prisma');

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    const design = await prisma.design.findUnique({
      where: { id },
      include: {
        component: true,
      },
    });

    if (!design) {
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ design });
  } catch (error) {
    console.error('Error fetching design:', error);
    return NextResponse.json(
      { error: 'Failed to fetch design' },
      { status: 500 }
    );
  }
}
