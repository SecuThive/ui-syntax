import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string; name: string }> }
) {
  try {
    const { category, name } = await params;

    console.log(`[API] Fetching component: ${category}/${name}`);

    if (!category || !name) {
      console.warn('[API] Missing parameters');
      return NextResponse.json(
        { error: 'Missing category or name parameter' },
        { status: 400 }
      );
    }

    const component = await prisma.component.findFirst({
      where: {
        category: String(category).toLowerCase(),
        name: String(name).toLowerCase(),
      },
    });

    if (!component) {
      console.log(`[API] Component not found: ${category}/${name}`);
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    console.log(`[API] Component found: ${component.id}`);
    return NextResponse.json(component);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[API ERROR] Failed to fetch component:`, errorMessage);
    console.error('[API ERROR] Stack:', error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
