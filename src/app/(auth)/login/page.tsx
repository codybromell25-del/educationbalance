"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Image panel */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/studio-lunge.jpg"
          alt="Pilates reformer workout"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-brand-primary/30" />
        <div className="absolute bottom-12 left-12 right-12">
          <Image
            src="/images/balance-logo.jpg"
            alt="balance"
            width={48}
            height={48}
            className="rounded-full mb-4 shadow-lg"
          />
          <p className="text-white/90 text-lg font-light leading-relaxed">
            Your journey to mastering Pilates starts here.
          </p>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center bg-brand-surface px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link href="/" className="inline-block">
              <Image
                src="/images/balance-logo.jpg"
                alt="balance"
                width={56}
                height={56}
                className="rounded-full mx-auto mb-4 lg:hidden"
              />
              <span className="text-3xl tracking-wide font-light text-brand-primary">
                balance
              </span>
            </Link>
            <p className="text-brand-muted mt-3 text-sm tracking-wide">
              Sign in to access your course
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-brand-border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-brand-error/10 text-brand-error text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-brand-primary mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-background text-brand-primary placeholder:text-brand-muted/50 focus:border-brand-sage transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-brand-primary mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-background text-brand-primary placeholder:text-brand-muted/50 focus:border-brand-sage transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-brand-muted mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-brand-sage hover:text-brand-sage-dark transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
