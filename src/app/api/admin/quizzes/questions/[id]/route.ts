import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

type ChoiceInput = { text: string; isCorrect: boolean };

/**
 * Update a quiz question. Replaces all its choices with the provided
 * array (simpler than diffing). Body: { prompt?, choices?: [...] }
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { prompt, choices } = body as {
    prompt?: string;
    choices?: ChoiceInput[];
  };

  if (prompt !== undefined && !prompt.trim()) {
    return NextResponse.json({ error: "prompt cannot be empty" }, { status: 400 });
  }

  if (choices !== undefined) {
    if (!Array.isArray(choices) || choices.length < 2) {
      return NextResponse.json(
        { error: "At least 2 choices required" },
        { status: 400 },
      );
    }
    if (!choices.some((c) => c.isCorrect)) {
      return NextResponse.json(
        { error: "Mark at least one choice correct" },
        { status: 400 },
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    if (prompt !== undefined) {
      await tx.quizQuestion.update({
        where: { id },
        data: { prompt: prompt.trim() },
      });
    }
    if (choices !== undefined) {
      await tx.quizChoice.deleteMany({ where: { questionId: id } });
      await tx.quizChoice.createMany({
        data: choices.map((c, i) => ({
          questionId: id,
          text: c.text.trim(),
          isCorrect: !!c.isCorrect,
          order: i + 1,
        })),
      });
    }
  });

  const updated = await prisma.quizQuestion.findUnique({
    where: { id },
    include: { choices: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json({ question: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const question = await prisma.quizQuestion.findUnique({
    where: { id },
    select: { quizId: true },
  });
  if (!question) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.quizQuestion.delete({ where: { id } });

  // Compact remaining order values
  const remaining = await prisma.quizQuestion.findMany({
    where: { quizId: question.quizId },
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });
  await Promise.all(
    remaining.map((q, i) =>
      q.order === i + 1
        ? Promise.resolve()
        : prisma.quizQuestion.update({
            where: { id: q.id },
            data: { order: i + 1 },
          }),
    ),
  );

  return NextResponse.json({ success: true });
}
