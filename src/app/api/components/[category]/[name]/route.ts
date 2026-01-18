import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching component:', errorMessage);
    console.error('Full error:', error);
    return NextResponse.json(
      { error: 'Internal error', details: errorMessage },
      { status: 500 }
    );
  }
}
