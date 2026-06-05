"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      setDone(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <Image
              src="/images/balance-logo.jpg"
              alt="balance"
              width={56}
              height={56}
              className="rounded-full mx-auto mb-4"
            />
            <span className="text-3xl tracking-wide font-light text-brand-primary">
              balance
            </span>
          </Link>
          <p className="text-brand-muted mt-3 text-sm tracking-wide">
            Reset your password
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-brand-border p-8">
          {done ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-brand-sage/10 flex items-center justify-center mx-auto">
                <svg
                  className="w-7 h-7 text-brand-sage"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <p className="text-brand-primary font-medium">Check your email</p>
              <p className="text-sm text-brand-muted">
                If an account exists for <strong>{email}</strong>, we&rsquo;ve
                sent a password-reset link. It expires in an hour.
              </p>
              <Link
                href="/login"
                className="inline-block mt-2 text-sm text-brand-sage hover:text-brand-sage-dark"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-brand-muted">
                Enter the email on your account and we&rsquo;ll send you a link
                to set a new password.
              </p>

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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-brand-muted mt-8">
          Remembered it?{" "}
          <Link
            href="/login"
            className="text-brand-sage hover:text-brand-sage-dark transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
