import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SessionProvider from "@/components/SessionProvider";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Top nav */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2"
            >
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
            </Link>
            <div className="flex items-center gap-6">
              <span className="text-sm text-brand-muted hidden sm:block">
                {session.user.name}
              </span>
              <LogoutButton />
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1">{children}</main>
      </div>
    </SessionProvider>
  );
}
