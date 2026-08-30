import Link from "next/link";
import { prisma } from "@/lib/db";
import CreateUserForm from "@/components/admin/CreateUserForm";
import UserRowActions from "@/components/admin/UserRowActions";

/**
 * Users list — one row per enrolled student. Optionally filtered by cohort
 * via a ?cohort=<slug> URL param. Defaults to showing every student across
 * every cohort so nothing existing gets hidden by the new cohort feature;
 * Catherine picks a cohort from the dropdown to narrow.
 */
export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ cohort?: string }>;
}) {
  const sp = await searchParams;
  const cohortSlug = sp.cohort && sp.cohort !== "all" ? sp.cohort : null;

  const [cohorts, resolvedCohort] = await Promise.all([
    prisma.cohort.findMany({
      orderBy: [{ isArchived: "asc" }, { startDate: "desc" }],
    }),
    cohortSlug
      ? prisma.cohort.findUnique({ where: { slug: cohortSlug } })
      : Promise.resolve(null),
  ]);

  const users = await prisma.user.findMany({
    where: {
      role: "USER",
      ...(resolvedCohort ? { cohortId: resolvedCohort.id } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      progress: { where: { completed: true } },
      cohort: { select: { id: true, name: true, slug: true, isArchived: true } },
      _count: { select: { questions: true } },
    },
  });

  const totalSections = await prisma.section.count();

  // Pick a sensible default cohort for the "create" form — the newest
  // active, non-archived cohort. Falls back to null (No cohort).
  const activeCohorts = cohorts.filter((c) => c.isActive && !c.isArchived);
  const defaultCohortId = activeCohorts[0]?.id ?? null;

  const cohortOptions = cohorts.map((c) => ({
    id: c.id,
    name: c.name,
    isActive: c.isActive,
    isArchived: c.isArchived,
  }));

  return (
    <div className="p-5 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-brand-primary">
            Users
          </h1>
          <p className="text-brand-muted mt-2">
            Manage course participants and create new accounts.
            {resolvedCohort && (
              <>
                {" "}
                Filtered by cohort:{" "}
                <span className="text-brand-primary font-medium">
                  {resolvedCohort.name}
                </span>
                .{" "}
                <Link
                  href="/admin/users"
                  className="text-brand-sage hover:underline"
                >
                  Clear filter
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Cohort filter form -------------------------------------------- */}
      {cohorts.length > 0 && (
        <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-brand-muted mb-1">
              Show cohort
            </label>
            <select
              name="cohort"
              defaultValue={cohortSlug ?? "all"}
              className="px-4 py-2 rounded-lg border border-brand-border bg-white text-sm min-w-[220px]"
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
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-brand-primary text-white text-sm hover:bg-brand-primary/90"
          >
            Apply
          </button>
        </form>
      )}

      {/* Create user form */}
      <CreateUserForm
        cohorts={cohortOptions}
        defaultCohortId={defaultCohortId}
      />

      {/* Users table — desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-brand-border overflow-hidden mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface/50">
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Name
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Email
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Pathway
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Cohort
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Progress
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Questions
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Joined
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-brand-border last:border-0 hover:bg-brand-surface/30 transition-colors align-top"
              >
                <td className="px-6 py-4 text-sm">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-brand-primary font-medium hover:text-brand-sage"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-brand-muted">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.pathway ? (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-medium tracking-wide">
                      {user.pathway === "COMPREHENSIVE"
                        ? "Comp"
                        : user.pathway === "MAT"
                          ? "Mat"
                          : "Reformer"}
                    </span>
                  ) : (
                    <span className="text-xs text-brand-muted italic">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.cohort ? (
                    <span
                      className={
                        "text-xs " +
                        (user.cohort.isArchived
                          ? "text-brand-muted italic"
                          : "text-brand-primary")
                      }
                    >
                      {user.cohort.name}
                    </span>
                  ) : (
                    <span className="text-xs text-brand-muted italic">
                      No cohort
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-brand-muted">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-16 h-1.5 bg-brand-surface rounded-full overflow-hidden">
                      <span
                        className="block h-full bg-brand-sage rounded-full"
                        style={{
                          width: `${
                            totalSections > 0
                              ? (user.progress.length / totalSections) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </span>
                    {user.progress.length}/{totalSections}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-brand-muted">
                  {user._count.questions}
                </td>
                <td className="px-6 py-4 text-sm text-brand-muted whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleDateString("en-IE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <UserRowActions
                    user={{
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      role: user.role,
                      pathway: user.pathway,
                      cohortId: user.cohortId,
                    }}
                    cohorts={cohortOptions}
                  />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-brand-muted"
                >
                  {resolvedCohort
                    ? "No students in this cohort yet."
                    : "No users yet. Create the first one above."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Users cards — mobile */}
      <div className="md:hidden mt-6 space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl border border-brand-border p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="text-brand-primary font-medium hover:text-brand-sage"
                >
                  {user.name}
                </Link>
                <p className="text-sm text-brand-muted truncate">{user.email}</p>
                {user.cohort && (
                  <p className="text-xs text-brand-muted mt-1">
                    {user.cohort.name}
                    {user.cohort.isArchived && " (archived)"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-muted mb-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-12 h-1.5 bg-brand-surface rounded-full overflow-hidden inline-block">
                  <span
                    className="block h-full bg-brand-sage rounded-full"
                    style={{
                      width: `${
                        totalSections > 0
                          ? (user.progress.length / totalSections) * 100
                          : 0
                      }%`,
                    }}
                  />
                </span>
                {user.progress.length}/{totalSections}
              </span>
              <span>·</span>
              <span>{user._count.questions} questions</span>
              <span>·</span>
              <span>
                joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-IE", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <UserRowActions
              user={{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                pathway: user.pathway,
                cohortId: user.cohortId,
              }}
              cohorts={cohortOptions}
            />
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-center py-12 text-brand-muted bg-white rounded-xl border border-brand-border">
            {resolvedCohort
              ? "No students in this cohort yet."
              : "No users yet. Create the first one above."}
          </p>
        )}
      </div>
    </div>
  );
}
