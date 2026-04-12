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

  // Find next unlocked incomplete section
  const nextSection = sections.find(
    (s) => new Date(s.unlockDate) <= now && !s.progress[0]?.completed
  );

  return (
    <div>
      {/* Welcome hero banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="/images/studio-reformers-row.jpg"
          alt="balance studio"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 to-brand-primary/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-6 w-full">
            <p className="text-brand-sage-light text-sm tracking-[0.3em] uppercase mb-3">
              Welcome back
            </p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
              Welcome to balance,{" "}
              <span className="italic">{firstName}</span>
            </h1>
            <p className="text-white/60 text-lg max-w-lg">
              Continue your Pilates training journey. Pick up where you left off.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm text-center">
            <p className="text-3xl font-light text-brand-primary">{progressPercent}%</p>
            <p className="text-xs text-brand-muted tracking-wider uppercase mt-1">Complete</p>
          </div>
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm text-center">
            <p className="text-3xl font-light text-brand-primary">{completedCount}</p>
            <p className="text-xs text-brand-muted tracking-wider uppercase mt-1">Sections Done</p>
          </div>
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm text-center">
            <p className="text-3xl font-light text-brand-primary">{totalSections - completedCount}</p>
            <p className="text-xs text-brand-muted tracking-wider uppercase mt-1">Remaining</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 mb-10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm tracking-wider uppercase text-brand-muted">
              Your Progress
            </h2>
            <span className="text-sm text-brand-muted">
              {completedCount} of {totalSections}
            </span>
          </div>
          <div className="w-full h-3 bg-brand-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-sage to-brand-sage-dark rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Continue where you left off */}
        {nextSection && (
          <div className="mb-10">
            <h2 className="text-sm tracking-wider uppercase text-brand-muted mb-4">
              Continue Where You Left Off
            </h2>
            <Link
              href={`/course/${nextSection.slug}`}
              className="block group"
            >
              <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-40">
                  <Image
                    src="/images/studio-instructor.jpg"
                    alt="Continue learning"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/70 to-transparent" />
                  <div className="absolute inset-0 flex items-center px-8">
                    <div>
                      <p className="text-brand-sage-light text-xs tracking-[0.2em] uppercase mb-2">
                        Section {nextSection.order}
                      </p>
                      <h3 className="text-2xl font-light text-white mb-2">
                        {nextSection.title}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {nextSection.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-brand-sage flex items-center justify-center group-hover:bg-brand-sage-dark transition-colors shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Sections list */}
        <div className="pb-12">
          <h2 className="text-sm tracking-wider uppercase text-brand-muted mb-6">
            All Sections
          </h2>
          <div className="space-y-3">
            {sections.map((section, index) => {
              const isUnlocked = new Date(section.unlockDate) <= now;
              const isCompleted = section.progress[0]?.completed;

              return (
                <div
                  key={section.id}
                  className={`rounded-2xl border p-5 transition-all ${
                    isUnlocked
                      ? "bg-white border-brand-border hover:border-brand-sage/50 hover:shadow-sm"
                      : "bg-brand-surface/50 border-brand-border/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Status indicator */}
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? "bg-brand-sage text-white"
                            : isUnlocked
                            ? "bg-brand-sage/10 text-brand-sage border-2 border-brand-sage/30"
                            : "bg-brand-surface text-brand-muted"
                        }`}
                      >
                        {isCompleted ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
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
                        <h3 className={`font-medium ${isUnlocked ? "text-brand-primary" : "text-brand-muted"}`}>
                          {section.title}
                        </h3>
                        <p className="text-sm text-brand-muted mt-0.5">
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
                        className={`px-5 py-2 text-sm tracking-wider uppercase rounded-full border transition-colors shrink-0 ${
                          isCompleted
                            ? "border-brand-sage/30 text-brand-sage hover:bg-brand-sage/5"
                            : "border-brand-sage bg-brand-sage text-white hover:bg-brand-sage-dark"
                        }`}
                      >
                        {isCompleted ? "Review" : "Start"}
                      </Link>
                    )}
                  </div>

                  {/* Connection line between sections */}
                  {index < sections.length - 1 && (
                    <div className="flex justify-start ml-[21px] -mb-3 mt-1">
                      <div className={`w-0.5 h-4 ${isCompleted ? "bg-brand-sage/30" : "bg-brand-border"}`} />
                    </div>
                  )}
                </div>
              );
            })}

            {sections.length === 0 && (
              <div className="text-center py-16 text-brand-muted bg-white rounded-2xl border border-brand-border">
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
