import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Moves a Part one slot up or down within its section.
 * Body: { direction: "up" | "down" }
 *
 * Swaps order with the neighbour. Uses a temporary order value because
 * (sectionId, order) is a unique pair.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { direction } = (await req.json().catch(() => ({}))) as {
    direction?: string;
  };
  if (direction !== "up" && direction !== "down") {
    return NextResponse.json({ error: "Invalid direction" }, { status: 400 });
  }

  const part = await prisma.part.findUnique({
    where: { id },
    select: { id: true, sectionId: true, order: true },
  });
  if (!part) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const neighbourOrder =
    direction === "up" ? part.order - 1 : part.order + 1;

  const neighbour = await prisma.part.findUnique({
    where: {
      sectionId_order: {
        sectionId: part.sectionId,
        order: neighbourOrder,
      },
    },
    select: { id: true, order: true },
  });
  if (!neighbour) {
    return NextResponse.json(
      { error: "Already at end of list" },
      { status: 400 },
    );
  }

  // Three-step swap to avoid the unique-constraint conflict
  await prisma.$transaction([
    prisma.part.update({ where: { id: part.id }, data: { order: -1 } }),
    prisma.part.update({
      where: { id: neighbour.id },
      data: { order: part.order },
    }),
    prisma.part.update({
      where: { id: part.id },
      data: { order: neighbour.order },
    }),
  ]);

  return NextResponse.json({ success: true });
}
