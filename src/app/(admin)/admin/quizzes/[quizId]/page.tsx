import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import QuizBuilder from "@/components/admin/QuizBuilder";

export default async function AdminQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      part: {
        select: {
          id: true,
          title: true,
          section: { select: { id: true, title: true, order: true } },
        },
      },
      questions: {
        orderBy: { order: "asc" },
        include: { choices: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!quiz) notFound();

  return (
    <div className="p-5 md:p-8">
      <div className="mb-6">
        <Link
          href={`/admin/sections/${quiz.part.section.id}`}
          className="text-sm text-brand-muted hover:text-brand-primary"
        >
          ← Section {quiz.part.section.order}: {quiz.part.section.title}
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-xs text-brand-sage tracking-[0.3em] uppercase mb-2">
          Quiz
        </p>
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          {quiz.part.title}
        </h1>
      </div>

      <QuizBuilder
        quizId={quiz.id}
        initialPassingScore={quiz.passingScore}
        initialMaxAttempts={quiz.maxAttempts}
        initialQuestions={quiz.questions.map((q) => ({
          id: q.id,
          order: q.order,
          prompt: q.prompt,
          choices: q.choices.map((c) => ({
            id: c.id,
            text: c.text,
            isCorrect: c.isCorrect,
          })),
        }))}
      />
    </div>
  );
}
