import { prisma } from "@/lib/db";
import Link from "next/link";
import type { Pathway, Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// Assessment Results
// ---------------------------------------------------------------------------
// A bird's-eye view of every quiz attempt and written submission across
// the whole cohort — one page Catherine can open to see "how's everyone
// doing?" without clicking into each student individually.
//
// Complements (not replaces) /admin/submissions, which is a review queue
// showing full submission content. This page is a scannable list; each
// student's name links through to /admin/users/{id} for their portfolio.
// ---------------------------------------------------------------------------

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

export default async function AdminAssessmentResultsPage({
  searchParams,
}: {
  searchParams: Promise<{
    cohort?: string;
    pathway?: string;
    search?: string;
    focus?: string;
  }>;
}) {
  const sp = await searchParams;

  // Resolve cohort slug → record so we can filter by the FK id.
  const cohortRecord =
    sp.cohort && sp.cohort !== "all"
      ? await prisma.cohort.findUnique({ where: { slug: sp.cohort } })
      : null;

  const pathwayFilter =
    sp.pathway && ["MAT", "REFORMER", "COMPREHENSIVE"].includes(sp.pathway)
      ? (sp.pathway as Pathway)
      : null;

  const searchTerm = sp.search?.trim() ?? "";
  const needsAttentionOnly = sp.focus === "needs-attention";

  // Shared user-level filters applied to both the quiz and submission
  // queries via a nested `user` where clause.
  const userWhere: Prisma.UserWhereInput = {};
  if (cohortRecord) userWhere.cohortId = cohortRecord.id;
  if (pathwayFilter) userWhere.pathway = pathwayFilter;
  if (searchTerm) {
    userWhere.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
    ];
  }
  const hasUserFilters = Object.keys(userWhere).length > 0;

  const whereQuiz: Prisma.QuizAttemptWhereInput = {
    ...(hasUserFilters && { user: userWhere }),
    ...(needsAttentionOnly && { passed: false }),
  };
  const whereSubmission: Prisma.SubmissionWhereInput = {
    ...(hasUserFilters && { user: userWhere }),
    ...(needsAttentionOnly && { reviewed: false }),
  };
  const whereEmbed: Prisma.EmbedAttemptWhereInput = {
    ...(hasUserFilters && { user: userWhere }),
    ...(needsAttentionOnly && { passed: false }),
  };

  const [quizAttempts, submissions, embedAttempts, cohorts] = await Promise.all([
    prisma.quizAttempt.findMany({
      where: whereQuiz,
      orderBy: { completedAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, pathway: true },
        },
        quiz: {
          select: {
            passingScore: true,
            part: {
              select: {
                title: true,
                section: { select: { title: true, order: true } },
              },
            },
          },
        },
      },
    }),
    prisma.submission.findMany({
      where: whereSubmission,
      orderBy: [{ reviewed: "asc" }, { submittedAt: "desc" }],
      include: {
        user: {
          select: { id: true, name: true, email: true, pathway: true },
        },
        part: {
          select: {
            title: true,
            section: { select: { title: true, order: true } },
          },
        },
      },
    }),
    prisma.embedAttempt.findMany({
      where: whereEmbed,
      orderBy: { completedAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, pathway: true },
        },
        part: {
          select: {
            title: true,
            section: { select: { title: true, order: true } },
          },
        },
      },
    }),
    prisma.cohort.findMany({
      orderBy: [{ isArchived: "asc" }, { startDate: "desc" }],
    }),
  ]);

  // Are any filters currently applied? (Used to show a "clear filters"
  // link and to word the summary strap appropriately.)
  const filtersActive =
    Boolean(cohortRecord) ||
    Boolean(pathwayFilter) ||
    Boolean(searchTerm) ||
    needsAttentionOnly;

  // Aggregate stats for the header cards
  const activeStudentIds = new Set([
    ...quizAttempts.map((a) => a.userId),
    ...submissions.map((s) => s.userId),
    ...embedAttempts.map((a) => a.userId),
  ]);
  const totalAttempts = quizAttempts.length;
  const passedAttempts = quizAttempts.filter((a) => a.passed).length;
  const passRate =
    totalAttempts > 0
      ? Math.round((passedAttempts / totalAttempts) * 100)
      : 0;
  const pendingSubmissions = submissions.filter((s) => !s.reviewed).length;

  return (
    <div className="p-5 md:p-8">
      {/* Header --------------------------------------------------- */}
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          Assessment Results
        </h1>
        <p className="text-brand-muted mt-2">
          Every quiz attempt and written submission from students. Most
          recent first. Click any student's name to open their full
          portfolio.
          {filtersActive && (
            <>
              {" "}
              <Link
                href="/admin/assessment-results"
                className="text-brand-sage hover:underline"
              >
                Clear filters
              </Link>
              .
            </>
          )}
        </p>
      </div>

      {/* Filter form ---------------------------------------------- */}
      <form
        method="get"
        className="mb-8 bg-white rounded-xl border border-brand-border p-5 flex flex-wrap items-end gap-3"
      >
        <div>
          <label className="block text-xs text-brand-muted mb-1">Cohort</label>
          <select
            name="cohort"
            defaultValue={sp.cohort ?? "all"}
            className="px-4 py-2 rounded-lg border border-brand-border bg-white text-sm min-w-[200px]"
          >
            <option value="all">All cohorts</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
                {c.isArchived ? " (archived)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-brand-muted mb-1">
            Pathway
          </label>
          <select
            name="pathway"
            defaultValue={sp.pathway ?? "all"}
            className="px-4 py-2 rounded-lg border border-brand-border bg-white text-sm min-w-[160px]"
          >
            <option value="all">All pathways</option>
            <option value="MAT">Mat</option>
            <option value="REFORMER">Reformer</option>
            <option value="COMPREHENSIVE">Comprehensive</option>
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs text-brand-muted mb-1">
            Search student
          </label>
          <input
            type="text"
            name="search"
            defaultValue={sp.search ?? ""}
            placeholder="Name or email"
            className="w-full px-4 py-2 rounded-lg border border-brand-border bg-white text-sm"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-brand-primary select-none px-3 py-2 rounded-lg border border-brand-border bg-brand-surface/50 cursor-pointer">
          <input
            type="checkbox"
            name="focus"
            value="needs-attention"
            defaultChecked={needsAttentionOnly}
            className="accent-brand-sage"
          />
          Needs attention only
        </label>
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-brand-primary text-white text-sm hover:bg-brand-primary/90"
        >
          Apply
        </button>
        {filtersActive && (
          <Link
            href="/admin/assessment-results"
            className="px-3 py-2 text-sm text-brand-muted hover:text-brand-primary"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Summary stat cards -------------------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        <StatCard label="Active students" value={activeStudentIds.size} />
        <StatCard label="Quiz attempts" value={totalAttempts} />
        <StatCard
          label="Pass rate"
          value={totalAttempts > 0 ? `${passRate}%` : "—"}
          sub={
            totalAttempts > 0
              ? `${passedAttempts} of ${totalAttempts} passed`
              : "no attempts yet"
          }
        />
        <StatCard label="Submissions" value={submissions.length} />
        <StatCard
          label="Awaiting review"
          value={pendingSubmissions}
          highlight={pendingSubmissions > 0}
        />
      </div>

      {/* Quiz attempts table ------------------------------------- */}
      <section className="mb-12">
        <h2 className="text-sm tracking-wider uppercase text-brand-sage mb-4">
          Quiz attempts ({quizAttempts.length})
        </h2>
        {quizAttempts.length === 0 ? (
          <Empty>No quiz attempts yet.</Empty>
        ) : (
          <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-surface/70 text-xs tracking-wider uppercase text-brand-muted">
                  <tr>
                    <Th>Date</Th>
                    <Th>Student</Th>
                    <Th>Quiz location</Th>
                    <Th align="right">Score</Th>
                    <Th align="right">Result</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {quizAttempts.map((a) => (
                    <tr key={a.id} className="hover:bg-brand-surface/40">
                      <Td muted>
                        {new Date(a.completedAt).toLocaleDateString(
                          "en-IE",
                          DATE_OPTS,
                        )}
                      </Td>
                      <Td>
                        <StudentCell
                          id={a.user.id}
                          name={a.user.name}
                          email={a.user.email}
                          pathway={a.user.pathway}
                        />
                      </Td>
                      <Td muted>
                        <span className="text-brand-primary/85">
                          {a.quiz.part.section.title}
                        </span>{" "}
                        <span className="text-brand-muted">·</span>{" "}
                        {a.quiz.part.title}
                      </Td>
                      <Td align="right" mono>
                        {a.score}%
                        <span className="text-brand-muted text-xs ml-1">
                          / {a.quiz.passingScore}% pass
                        </span>
                      </Td>
                      <Td align="right">
                        <ResultPill passed={a.passed} />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Interactive exercises table ------------------------------ */}
      <section className="mb-12">
        <h2 className="text-sm tracking-wider uppercase text-brand-sage mb-4">
          Interactive exercises ({embedAttempts.length})
        </h2>
        {embedAttempts.length === 0 ? (
          <Empty>No interactive exercise results yet.</Empty>
        ) : (
          <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-surface/70 text-xs tracking-wider uppercase text-brand-muted">
                  <tr>
                    <Th>Date</Th>
                    <Th>Student</Th>
                    <Th>Exercise</Th>
                    <Th align="right">Score</Th>
                    <Th align="right">Result</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {embedAttempts.map((a) => (
                    <tr key={a.id} className="hover:bg-brand-surface/40">
                      <Td muted>
                        {new Date(a.completedAt).toLocaleDateString(
                          "en-IE",
                          DATE_OPTS,
                        )}
                      </Td>
                      <Td>
                        <StudentCell
                          id={a.user.id}
                          name={a.user.name}
                          email={a.user.email}
                          pathway={a.user.pathway}
                        />
                      </Td>
                      <Td muted>
                        <span className="text-brand-primary/85">
                          {a.part.section.title}
                        </span>{" "}
                        <span className="text-brand-muted">·</span>{" "}
                        {a.part.title}
                      </Td>
                      <Td align="right" mono>
                        {a.score !== null ? `${a.score}%` : "—"}
                      </Td>
                      <Td align="right">
                        {a.passed === true ? (
                          <ResultPill passed />
                        ) : a.passed === false ? (
                          <ResultPill passed={false} />
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs tracking-wide">
                            Completed
                          </span>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Submissions table --------------------------------------- */}
      <section>
        <h2 className="text-sm tracking-wider uppercase text-brand-sage mb-4 flex items-center gap-2">
          Written submissions ({submissions.length})
          {pendingSubmissions > 0 && (
            <span className="bg-brand-sage text-white text-xs px-2 py-0.5 rounded-full">
              {pendingSubmissions} pending
            </span>
          )}
        </h2>
        {submissions.length === 0 ? (
          <Empty>No submissions yet.</Empty>
        ) : (
          <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-surface/70 text-xs tracking-wider uppercase text-brand-muted">
                  <tr>
                    <Th>Submitted</Th>
                    <Th>Student</Th>
                    <Th>Location</Th>
                    <Th>Contents</Th>
                    <Th align="right">Status</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-brand-surface/40">
                      <Td muted>
                        {new Date(s.submittedAt).toLocaleDateString(
                          "en-IE",
                          DATE_OPTS,
                        )}
                      </Td>
                      <Td>
                        <StudentCell
                          id={s.user.id}
                          name={s.user.name}
                          email={s.user.email}
                          pathway={s.user.pathway}
                        />
                      </Td>
                      <Td muted>
                        <span className="text-brand-primary/85">
                          {s.part.section.title}
                        </span>{" "}
                        <span className="text-brand-muted">·</span>{" "}
                        {s.part.title}
                      </Td>
                      <Td muted>
                        <SubmissionSummary
                          hasText={Boolean(s.content && s.content.length > 0)}
                          hasFile={Boolean(s.fileUrl)}
                        />
                      </Td>
                      <Td align="right">
                        {s.reviewed ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs tracking-wide">
                            Reviewed
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent-dark text-xs tracking-wide font-medium">
                            Awaiting review
                          </span>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {pendingSubmissions > 0 && (
          <p className="mt-4 text-xs text-brand-muted">
            To review the full content of a submission and mark it reviewed,
            open{" "}
            <Link
              href="/admin/submissions"
              className="text-brand-sage hover:underline"
            >
              /admin/submissions
            </Link>
            .
          </p>
        )}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small presentational helpers, kept local to this file to avoid growing
// a components/admin folder with one-shot pieces used nowhere else.
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-xl border p-4 " +
        (highlight
          ? "bg-brand-accent/10 border-brand-accent/40"
          : "bg-white border-brand-border")
      }
    >
      <p className="text-xs tracking-wider uppercase text-brand-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-light text-brand-primary tabular-nums">
        {value}
      </p>
      {sub && <p className="text-xs text-brand-muted mt-1">{sub}</p>}
    </div>
  );
}

function Th({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={
        "px-4 py-3 font-medium " +
        (align === "right" ? "text-right" : "text-left")
      }
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align,
  muted,
  mono,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  muted?: boolean;
  mono?: boolean;
}) {
  return (
    <td
      className={
        "px-4 py-3 align-top " +
        (align === "right" ? "text-right " : "") +
        (muted ? "text-brand-muted " : "text-brand-primary ") +
        (mono ? "tabular-nums " : "")
      }
    >
      {children}
    </td>
  );
}

function StudentCell({
  id,
  name,
  email,
  pathway,
}: {
  id: string;
  name: string | null;
  email: string;
  pathway: Pathway | null;
}) {
  return (
    <div className="min-w-0">
      <Link
        href={`/admin/users/${id}`}
        className="text-brand-primary font-medium hover:text-brand-sage"
      >
        {name || email}
      </Link>
      <div className="flex items-center gap-2 mt-0.5">
        {pathway && <PathwayPill pathway={pathway} />}
        <span className="text-xs text-brand-muted truncate">{email}</span>
      </div>
    </div>
  );
}

function PathwayPill({ pathway }: { pathway: Pathway }) {
  const cls =
    pathway === "MAT"
      ? "bg-brand-sage/10 text-brand-sage"
      : pathway === "REFORMER"
        ? "bg-brand-accent/15 text-brand-accent-dark"
        : "bg-brand-primary/5 text-brand-muted";
  const label =
    pathway === "MAT"
      ? "Mat"
      : pathway === "REFORMER"
        ? "Reformer"
        : "Comp";
  return (
    <span
      className={
        "inline-block px-1.5 py-0.5 rounded-full text-[10px] tracking-[0.12em] uppercase font-semibold " +
        cls
      }
    >
      {label}
    </span>
  );
}

function ResultPill({ passed }: { passed: boolean }) {
  return passed ? (
    <span className="inline-block px-2 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-medium tracking-wide">
      Passed
    </span>
  ) : (
    <span className="inline-block px-2 py-0.5 rounded-full bg-brand-primary/5 text-brand-muted text-xs tracking-wide">
      Not passed
    </span>
  );
}

function SubmissionSummary({
  hasText,
  hasFile,
}: {
  hasText: boolean;
  hasFile: boolean;
}) {
  const parts: string[] = [];
  if (hasText) parts.push("Written response");
  if (hasFile) parts.push("File attached");
  return (
    <span className="text-xs text-brand-muted">
      {parts.length > 0 ? parts.join(" · ") : "—"}
    </span>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-brand-border bg-white py-10 text-center text-sm text-brand-muted">
      {children}
    </div>
  );
}
