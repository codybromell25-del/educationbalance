import { prisma } from "@/lib/db";
import CreateUserForm from "@/components/admin/CreateUserForm";
import UserRowActions from "@/components/admin/UserRowActions";

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
    <div className="p-5 md:p-8">
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

      {/* Users table — desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-brand-border overflow-hidden mt-8">
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
              <th className="text-right px-6 py-3 text-xs font-medium text-brand-muted tracking-wider uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-brand-border last:border-0 hover:bg-brand-surface/30 transition-colors align-top"
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
                <td className="px-6 py-4 text-sm text-brand-muted whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleDateString("en-IE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <UserRowActions
                    user={{
                      id: user.id,
                      name: user.name,
                      email: user.email,
                    }}
                  />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-brand-muted"
                >
                  No users yet. Create the first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Users cards — mobile */}
      <div className="md:hidden mt-6 space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl border border-brand-border p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <p className="text-brand-primary font-medium">{user.name}</p>
                <p className="text-sm text-brand-muted truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-muted mb-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-12 h-1.5 bg-brand-surface rounded-full overflow-hidden inline-block">
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
              <span>·</span>
              <span>{user._count.questions} questions</span>
              <span>·</span>
              <span>
                joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-IE", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <UserRowActions
              user={{ id: user.id, name: user.name, email: user.email }}
            />
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-center py-12 text-brand-muted bg-white rounded-xl border border-brand-border">
            No users yet. Create the first one above.
          </p>
        )}
      </div>
    </div>
  );
}
