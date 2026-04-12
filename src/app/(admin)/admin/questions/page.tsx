import { prisma } from "@/lib/db";
import RespondForm from "@/components/admin/RespondForm";

export default async function AdminQuestionsPage() {
  const questions = await prisma.question.findMany({
    orderBy: [{ response: "asc" }, { createdAt: "desc" }],
    include: {
      user: { select: { name: true, email: true } },
      section: { select: { title: true, order: true } },
    },
  });

  const unanswered = questions.filter((q) => !q.response);
  const answered = questions.filter((q) => q.response);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          Questions
        </h1>
        <p className="text-brand-muted mt-2">
          View and respond to user questions across all sections.
        </p>
      </div>

      {/* Unanswered */}
      <div className="mb-12">
        <h2 className="text-sm tracking-wider uppercase text-brand-sage mb-4 flex items-center gap-2">
          Needs Response
          {unanswered.length > 0 && (
            <span className="bg-brand-sage text-white text-xs px-2 py-0.5 rounded-full">
              {unanswered.length}
            </span>
          )}
        </h2>
        <div className="space-y-4">
          {unanswered.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-brand-sage/30 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-brand-primary">
                    {q.user.name}
                  </p>
                  <p className="text-xs text-brand-muted">
                    Section {q.section.order}: {q.section.title} &middot;{" "}
                    {new Date(q.createdAt).toLocaleDateString("en-IE", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
              <p className="text-brand-primary mb-4">{q.message}</p>
              <RespondForm questionId={q.id} />
            </div>
          ))}
          {unanswered.length === 0 && (
            <p className="text-brand-muted text-sm py-8 text-center">
              All caught up! No unanswered questions.
            </p>
          )}
        </div>
      </div>

      {/* Answered */}
      {answered.length > 0 && (
        <div>
          <h2 className="text-sm tracking-wider uppercase text-brand-muted mb-4">
            Answered ({answered.length})
          </h2>
          <div className="space-y-4">
            {answered.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-brand-border p-6 opacity-80"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-brand-primary">
                      {q.user.name}
                    </p>
                    <p className="text-xs text-brand-muted">
                      Section {q.section.order}: {q.section.title} &middot;{" "}
                      {new Date(q.createdAt).toLocaleDateString("en-IE", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-brand-primary mb-3">{q.message}</p>
                <div className="pt-3 border-t border-brand-border">
                  <p className="text-sm text-brand-sage font-medium mb-1">
                    Your response
                  </p>
                  <p className="text-sm text-brand-primary/80">{q.response}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
