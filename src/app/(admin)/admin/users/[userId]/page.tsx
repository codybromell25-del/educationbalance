import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { resolveFileUrl } from "@/lib/storage";
import UserRowActions from "@/components/admin/UserRowActions";

const HOUR_CATEGORY_LABEL: Record<string, string> = {
  OBSERVATION: "Observation",
  TEACHING: "Teaching",
  SELF_PRACTICE: "Self-practice",
};

const HOUR_CATEGORY_BADGE: Record<string, string> = {
  OBSERVATION: "bg-brand-sage/10 text-brand-sage",
  TEACHING: "bg-brand-accent/10 text-brand-accent",
  SELF_PRACTICE: "bg-brand-primary/10 text-brand-primary",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) notFound();

  const [
    sections,
    progressRows,
    quizAttempts,
    submissions,
    hourLogs,
    questions,
  ] = await Promise.all([
    prisma.section.findMany({
      orderBy: { order: "asc" },
      include: {
        parts: {
          select: {
            id: true,
            type: true,
            title: true,
            order: true,
            quiz: { select: { id: true, passingScore: true } },
          },
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.progress.findMany({
      where: { userId },
      select: { sectionId: true, completed: true, completedAt: true },
    }),
    prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      include: {
        quiz: {
          select: {
            id: true,
            passingScore: true,
            maxAttempts: true,
            part: {
              select: {
                title: true,
                section: {
                  select: { title: true, order: true, id: true },
                },
              },
            },
          },
        },
      },
    }),
    prisma.submission.findMany({
      where: { userId },
      orderBy: { submittedAt: "desc" },
      include: {
        part: {
          select: {
            title: true,
            section: { select: { title: true, order: true } },
          },
        },
      },
    }),
    prisma.hourLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        signedOffBy: { select: { name: true } },
      },
    }),
    prisma.question.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { section: { select: { title: true, order: true } } },
    }),
  ]);

  // --- Course progress per section ---
  const progressBySection = new Map(progressRows.map((p) => [p.sectionId, p]));
  const completedSections = progressRows.filter((p) => p.completed).length;
  const overallPercent =
    sections.length > 0
      ? Math.round((completedSections / sections.length) * 100)
      : 0;

  // --- Quiz aggregation ---
  // Group by quizId: count attempts, best score, passed flag
  const perQuiz = new Map<
    string,
    {
      quizId: string;
      partTitle: string;
      sectionTitle: string;
      sectionOrder: number;
      passingScore: number;
      maxAttempts: number | null;
      attempts: number;
      bestScore: number;
      latestScore: number;
      passed: boolean;
      lastAttemptAt: Date;
    }
  >();
  for (const a of quizAttempts) {
    const existing = perQuiz.get(a.quizId);
    if (!existing) {
      perQuiz.set(a.quizId, {
        quizId: a.quizId,
        partTitle: a.quiz.part.title,
        sectionTitle: a.quiz.part.section.title,
        sectionOrder: a.quiz.part.section.order,
        passingScore: a.quiz.passingScore,
        maxAttempts: a.quiz.maxAttempts,
        attempts: 1,
        bestScore: a.score,
        latestScore: a.score,
        passed: a.passed,
        lastAttemptAt: a.completedAt,
      });
    } else {
      existing.attempts += 1;
      if (a.score > existing.bestScore) existing.bestScore = a.score;
      if (a.passed) existing.passed = true;
      if (a.completedAt > existing.lastAttemptAt) {
        existing.lastAttemptAt = a.completedAt;
        existing.latestScore = a.score;
      }
    }
  }
  const quizSummary = Array.from(perQuiz.values()).sort(
    (a, b) => a.sectionOrder - b.sectionOrder,
  );

  const avgQuizScoreOverall =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((sum, a) => sum + a.score, 0) /
            quizAttempts.length,
        )
      : null;
  const quizzesPassed = quizSummary.filter((q) => q.passed).length;
  const quizzesAttempted = quizSummary.length;

  // --- Submissions aggregation ---
  const submissionFileUrls = new Map(
    await Promise.all(
      submissions
        .filter((s) => s.fileUrl)
        .map(async (s) => [s.id, await resolveFileUrl(s.fileUrl)] as const),
    ),
  );
  const submissionsReviewed = submissions.filter((s) => s.reviewed).length;

  // --- Hour logs aggregation ---
  const hourFileUrls = new Map(
    await Promise.all(
      hourLogs
        .filter((l) => l.fileUrl)
        .map(async (l) => [l.id, await resolveFileUrl(l.fileUrl)] as const),
    ),
  );
  const hourTotals = hourLogs.reduce(
    (acc, l) => {
      acc.total += l.durationMinutes;
      acc[l.category] = (acc[l.category] ?? 0) + l.durationMinutes;
      if (l.signedOffAt) acc.signedOff += l.durationMinutes;
      return acc;
    },
    {
      total: 0,
      signedOff: 0,
      OBSERVATION: 0,
      TEACHING: 0,
      SELF_PRACTICE: 0,
    } as Record<string, number>,
  );

  return (
    <div className="p-5 md:p-8">
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="text-sm text-brand-muted hover:text-brand-primary"
        >
          ← All users
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-brand-primary">
            {user.name}
          </h1>
          <p className="text-brand-muted mt-1">{user.email}</p>
          <p className="text-xs text-brand-muted mt-1">
            Joined{" "}
            {user.createdAt.toLocaleDateString("en-IE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <UserRowActions
          user={{ id: user.id, name: user.name, email: user.email }}
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <StatCard
          value={`${overallPercent}%`}
          label="Course complete"
          sub={`${completedSections}/${sections.length} sections`}
        />
        <StatCard
          value={
            avgQuizScoreOverall !== null ? `${avgQuizScoreOverall}%` : "—"
          }
          label="Quiz average"
          sub={`${quizzesPassed}/${quizzesAttempted} passed`}
        />
        <StatCard
          value={`${submissions.length}`}
          label="Submissions"
          sub={`${submissionsReviewed} reviewed`}
        />
        <StatCard
          value={formatHours(hourTotals.total)}
          label="Hours logged"
          sub={`${formatHours(hourTotals.signedOff)} signed off`}
        />
      </div>

      {/* Course progress */}
      <Section title="Course progress">
        <ul className="space-y-2">
          {sections.map((section) => {
            const sectionProgress = progressBySection.get(section.id);
            const sectionCompleted = !!sectionProgress?.completed;
            const totalParts = section.parts.length;
            // A part counts as "done" if it's a QUIZ with a passing attempt,
            // a SUBMIT with any submission, or any other type once the
            // section itself is marked complete (TEXT/VIDEO/DOWNLOAD have no
            // intrinsic completion event).
            const partsDone = section.parts.filter((p) => {
              if (p.type === "QUIZ" && p.quiz) {
                return quizAttempts.some(
                  (a) => a.quizId === p.quiz!.id && a.passed,
                );
              }
              if (p.type === "SUBMIT") {
                return submissions.some((s) => s.partId === p.id);
              }
              return sectionCompleted;
            }).length;
            const partPercent =
              totalParts > 0
                ? Math.round((partsDone / totalParts) * 100)
                : 0;
            return (
              <li
                key={section.id}
                className="bg-white rounded-xl border border-brand-border p-4"
              >
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${
                        sectionCompleted
                          ? "bg-brand-success text-white"
                          : "bg-brand-surface text-brand-muted"
                      }`}
                    >
                      {sectionCompleted ? "✓" : section.order}
                    </div>
                    <div className="min-w-0">
                      <p className="text-brand-primary font-medium truncate">
                        {section.title}
                      </p>
                      <p className="text-xs text-brand-muted">
                        {partsDone}/{totalParts} parts ·{" "}
                        {sectionCompleted
                          ? `marked complete ${sectionProgress?.completedAt?.toLocaleDateString("en-IE", { day: "numeric", month: "short" }) ?? ""}`
                          : "not yet complete"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-brand-muted shrink-0">
                    {partPercent}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-brand-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-sage rounded-full"
                    style={{ width: `${partPercent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Quiz performance */}
      <Section title={`Quiz performance (${quizSummary.length})`}>
        {quizSummary.length === 0 ? (
          <Empty>This student hasn&rsquo;t attempted any quizzes yet.</Empty>
        ) : (
          <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-surface/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                      Quiz
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                      Attempts
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                      Best
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                      Latest
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {quizSummary.map((q) => (
                    <tr key={q.quizId}>
                      <td className="px-4 py-3">
                        <p className="text-brand-primary font-medium">
                          {q.partTitle}
                        </p>
                        <p className="text-xs text-brand-muted">
                          Section {q.sectionOrder}: {q.sectionTitle} · pass{" "}
                          {q.passingScore}%
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right text-brand-primary">
                        {q.attempts}
                        {q.maxAttempts ? `/${q.maxAttempts}` : ""}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-brand-primary">
                        {q.bestScore}%
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-brand-muted">
                        {q.latestScore}%
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {q.passed ? (
                          <span className="text-xs tracking-wider uppercase text-brand-success">
                            ✓ Passed
                          </span>
                        ) : (
                          <span className="text-xs tracking-wider uppercase text-brand-muted">
                            Not yet
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Section>

      {/* Submissions */}
      <Section title={`Submissions (${submissions.length})`}>
        {submissions.length === 0 ? (
          <Empty>No submissions yet.</Empty>
        ) : (
          <ul className="space-y-3">
            {submissions.map((s) => {
              const fileUrl = submissionFileUrls.get(s.id) ?? null;
              return (
                <li
                  key={s.id}
                  className={`bg-white rounded-xl border p-5 ${s.reviewed ? "border-brand-border" : "border-brand-sage/30"}`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                    <div>
                      <p className="text-brand-primary font-medium">
                        {s.part.title}
                      </p>
                      <p className="text-xs text-brand-muted">
                        Section {s.part.section.order}: {s.part.section.title}{" "}
                        · submitted{" "}
                        {s.submittedAt.toLocaleDateString("en-IE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {s.reviewed ? (
                      <span className="text-xs tracking-wider uppercase text-brand-success">
                        ✓ Reviewed
                      </span>
                    ) : (
                      <span className="text-xs tracking-wider uppercase text-brand-sage">
                        Pending review
                      </span>
                    )}
                  </div>
                  {s.content && (
                    <p className="text-sm text-brand-primary/80 whitespace-pre-wrap">
                      {s.content.length > 400
                        ? s.content.slice(0, 400) + "…"
                        : s.content}
                    </p>
                  )}
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-brand-sage hover:text-brand-sage-dark"
                    >
                      📎 Open attached file
                    </a>
                  )}
                  {s.feedback && (
                    <div className="mt-3 pt-3 border-t border-brand-border">
                      <p className="text-xs tracking-wider uppercase text-brand-sage mb-1">
                        Your feedback
                      </p>
                      <p className="text-sm text-brand-primary/80 whitespace-pre-wrap">
                        {s.feedback}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {/* Hours */}
      <Section title={`Practice hours (${hourLogs.length})`}>
        {hourLogs.length === 0 ? (
          <Empty>No hours logged yet.</Empty>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <MiniStat
                label="Total"
                value={formatHours(hourTotals.total)}
              />
              <MiniStat
                label="Signed off"
                value={formatHours(hourTotals.signedOff)}
              />
              <MiniStat
                label="Observation"
                value={formatHours(hourTotals.OBSERVATION ?? 0)}
              />
              <MiniStat
                label="Teaching"
                value={formatHours(hourTotals.TEACHING ?? 0)}
              />
            </div>
            <ul className="space-y-3">
              {hourLogs.map((l) => {
                const fileUrl = hourFileUrls.get(l.id) ?? null;
                const signed = !!l.signedOffAt;
                return (
                  <li
                    key={l.id}
                    className={`bg-white rounded-xl border p-4 ${signed ? "border-brand-success/30" : "border-brand-border"}`}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs tracking-wider uppercase rounded-full px-2 py-0.5 ${HOUR_CATEGORY_BADGE[l.category]}`}
                        >
                          {HOUR_CATEGORY_LABEL[l.category]}
                        </span>
                        <span className="text-sm text-brand-primary font-medium">
                          {formatHours(l.durationMinutes)}
                        </span>
                        <span className="text-sm text-brand-muted">
                          {l.date.toLocaleDateString("en-IE", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {signed && (
                        <span className="text-xs text-brand-success">
                          ✓ Signed off
                          {l.signedOffBy ? ` by ${l.signedOffBy.name}` : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-brand-primary/80 whitespace-pre-wrap mt-1">
                      {l.description}
                    </p>
                    {fileUrl && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-sm text-brand-sage hover:text-brand-sage-dark"
                      >
                        📎 Open evidence
                      </a>
                    )}
                    {l.feedback && (
                      <div className="mt-2 pt-2 border-t border-brand-border">
                        <p className="text-xs tracking-wider uppercase text-brand-sage mb-0.5">
                          Feedback
                        </p>
                        <p className="text-sm text-brand-primary/80 whitespace-pre-wrap">
                          {l.feedback}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Section>

      {/* Q&A */}
      <Section title={`Questions asked (${questions.length})`}>
        {questions.length === 0 ? (
          <Empty>No questions asked yet.</Empty>
        ) : (
          <ul className="space-y-3">
            {questions.map((q) => (
              <li
                key={q.id}
                className="bg-white rounded-xl border border-brand-border p-4"
              >
                <p className="text-xs text-brand-muted mb-1">
                  Section {q.section.order}: {q.section.title} · asked{" "}
                  {q.createdAt.toLocaleDateString("en-IE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-brand-primary whitespace-pre-wrap">
                  {q.message}
                </p>
                {q.response ? (
                  <div className="mt-2 pt-2 border-t border-brand-border">
                    <p className="text-xs tracking-wider uppercase text-brand-sage mb-0.5">
                      Your reply
                    </p>
                    <p className="text-sm text-brand-primary/80 whitespace-pre-wrap">
                      {q.response}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-brand-sage italic mt-1">
                    Awaiting reply
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

// --- helpers ---

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10">
      <h2 className="text-sm tracking-wider uppercase text-brand-muted mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function StatCard({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border p-4 sm:p-5 text-center">
      <p className="text-2xl sm:text-3xl font-light text-brand-primary">
        {value}
      </p>
      <p className="text-xs text-brand-muted tracking-wider uppercase mt-1">
        {label}
      </p>
      {sub && <p className="text-xs text-brand-muted mt-0.5">{sub}</p>}
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white rounded-xl border border-brand-border p-3 text-center">
      <p className="text-lg font-light text-brand-primary">{value}</p>
      <p className="text-xs text-brand-muted tracking-wider uppercase mt-0.5">
        {label}
      </p>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center py-8 text-brand-muted bg-white rounded-xl border border-brand-border text-sm">
      {children}
    </p>
  );
}

function formatHours(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
