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

  // Aggregate attempts per student: count, best score, last attempt
  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId },
    orderBy: { completedAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  const perStudent = new Map<
    string,
    {
      name: string;
      email: string;
      attempts: number;
      bestScore: number;
      passed: boolean;
      lastAttemptAt: Date;
    }
  >();
  for (const a of attempts) {
    const existing = perStudent.get(a.user.id);
    if (!existing) {
      perStudent.set(a.user.id, {
        name: a.user.name,
        email: a.user.email,
        attempts: 1,
        bestScore: a.score,
        passed: a.passed,
        lastAttemptAt: a.completedAt,
      });
    } else {
      existing.attempts += 1;
      if (a.score > existing.bestScore) existing.bestScore = a.score;
      if (a.passed) existing.passed = true;
      if (a.completedAt > existing.lastAttemptAt)
        existing.lastAttemptAt = a.completedAt;
    }
  }
  const summary = Array.from(perStudent.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const studentsPassed = summary.filter((s) => s.passed).length;
  const studentsAttempted = summary.length;

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

      {/* Student attempts */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-sm tracking-wider uppercase text-brand-muted">
            Student attempts ({studentsAttempted})
          </h2>
          {studentsAttempted > 0 && (
            <span className="text-xs text-brand-muted">
              {studentsPassed}/{studentsAttempted} passed
            </span>
          )}
        </div>

        {summary.length === 0 ? (
          <p className="text-center py-12 text-brand-muted bg-white rounded-xl border border-brand-border">
            No students have attempted this quiz yet.
          </p>
        ) : (
          <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brand-surface/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-brand-muted text-xs tracking-wider uppercase">
                    Student
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-brand-muted text-xs tracking-wider uppercase">
                    Attempts
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-brand-muted text-xs tracking-wider uppercase">
                    Best score
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-brand-muted text-xs tracking-wider uppercase">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-brand-muted text-xs tracking-wider uppercase hidden sm:table-cell">
                    Last attempt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {summary.map((s) => (
                  <tr key={s.email}>
                    <td className="px-4 py-3">
                      <p className="text-brand-primary font-medium">{s.name}</p>
                      <p className="text-xs text-brand-muted truncate">
                        {s.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-brand-primary">
                      {s.attempts}
                      {quiz.maxAttempts ? `/${quiz.maxAttempts}` : ""}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-brand-primary">
                      {s.bestScore}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      {s.passed ? (
                        <span className="text-xs tracking-wider uppercase text-brand-success">
                          ✓ Passed
                        </span>
                      ) : (
                        <span className="text-xs tracking-wider uppercase text-brand-muted">
                          Not yet
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-brand-muted hidden sm:table-cell">
                      {s.lastAttemptAt.toLocaleDateString("en-IE", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
