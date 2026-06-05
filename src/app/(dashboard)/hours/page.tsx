import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { resolveFileUrl } from "@/lib/storage";
import HourLogList from "@/components/HourLogList";

export default async function StudentHoursPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const logs = await prisma.hourLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    include: {
      signedOffBy: { select: { name: true } },
    },
  });

  // Pre-resolve file URLs server-side so the table renders signed links.
  const fileSignedUrls = new Map(
    await Promise.all(
      logs
        .filter((l) => l.fileUrl)
        .map(async (l) => [l.id, await resolveFileUrl(l.fileUrl)] as const),
    ),
  );

  const totals = logs.reduce(
    (acc, l) => {
      acc.all += l.durationMinutes;
      acc[l.category] = (acc[l.category] ?? 0) + l.durationMinutes;
      if (l.signedOffAt) acc.signedOff += l.durationMinutes;
      return acc;
    },
    {
      all: 0,
      signedOff: 0,
      OBSERVATION: 0,
      TEACHING: 0,
      SELF_PRACTICE: 0,
    } as Record<string, number>,
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary mb-2">
          Practice Hours
        </h1>
        <p className="text-brand-muted">
          Track your observation, teaching and self-practice hours. An
          instructor signs each entry off as you progress toward your
          certification.
        </p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: "Total logged", minutes: totals.all },
          { label: "Signed off", minutes: totals.signedOff },
          { label: "Observation", minutes: totals.OBSERVATION ?? 0 },
          { label: "Teaching", minutes: totals.TEACHING ?? 0 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-brand-border p-4 text-center"
          >
            <p className="text-2xl font-light text-brand-primary">
              {formatHours(stat.minutes)}
            </p>
            <p className="text-xs text-brand-muted tracking-wider uppercase mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <HourLogList
        initialLogs={logs.map((l) => ({
          id: l.id,
          category: l.category,
          date: l.date.toISOString(),
          durationMinutes: l.durationMinutes,
          description: l.description,
          fileUrl: l.fileUrl,
          fileSignedUrl: fileSignedUrls.get(l.id) ?? null,
          signedOffAt: l.signedOffAt?.toISOString() ?? null,
          signedOffByName: l.signedOffBy?.name ?? null,
          feedback: l.feedback,
        }))}
      />
    </div>
  );
}

function formatHours(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `${hours}h` : `${hours}h ${rem}m`;
}
