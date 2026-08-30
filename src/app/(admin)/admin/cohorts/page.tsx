import { prisma } from "@/lib/db";
import CreateCohortForm from "@/components/admin/CreateCohortForm";
import CohortRowActions from "@/components/admin/CohortRowActions";

/**
 * Admin cohorts page.
 * Manage cohorts (create, rename, archive) and see student counts per
 * cohort at a glance. Filtering admin dashboards by cohort happens on
 * those dashboards themselves — this page is the source of truth for
 * which cohorts exist.
 */
export default async function AdminCohortsPage() {
  const cohorts = await prisma.cohort.findMany({
    orderBy: [{ isArchived: "asc" }, { startDate: "desc" }],
    include: { _count: { select: { users: true } } },
  });

  const activeCount = cohorts.filter((c) => c.isActive && !c.isArchived).length;

  return (
    <div className="p-5 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          Cohorts
        </h1>
        <p className="text-brand-muted mt-2">
          Group students by intake so admin dashboards don't mix multiple
          cohorts together. Currently {activeCount} active cohort
          {activeCount === 1 ? "" : "s"}.
        </p>
      </div>

      <CreateCohortForm />

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-brand-border overflow-hidden mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface/50">
              <Th>Name</Th>
              <Th>Slug</Th>
              <Th>Dates</Th>
              <Th>Students</Th>
              <Th>Status</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c) => (
              <tr
                key={c.id}
                className={
                  "border-b border-brand-border last:border-0 hover:bg-brand-surface/30 transition-colors align-top " +
                  (c.isArchived ? "opacity-60" : "")
                }
              >
                <Td>
                  <div className="text-brand-primary font-medium">{c.name}</div>
                  {c.description && (
                    <div className="text-xs text-brand-muted mt-1">
                      {c.description}
                    </div>
                  )}
                </Td>
                <Td muted>
                  <code className="text-xs bg-brand-surface px-2 py-0.5 rounded">
                    {c.slug}
                  </code>
                </Td>
                <Td muted>
                  {new Date(c.startDate).toLocaleDateString("en-IE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {c.endDate && (
                    <>
                      <span className="text-brand-muted mx-1">→</span>
                      {new Date(c.endDate).toLocaleDateString("en-IE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </>
                  )}
                </Td>
                <Td>
                  <span className="text-brand-primary font-medium">
                    {c._count.users}
                  </span>
                </Td>
                <Td>
                  <StatusPills active={c.isActive} archived={c.isArchived} />
                </Td>
                <Td align="right">
                  <CohortRowActions
                    cohort={{
                      id: c.id,
                      name: c.name,
                      startDate: c.startDate.toISOString(),
                      endDate: c.endDate?.toISOString() ?? null,
                      isActive: c.isActive,
                      isArchived: c.isArchived,
                      description: c.description,
                    }}
                  />
                </Td>
              </tr>
            ))}
            {cohorts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-brand-muted"
                >
                  No cohorts yet. Create the first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden mt-6 space-y-3">
        {cohorts.map((c) => (
          <div
            key={c.id}
            className={
              "bg-white rounded-xl border border-brand-border p-4 " +
              (c.isArchived ? "opacity-60" : "")
            }
          >
            <div className="mb-2">
              <p className="text-brand-primary font-medium">{c.name}</p>
              <p className="text-xs text-brand-muted mt-0.5">
                <code className="bg-brand-surface px-1.5 py-0.5 rounded">
                  {c.slug}
                </code>
              </p>
            </div>
            <p className="text-xs text-brand-muted mb-2">
              {new Date(c.startDate).toLocaleDateString("en-IE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {c.endDate &&
                ` → ${new Date(c.endDate).toLocaleDateString("en-IE", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}`}
              {" · "}
              {c._count.users} student{c._count.users === 1 ? "" : "s"}
            </p>
            <div className="mb-3">
              <StatusPills active={c.isActive} archived={c.isArchived} />
            </div>
            <CohortRowActions
              cohort={{
                id: c.id,
                name: c.name,
                startDate: c.startDate.toISOString(),
                endDate: c.endDate?.toISOString() ?? null,
                isActive: c.isActive,
                isArchived: c.isArchived,
                description: c.description,
              }}
            />
          </div>
        ))}
      </div>
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
        "px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase " +
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
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  muted?: boolean;
}) {
  return (
    <td
      className={
        "px-6 py-4 text-sm " +
        (align === "right" ? "text-right " : "") +
        (muted ? "text-brand-muted" : "text-brand-primary")
      }
    >
      {children}
    </td>
  );
}

function StatusPills({
  active,
  archived,
}: {
  active: boolean;
  archived: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {archived ? (
        <span className="inline-block px-2 py-0.5 rounded-full bg-brand-primary/5 text-brand-muted text-[10px] tracking-wider uppercase font-medium">
          Archived
        </span>
      ) : active ? (
        <span className="inline-block px-2 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage text-[10px] tracking-wider uppercase font-semibold">
          Active
        </span>
      ) : (
        <span className="inline-block px-2 py-0.5 rounded-full bg-brand-accent/15 text-brand-accent-dark text-[10px] tracking-wider uppercase font-semibold">
          Inactive
        </span>
      )}
    </span>
  );
}
