import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Swap a section with its up/down neighbour. Swaps BOTH the order and
 * the unlockDate so the calendar stays consistent — if the admin says
 * 'this section should come earlier' they almost certainly mean its
 * unlock date should also come earlier.
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
    select: { id: true, order: true, unlockDate: true },
  });
  if (!section) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const neighbourOrder =
    direction === "up" ? section.order - 1 : section.order + 1;
  const neighbour = await prisma.section.findUnique({
    where: { order: neighbourOrder },
    select: { id: true, order: true, unlockDate: true },
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
    // Move the neighbour into this one's old slot, with this one's date
    prisma.section.update({
      where: { id: neighbour.id },
      data: { order: section.order, unlockDate: section.unlockDate },
    }),
    // Place this one in the neighbour's old slot, with the neighbour's date
    prisma.section.update({
      where: { id: section.id },
      data: { order: neighbour.order, unlockDate: neighbour.unlockDate },
    }),
  ]);

  return NextResponse.json({ success: true });
}
