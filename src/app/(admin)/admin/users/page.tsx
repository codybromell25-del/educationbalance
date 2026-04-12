import { prisma } from "@/lib/db";
import CreateUserForm from "@/components/admin/CreateUserForm";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    include: {
      progress: { where: { completed: true } },
      _count: { select: { questions: true } },
    },
  });

  const totalSections = await prisma.section.count();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-brand-primary">
            Users
          </h1>
          <p className="text-brand-muted mt-2">
            Manage course participants and create new accounts.
          </p>
        </div>
      </div>

      {/* Create user form */}
      <CreateUserForm />

      {/* Users table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface/50">
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Name
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Email
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Progress
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Questions
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-brand-border last:border-0 hover:bg-brand-surface/30 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-brand-primary font-medium">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-brand-muted">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-brand-muted">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-16 h-1.5 bg-brand-surface rounded-full overflow-hidden">
                      <span
                        className="block h-full bg-brand-sage rounded-full"
                        style={{
                          width: `${
                            totalSections > 0
                              ? (user.progress.length / totalSections) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </span>
                    {user.progress.length}/{totalSections}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-brand-muted">
                  {user._count.questions}
                </td>
                <td className="px-6 py-4 text-sm text-brand-muted">
                  {new Date(user.createdAt).toLocaleDateString("en-IE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-brand-muted"
                >
                  No users yet. Create the first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
