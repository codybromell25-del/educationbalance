import { prisma } from "@/lib/db";
import ReviewSubmissionButton from "@/components/admin/ReviewSubmissionButton";
import { resolveFileUrl } from "@/lib/storage";

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.submission.findMany({
    orderBy: [{ reviewed: "asc" }, { submittedAt: "desc" }],
    include: {
      user: { select: { name: true, email: true } },
      part: {
        select: {
          title: true,
          section: { select: { title: true, order: true } },
        },
      },
    },
  });

  // Pre-resolve any storage paths to signed URLs so admins can open
  // attachments without an extra round-trip.
  const fileSignedUrls = new Map(
    await Promise.all(
      submissions
        .filter((s) => s.fileUrl)
        .map(async (s) => [s.id, await resolveFileUrl(s.fileUrl)] as const),
    ),
  );

  const pending = submissions.filter((s) => !s.reviewed);
  const reviewed = submissions.filter((s) => s.reviewed);

  return (
    <div className="p-5 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          Submissions
        </h1>
        <p className="text-brand-muted mt-2">
          Reflective responses and uploads submitted by users.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-sm tracking-wider uppercase text-brand-sage mb-4 flex items-center gap-2">
          Pending Review
          {pending.length > 0 && (
            <span className="bg-brand-sage text-white text-xs px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </h2>
        <div className="space-y-4">
          {pending.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-brand-sage/30 p-6"
            >
              <div className="flex items-start justify-between mb-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-brand-primary">
                    {s.user.name}
                  </p>
                  <p className="text-xs text-brand-muted">
                    Section {s.part.section.order}: {s.part.section.title} ·{" "}
                    {s.part.title} ·{" "}
                    {new Date(s.submittedAt).toLocaleDateString("en-IE", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <ReviewSubmissionButton submissionId={s.id} />
              </div>
              {s.content && (
                <p className="text-brand-primary whitespace-pre-wrap">
                  {s.content}
                </p>
              )}
              {s.fileUrl && fileSignedUrls.get(s.id) && (
                <a
                  href={fileSignedUrls.get(s.id) ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm text-brand-sage hover:text-brand-sage-dark"
                >
                  📎 Open attached file
                </a>
              )}
            </div>
          ))}
          {pending.length === 0 && (
            <p className="text-brand-muted text-sm py-8 text-center">
              All caught up! No submissions awaiting review.
            </p>
          )}
        </div>
      </div>

      {reviewed.length > 0 && (
        <div>
          <h2 className="text-sm tracking-wider uppercase text-brand-muted mb-4">
            Reviewed ({reviewed.length})
          </h2>
          <div className="space-y-4">
            {reviewed.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-brand-border p-6"
              >
                <div className="mb-3">
                  <p className="text-sm font-medium text-brand-primary">
                    {s.user.name}
                  </p>
                  <p className="text-xs text-brand-muted">
                    Section {s.part.section.order}: {s.part.section.title} ·{" "}
                    {s.part.title} · submitted{" "}
                    {new Date(s.submittedAt).toLocaleDateString("en-IE", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                {s.content && (
                  <p className="text-brand-primary/80 whitespace-pre-wrap text-sm">
                    {s.content}
                  </p>
                )}
                {s.fileUrl && fileSignedUrls.get(s.id) && (
                  <a
                    href={fileSignedUrls.get(s.id) ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-sm text-brand-sage hover:text-brand-sage-dark"
                  >
                    📎 Open attached file
                  </a>
                )}
                {s.feedback && (
                  <div className="mt-4 pt-4 border-t border-brand-border">
                    <p className="text-xs tracking-wider uppercase text-brand-sage mb-1">
                      Your feedback
                    </p>
                    <p className="text-sm text-brand-primary/80 whitespace-pre-wrap">
                      {s.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
