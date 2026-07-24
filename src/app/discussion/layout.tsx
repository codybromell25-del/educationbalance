import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SessionProvider from "@/components/SessionProvider";
import LogoutButton from "@/components/LogoutButton";

/**
 * Shared layout for the open discussion board — both USER and ADMIN
 * can view it. Sits outside (dashboard) and (admin) route groups so
 * neither of their role-based redirects fires.
 */
export default async function DiscussionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isAdmin = session.user.role === "ADMIN";
  const homeHref = isAdmin ? "/admin" : "/dashboard";
  const homeLabel = isAdmin ? "Admin" : "Course";

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href={homeHref} className="flex items-center gap-2">
              <Image
                src="/images/balance-logo.jpg"
                alt="balance"
                width={28}
                height={28}
                className="rounded-full"
              />
              <span className="text-xl tracking-wide font-light text-brand-primary">
                balance
              </span>
              {isAdmin && (
                <span className="text-xs text-brand-sage tracking-wider uppercase ml-1">
                  Admin
                </span>
              )}
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href={homeHref}
                className="text-sm text-brand-primary hover:text-brand-sage transition-colors hidden sm:block"
              >
                {homeLabel}
              </Link>
              <Link
                href="/discussion"
                className="text-sm text-brand-sage font-medium"
              >
                Discussion
              </Link>
              <span className="text-sm text-brand-muted hidden sm:block">
                {session.user.name}
              </span>
              <LogoutButton />
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </SessionProvider>
  );
}
