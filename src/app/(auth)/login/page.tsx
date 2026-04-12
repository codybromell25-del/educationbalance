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
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/studio-wide.jpg"
          alt="balance studio"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Glass login card */}
      <div className="relative z-10 w-full max-w-md mx-6">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <Image
            src="/images/balance-logo.jpg"
            alt="balance"
            width={72}
            height={72}
            className="rounded-full mx-auto mb-5 shadow-2xl ring-2 ring-white/20"
          />
          <h1 className="text-3xl tracking-wide font-light text-white">
            balance
          </h1>
          <p className="text-white/50 mt-2 text-sm tracking-[0.2em] uppercase">
            Training Course
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-sm text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-white/70 mb-2 tracking-wider uppercase"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-white/30 focus:border-brand-sage focus:bg-white/10 focus:ring-1 focus:ring-brand-sage/50 transition-all outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-white/70 mb-2 tracking-wider uppercase"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-white/30 focus:border-brand-sage focus:bg-white/10 focus:ring-1 focus:ring-brand-sage/50 transition-all outline-none"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-sage text-white text-sm tracking-wider uppercase rounded-xl hover:bg-brand-sage-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-sage/20"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-center text-sm text-white/40">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-brand-sage-light hover:text-white transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-white/30 hover:text-white/60 transition-colors tracking-wider uppercase"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
