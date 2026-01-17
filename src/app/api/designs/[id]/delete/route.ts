import { NextResponse } from "next/server";
const { prisma } = require("@/lib/prisma");

interface RouteParams {
  params: Promise<{ id: string }>;
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
    console.error("Failed to delete design:", error);
    return NextResponse.json(
      { error: "Failed to delete design" },
      { status: 500 }
    );
  }
}
