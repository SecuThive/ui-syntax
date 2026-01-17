import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string; name: string }> }
) {
  try {
    const { category, name } = await params;

    const component = await prisma.component.findFirst({
      where: {
        category,
        name,
      },
    });

    if (!component) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(component);
  } catch (error) {
    console.error('Error fetching component:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
