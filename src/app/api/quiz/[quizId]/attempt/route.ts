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

  // Enforce maxAttempts (null = unlimited). Don't burn a "remaining
  // attempt" once the student has passed — passing is final.
  if (quiz.maxAttempts !== null) {
    const attemptsSoFar = await prisma.quizAttempt.findMany({
      where: { userId: session.user.id, quizId: quiz.id },
      select: { passed: true },
    });
    const alreadyPassed = attemptsSoFar.some((a) => a.passed);
    if (!alreadyPassed && attemptsSoFar.length >= quiz.maxAttempts) {
      return NextResponse.json(
        {
          error: `No attempts remaining (limit ${quiz.maxAttempts}). Contact your instructor.`,
        },
        { status: 403 },
      );
    }
  }

  let correct = 0;
  const review = quiz.questions
    .sort((a, b) => a.order - b.order)
    .map((q) => {
      const chosenId = answers[q.id] ?? null;
      const chosen = chosenId
        ? q.choices.find((c) => c.id === chosenId) ?? null
        : null;
      const correctChoice = q.choices.find((c) => c.isCorrect);
      const wasCorrect = !!chosen?.isCorrect;
      if (wasCorrect) correct++;
      return {
        questionId: q.id,
        prompt: q.prompt,
        chosenChoiceId: chosen?.id ?? null,
        chosenText: chosen?.text ?? null,
        correctChoiceId: correctChoice?.id ?? null,
        correctText: correctChoice?.text ?? null,
        wasCorrect,
      };
    });

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

  return NextResponse.json({ score, passed, review });
}
