import { prisma } from "@/lib/db";
import { resolveFileUrl } from "@/lib/storage";
import SignOffHourLogButton from "@/components/admin/SignOffHourLogButton";

const CATEGORY_LABEL: Record<string, string> = {
  OBSERVATION: "Observation",
  TEACHING: "Teaching",
  SELF_PRACTICE: "Self-practice",
};

const CATEGORY_BADGE: Record<string, string> = {
  OBSERVATION: "bg-brand-sage/10 text-brand-sage",
  TEACHING: "bg-brand-accent/10 text-brand-accent",
  SELF_PRACTICE: "bg-brand-primary/10 text-brand-primary",
};

export default async function AdminHoursPage() {
  const logs = await prisma.hourLog.findMany({
    orderBy: [{ signedOffAt: { sort: "asc", nulls: "first" } }, { date: "desc" }],
    include: {
      user: { select: { name: true, email: true } },
      signedOffBy: { select: { name: true } },
    },
  });

  const fileSignedUrls = new Map(
    await Promise.all(
      logs
        .filter((l) => l.fileUrl)
        .map(async (l) => [l.id, await resolveFileUrl(l.fileUrl)] as const),
    ),
  );

  const pending = logs.filter((l) => !l.signedOffAt);
  const signedOff = logs.filter((l) => l.signedOffAt);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          Practice Hours
        </h1>
        <p className="text-brand-muted mt-2">
          Sign off student observation, teaching and self-practice hours.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-sm tracking-wider uppercase text-brand-sage mb-4 flex items-center gap-2">
          Awaiting sign-off
          {pending.length > 0 && (
            <span className="bg-brand-sage text-white text-xs px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </h2>
        <div className="space-y-3">
          {pending.length === 0 && (
            <p className="text-brand-muted text-sm py-8 text-center bg-white rounded-xl border border-brand-border">
              All caught up.
            </p>
          )}
          {pending.map((l) => (
            <LogCard
              key={l.id}
              log={l}
              signedUrl={fileSignedUrls.get(l.id) ?? null}
            />
          ))}
        </div>
      </div>

      {signedOff.length > 0 && (
        <div>
          <h2 className="text-sm tracking-wider uppercase text-brand-muted mb-4">
            Signed off ({signedOff.length})
          </h2>
          <div className="space-y-3">
            {signedOff.map((l) => (
              <LogCard
                key={l.id}
                log={l}
                signedUrl={fileSignedUrls.get(l.id) ?? null}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type LogShape = {
  id: string;
  category: string;
  date: Date;
  durationMinutes: number;
  description: string;
  fileUrl: string | null;
  signedOffAt: Date | null;
  feedback: string | null;
  user: { name: string; email: string };
  signedOffBy: { name: string } | null;
};

function LogCard({ log, signedUrl }: { log: LogShape; signedUrl: string | null }) {
  const signed = !!log.signedOffAt;
  return (
    <div
      className={`bg-white rounded-xl border p-5 ${signed ? "border-brand-border" : "border-brand-sage/30"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-medium text-brand-primary">
              {log.user.name}
            </span>
            <span
              className={`text-xs tracking-wider uppercase rounded-full px-2 py-0.5 ${CATEGORY_BADGE[log.category]}`}
            >
              {CATEGORY_LABEL[log.category]}
            </span>
            <span className="text-xs text-brand-muted">
              {formatMinutes(log.durationMinutes)} ·{" "}
              {new Date(log.date).toLocaleDateString("en-IE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            {signed && log.signedOffBy && (
              <span className="text-xs text-brand-success">
                ✓ by {log.signedOffBy.name}
              </span>
            )}
          </div>
          <p className="text-sm text-brand-primary/80 whitespace-pre-wrap">
            {log.description}
          </p>
          {signedUrl && (
            <a
              href={signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-brand-sage hover:text-brand-sage-dark"
            >
              📎 Open evidence
            </a>
          )}
          {log.feedback && (
            <div className="mt-3 pt-3 border-t border-brand-border">
              <p className="text-xs tracking-wider uppercase text-brand-sage mb-1">
                Your feedback
              </p>
              <p className="text-sm text-brand-primary/80 whitespace-pre-wrap">
                {log.feedback}
              </p>
            </div>
          )}
        </div>
        <SignOffHourLogButton logId={log.id} alreadySignedOff={signed} />
      </div>
    </div>
  );
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
