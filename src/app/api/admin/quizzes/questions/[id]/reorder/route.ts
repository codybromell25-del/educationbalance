import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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

  const question = await prisma.quizQuestion.findUnique({
    where: { id },
    select: { id: true, quizId: true, order: true },
  });
  if (!question) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const neighbourOrder =
    direction === "up" ? question.order - 1 : question.order + 1;
  const neighbour = await prisma.quizQuestion.findUnique({
    where: {
      quizId_order: { quizId: question.quizId, order: neighbourOrder },
    },
    select: { id: true, order: true },
  });
  if (!neighbour) {
    return NextResponse.json({ error: "Already at end" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.quizQuestion.update({
      where: { id: question.id },
      data: { order: -1 },
    }),
    prisma.quizQuestion.update({
      where: { id: neighbour.id },
      data: { order: question.order },
    }),
    prisma.quizQuestion.update({
      where: { id: question.id },
      data: { order: neighbour.order },
    }),
  ]);

  return NextResponse.json({ success: true });
}
