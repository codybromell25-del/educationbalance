import { prisma } from "@/lib/db";
import ApplicationRowActions from "@/components/admin/ApplicationRowActions";

const PATHWAY_LABEL: Record<string, string> = {
  A: "Comprehensive",
  B: "Mat only",
  C: "Reformer only",
  UNSURE: "Not sure yet",
};

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: [{ contacted: "asc" }, { createdAt: "desc" }],
  });

  const newApps = applications.filter((a) => !a.contacted);
  const contacted = applications.filter((a) => a.contacted);

  return (
    <div className="p-5 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          Course applications
        </h1>
        <p className="text-brand-muted mt-2">
          Submissions from the landing-page form.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-sm tracking-wider uppercase text-brand-sage mb-4 flex items-center gap-2">
          New
          {newApps.length > 0 && (
            <span className="bg-brand-sage text-white text-xs px-2 py-0.5 rounded-full">
              {newApps.length}
            </span>
          )}
        </h2>
        <div className="space-y-3">
          {newApps.length === 0 && (
            <p className="text-brand-muted text-sm py-8 text-center bg-white rounded-xl border border-brand-border">
              All caught up.
            </p>
          )}
          {newApps.map((a) => (
            <Card key={a.id} app={a} />
          ))}
        </div>
      </div>

      {contacted.length > 0 && (
        <div>
          <h2 className="text-sm tracking-wider uppercase text-brand-muted mb-4">
            Contacted ({contacted.length})
          </h2>
          <div className="space-y-3">
            {contacted.map((a) => (
              <Card key={a.id} app={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type ApplicationRow = {
  id: string;
  name: string;
  email: string;
  pathway: string;
  notes: string | null;
  contacted: boolean;
  createdAt: Date;
};

function Card({ app }: { app: ApplicationRow }) {
  const pathwayLabel = PATHWAY_LABEL[app.pathway] ?? app.pathway;
  return (
    <div
      className={`bg-white rounded-xl border p-5 ${app.contacted ? "border-brand-border" : "border-brand-sage/30"}`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <div className="min-w-0">
          <p className="text-brand-primary font-medium">{app.name}</p>
          <p className="text-sm text-brand-muted">
            <a href={`mailto:${app.email}`} className="hover:text-brand-sage">
              {app.email}
            </a>{" "}
            · <span className="text-brand-sage">{pathwayLabel}</span> ·{" "}
            {app.createdAt.toLocaleDateString("en-IE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <ApplicationRowActions id={app.id} contacted={app.contacted} />
      </div>
      {app.notes && (
        <p className="text-sm text-brand-primary/80 whitespace-pre-wrap mt-2">
          {app.notes}
        </p>
      )}
    </div>
  );
}
