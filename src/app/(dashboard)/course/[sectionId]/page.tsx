import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import MarkCompleteButton from "@/components/MarkCompleteButton";
import QuestionForm from "@/components/QuestionForm";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const section = await prisma.section.findUnique({
    where: { slug: sectionId },
    include: {
      progress: { where: { userId: session.user.id } },
      questions: {
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!section) notFound();

  // Check if section is unlocked
  const now = new Date();
  if (new Date(section.unlockDate) > now) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-surface flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-brand-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-light text-brand-primary mb-4">
          Section Locked
        </h1>
        <p className="text-brand-muted mb-8">
          This section unlocks on{" "}
          {new Date(section.unlockDate).toLocaleDateString("en-IE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          .
        </p>
        <Link
          href="/dashboard"
          className="px-8 py-3 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Get adjacent sections for navigation
  const allSections = await prisma.section.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, title: true, order: true, unlockDate: true },
  });
  const currentIndex = allSections.findIndex((s) => s.slug === section.slug);
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex < allSections.length - 1
      ? allSections[currentIndex + 1]
      : null;

  const isCompleted = section.progress[0]?.completed ?? false;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
        <Link href="/dashboard" className="hover:text-brand-primary transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-brand-primary">{section.title}</span>
      </div>

      {/* Section header */}
      <div className="mb-12">
        <p className="text-brand-sage text-sm tracking-[0.3em] uppercase mb-3">
          Section {section.order}
        </p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-brand-primary mb-4">
          {section.title}
        </h1>
        <p className="text-brand-muted text-lg">{section.description}</p>
      </div>

      {/* Content */}
      <div className="prose prose-neutral max-w-none mb-12">
        <div
          className="bg-white rounded-2xl border border-brand-border p-8 md:p-12 leading-relaxed text-brand-primary/90"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </div>

      {/* Mark as complete */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-brand-primary">
              {isCompleted ? "Section completed" : "Finished this section?"}
            </h3>
            <p className="text-sm text-brand-muted mt-1">
              {isCompleted
                ? "Great work! You can always come back to review."
                : "Mark it as complete to track your progress."}
            </p>
          </div>
          <MarkCompleteButton
            sectionId={section.id}
            isCompleted={isCompleted}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-16">
        {prevSection ? (
          <Link
            href={`/course/${prevSection.slug}`}
            className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-primary transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            {prevSection.title}
          </Link>
        ) : (
          <div />
        )}
        {nextSection && new Date(nextSection.unlockDate) <= now ? (
          <Link
            href={`/course/${nextSection.slug}`}
            className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-primary transition-colors"
          >
            {nextSection.title}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Q&A Section */}
      <div className="border-t border-brand-border pt-12">
        <h2 className="text-xl font-light text-brand-primary mb-8">
          Questions & Feedback
        </h2>

        {/* Existing questions */}
        {section.questions.length > 0 && (
          <div className="space-y-6 mb-8">
            {section.questions.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-brand-border p-6"
              >
                <div className="mb-3">
                  <p className="text-sm text-brand-muted">
                    You asked on{" "}
                    {new Date(q.createdAt).toLocaleDateString("en-IE", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="text-brand-primary mt-2">{q.message}</p>
                </div>
                {q.response ? (
                  <div className="mt-4 pt-4 border-t border-brand-border">
                    <p className="text-sm text-brand-sage font-medium mb-1">
                      balance team
                    </p>
                    <p className="text-brand-primary/80">{q.response}</p>
                    <p className="text-xs text-brand-muted mt-2">
                      Responded{" "}
                      {q.respondedAt
                        ? new Date(q.respondedAt).toLocaleDateString("en-IE", {
                            day: "numeric",
                            month: "long",
                          })
                        : ""}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-brand-muted italic mt-2">
                    Awaiting response...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Ask a question */}
        <QuestionForm sectionId={section.id} />
      </div>
    </div>
  );
}
