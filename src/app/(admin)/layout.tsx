import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SessionProvider from "@/components/SessionProvider";
import LogoutButton from "@/components/LogoutButton";
import { prisma } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const [unansweredQuestions, pendingSubmissions] = await Promise.all([
    prisma.question.count({ where: { response: null } }),
    prisma.submission.count({ where: { reviewed: false } }),
  ]);

  return (
    <SessionProvider>
      <div className="min-h-screen flex bg-background">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-brand-border flex flex-col shrink-0">
          <div className="p-6 border-b border-brand-border">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/images/balance-logo.jpg"
                alt="balance"
                width={28}
                height={28}
                className="rounded-full"
              />
              <div>
                <span className="text-xl tracking-wide font-light text-brand-primary">
                  balance
                </span>
                <p className="text-xs text-brand-sage tracking-wider uppercase">
                  Admin
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-brand-primary hover:bg-brand-surface transition-colors"
            >
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
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-brand-primary hover:bg-brand-surface transition-colors"
            >
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
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
              Users
            </Link>
            <Link
              href="/admin/questions"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-brand-primary hover:bg-brand-surface transition-colors"
            >
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
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              <span className="flex-1">Questions</span>
              {unansweredQuestions > 0 && (
                <span className="bg-brand-sage text-white text-xs font-semibold rounded-full min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center">
                  {unansweredQuestions}
                </span>
              )}
            </Link>
            <Link
              href="/admin/submissions"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-brand-primary hover:bg-brand-surface transition-colors"
            >
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
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
              <span className="flex-1">Submissions</span>
              {pendingSubmissions > 0 && (
                <span className="bg-brand-sage text-white text-xs font-semibold rounded-full min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center">
                  {pendingSubmissions}
                </span>
              )}
            </Link>
          </nav>

          <div className="p-4 border-t border-brand-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-muted truncate">
                {session.user.name}
              </span>
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
