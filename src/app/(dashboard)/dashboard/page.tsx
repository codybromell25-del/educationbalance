import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sections = await prisma.section.findMany({
    orderBy: { order: "asc" },
    include: {
      progress: {
        where: { userId: session.user.id },
      },
    },
  });

  const completedCount = sections.filter(
    (s) => s.progress[0]?.completed
  ).length;
  const totalSections = sections.length;
  const progressPercent =
    totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;
  const now = new Date();
  const firstName = session.user.name.split(" ")[0];

  return (
    <div>
      {/* Welcome hero banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <Image
          src="/images/studio-reformers-row.jpg"
          alt="balance studio"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-brand-primary/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-6 w-full">
            <p className="text-brand-accent-light text-sm tracking-[0.3em] uppercase mb-3">
              Welcome back
            </p>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white">
              Welcome to balance,{" "}
              <span className="italic">{firstName}</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Progress overview */}
      <div className="bg-white rounded-2xl border border-brand-border p-8 mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm tracking-wider uppercase text-brand-muted">
            Your Progress
          </h2>
          <span className="text-sm text-brand-muted">
            {completedCount} of {totalSections} complete
          </span>
        </div>
        <div className="w-full h-2 bg-brand-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-accent rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-right text-xs text-brand-muted mt-2">
          {progressPercent}%
        </p>
      </div>

      {/* Sections list */}
      <div>
        <h2 className="text-sm tracking-wider uppercase text-brand-muted mb-6">
          Course Sections
        </h2>
        <div className="space-y-4">
          {sections.map((section) => {
            const isUnlocked = new Date(section.unlockDate) <= now;
            const isCompleted = section.progress[0]?.completed;

            return (
              <div
                key={section.id}
                className={`rounded-xl border p-6 transition-all ${
                  isUnlocked
                    ? "bg-white border-brand-border hover:border-brand-accent/50 hover:shadow-sm"
                    : "bg-brand-surface/50 border-brand-border/50 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Status icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? "bg-brand-success/10 text-brand-success"
                          : isUnlocked
                          ? "bg-brand-accent/10 text-brand-accent"
                          : "bg-brand-surface text-brand-muted"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : isUnlocked ? (
                        <span className="text-sm font-medium">
                          {section.order}
                        </span>
                      ) : (
                        <svg
                          className="w-5 h-5"
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
                      )}
                    </div>

                    <div>
                      <h3 className="font-medium text-brand-primary">
                        {section.title}
                      </h3>
                      <p className="text-sm text-brand-muted mt-1">
                        {isUnlocked
                          ? section.description
                          : `Unlocks ${new Date(
                              section.unlockDate
                            ).toLocaleDateString("en-IE", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}`}
                      </p>
                    </div>
                  </div>

                  {isUnlocked && (
                    <Link
                      href={`/course/${section.slug}`}
                      className="px-5 py-2 text-sm tracking-wider uppercase rounded-full border border-brand-border hover:border-brand-accent hover:text-brand-accent transition-colors shrink-0"
                    >
                      {isCompleted ? "Review" : "Start"}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {sections.length === 0 && (
            <div className="text-center py-16 text-brand-muted">
              <p>No course sections available yet.</p>
              <p className="text-sm mt-2">
                Check back soon — your content is being prepared.
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
