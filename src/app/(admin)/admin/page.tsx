import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [
    totalUsers,
    unansweredQuestions,
    sections,
    pendingSubmissions,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.question.count({ where: { response: null } }),
    prisma.section.count(),
    prisma.submission.count({ where: { reviewed: false } }),
  ]);

  const stats = [
    { label: "Total Users", value: totalUsers, href: "/admin/users" },
    { label: "Course Sections", value: sections, href: null },
    { label: "Unanswered Questions", value: unansweredQuestions, href: "/admin/questions" },
    { label: "Pending Submissions", value: pendingSubmissions, href: "/admin/submissions" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          Admin Dashboard
        </h1>
        <p className="text-brand-muted mt-2">
          Overview of your balance course platform.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {unansweredQuestions > 0 && (
          <Link
            href="/admin/questions"
            className="group block rounded-xl bg-brand-sage text-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-white text-brand-sage text-xs font-semibold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">
                    {unansweredQuestions}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {unansweredQuestions === 1
                      ? "1 new question waiting"
                      : `${unansweredQuestions} new questions waiting`}
                  </p>
                  <p className="text-sm text-white/80">
                    Click to view and respond
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </Link>
        )}

        {pendingSubmissions > 0 && (
          <Link
            href="/admin/submissions"
            className="group block rounded-xl bg-brand-primary text-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-white text-brand-primary text-xs font-semibold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">
                    {pendingSubmissions}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {pendingSubmissions === 1
                      ? "1 submission to review"
                      : `${pendingSubmissions} submissions to review`}
                  </p>
                  <p className="text-sm text-white/80">
                    Click to view reflective responses
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const card = (
            <div className="bg-white rounded-xl border border-brand-border p-6 h-full hover:border-brand-sage transition-colors">
              <p className="text-sm text-brand-muted tracking-wider uppercase">
                {stat.label}
              </p>
              <p className="text-3xl font-light text-brand-primary mt-2">
                {stat.value}
              </p>
            </div>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="block">
              {card}
            </Link>
          ) : (
            <div key={stat.label}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
