import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

type ChoiceInput = { text: string; isCorrect: boolean };

/**
 * Create a new question in a quiz, with all its choices in one call.
 * Body: { prompt: string, choices: [{text, isCorrect}, ...] }
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: quizId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { prompt, choices } = body as {
    prompt: string;
    choices: ChoiceInput[];
  };

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }
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

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { id: true },
  });
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const maxOrder = await prisma.quizQuestion.aggregate({
    where: { quizId },
    _max: { order: true },
  });
  const nextOrder = (maxOrder._max.order ?? 0) + 1;

  const question = await prisma.quizQuestion.create({
    data: {
      quizId,
      prompt: prompt.trim(),
      order: nextOrder,
      choices: {
        create: choices.map((c, i) => ({
          text: c.text.trim(),
          isCorrect: !!c.isCorrect,
          order: i + 1,
        })),
      },
    },
    include: { choices: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ question });
}
