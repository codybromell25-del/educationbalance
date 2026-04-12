import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [totalUsers, totalQuestions, unansweredQuestions, sections] =
    await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.question.count(),
      prisma.question.count({ where: { response: null } }),
      prisma.section.count(),
    ]);

  const stats = [
    { label: "Total Users", value: totalUsers },
    { label: "Course Sections", value: sections },
    { label: "Total Questions", value: totalQuestions },
    { label: "Unanswered", value: unansweredQuestions },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-brand-border p-6"
          >
            <p className="text-sm text-brand-muted tracking-wider uppercase">
              {stat.label}
            </p>
            <p className="text-3xl font-light text-brand-primary mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
