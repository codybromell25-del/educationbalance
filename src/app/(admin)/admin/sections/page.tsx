import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminSectionsPage() {
  const sections = await prisma.section.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { parts: true } },
    },
  });

  return (
    <div className="p-5 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          Course Sections
        </h1>
        <p className="text-brand-muted mt-2">
          Click into a section to manage its parts (videos, downloads, quizzes
          and submissions).
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const unlock = new Date(section.unlockDate);
          const unlockLabel = unlock.toLocaleDateString("en-IE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          return (
            <Link
              key={section.id}
              href={`/admin/sections/${section.id}`}
              className="block bg-white rounded-xl border border-brand-border p-5 hover:border-brand-sage transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-brand-sage/10 text-brand-sage border-2 border-brand-sage/30 flex items-center justify-center shrink-0 text-sm font-medium">
                    {section.order}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-medium text-brand-primary truncate">
                      {section.title}
                    </h2>
                    <p className="text-sm text-brand-muted truncate">
                      /{section.slug} · unlocks {unlockLabel}
                      {section.requiresPriorCompletion
                        ? " · requires prior completion"
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-brand-muted">
                    {section._count.parts}{" "}
                    {section._count.parts === 1 ? "part" : "parts"}
                  </span>
                  <svg
                    className="w-4 h-4 text-brand-muted"
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
                </div>
              </div>
            </Link>
          );
        })}

        {sections.length === 0 && (
          <div className="text-center py-16 text-brand-muted bg-white rounded-2xl border border-brand-border">
            <p>No sections yet. Run the seed scripts to create them.</p>
          </div>
        )}
      </div>
    </div>
  );
}
