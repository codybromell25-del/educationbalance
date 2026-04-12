"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Image panel */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/studio-ball-workout.jpg"
          alt="Group Pilates class"
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
            Join the balance course and transform your Pilates practice.
          </p>
        </div>
      </div>

      {/* Right — Sign up form */}
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
              Create your account to enrol in the course
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-brand-border p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-brand-error/10 text-brand-error text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-brand-primary mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-background text-brand-primary placeholder:text-brand-muted/50 focus:border-brand-sage transition-colors"
                  placeholder="Your full name"
                />
              </div>

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
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-background text-brand-primary placeholder:text-brand-muted/50 focus:border-brand-sage transition-colors"
                  placeholder="Min. 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-sage text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Pay & Enrol"}
              </button>

              <p className="text-xs text-brand-muted text-center">
                You&apos;ll be redirected to our secure payment page
              </p>
            </form>
          </div>

          <p className="text-center text-sm text-brand-muted mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-sage hover:text-brand-sage-dark transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
