"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Root error boundary. Catches unexpected runtime errors anywhere under
 * the root layout (public site, auth pages, admin) and shows a friendly
 * page instead of Next's bare "Application error" screen.
 *
 * Next 16 passes `unstable_retry` (not `reset`) to re-render the segment.
 */
export default function RootError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[root error boundary]", error);
  }, [error]);

  return (
    <div className="font-app min-h-screen flex items-center justify-center px-6 bg-brand-surface">
      <div className="max-w-md text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-brand-sage mb-4">
          Something went wrong
        </p>
        <h1 className="text-2xl font-light text-brand-primary mb-3">
          This page hit a snag.
        </h1>
        <p className="text-sm text-brand-muted mb-8">
          It&apos;s been logged. Try again, or head back to the home page.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="px-6 py-2.5 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 text-sm text-brand-primary border border-brand-border rounded-full hover:bg-white transition-colors"
          >
            Home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-[10px] text-brand-muted/70 tabular-nums">
            Ref {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
