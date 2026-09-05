import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Swap a section with its up/down neighbour. Swaps ONLY `order`.
 *
 * It used to swap `unlockDate` too, on the theory that "move earlier"
 * implies "unlock earlier". In practice that scrambled dates: the
 * per-pathway `unlockDates` JSON was NOT swapped, so after a reorder a
 * unit could carry its own Mat/Reformer dates but its neighbour's
 * fallback date. Dates now stay with the unit they were set on.
 *
 * Uses a 3-step transaction (via temporary order = -1) because
 * (order @unique) prevents a direct set.
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

  const section = await prisma.section.findUnique({
    where: { id },
    select: { id: true, order: true },
  });
  if (!section) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const neighbourOrder =
    direction === "up" ? section.order - 1 : section.order + 1;
  const neighbour = await prisma.section.findUnique({
    where: { order: neighbourOrder },
    select: { id: true, order: true },
  });
  if (!neighbour) {
    return NextResponse.json({ error: "Already at end" }, { status: 400 });
  }

  await prisma.$transaction([
    // Park this one out of the way
    prisma.section.update({
      where: { id: section.id },
      data: { order: -1 },
    }),
    // Move the neighbour into this one's old slot
    prisma.section.update({
      where: { id: neighbour.id },
      data: { order: section.order },
    }),
    // Place this one in the neighbour's old slot
    prisma.section.update({
      where: { id: section.id },
      data: { order: neighbour.order },
    }),
  ]);

  return NextResponse.json({ success: true });
}
