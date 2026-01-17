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

    // Add category and variant from component for easier client access
    const response = {
      ...design,
      category: design.component?.category,
      variant: design.component?.variant,
    };

    return NextResponse.json({ design: response });
  } catch (error) {
    console.error('Error fetching design:', error);
    return NextResponse.json(
      { error: 'Failed to fetch design' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    await prisma.design.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting design:', error);
    return NextResponse.json(
      { error: 'Failed to delete design' },
      { status: 500 }
    );
  }
}
