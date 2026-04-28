import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { quizId } = await params;
  const { answers } = (await req.json()) as {
    answers: Record<string, string>;
  };

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: { include: { choices: true } },
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const total = quiz.questions.length;
  if (total === 0) {
    return NextResponse.json({ error: "Quiz has no questions" }, { status: 400 });
  }

  let correct = 0;
  for (const q of quiz.questions) {
    const chosenId = answers[q.id];
    if (!chosenId) continue;
    const chosen = q.choices.find((c) => c.id === chosenId);
    if (chosen?.isCorrect) correct++;
  }

  const score = Math.round((correct / total) * 100);
  const passed = score >= quiz.passingScore;

  await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      quizId: quiz.id,
      score,
      passed,
    },
  });

  return NextResponse.json({ score, passed });
}
