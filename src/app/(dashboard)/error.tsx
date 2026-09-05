"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Error boundary for the student area (dashboard, units). Renders inside
 * the dashboard layout so the nav bar stays, and offers a route back to
 * the dashboard rather than the public home page.
 *
 * Next 16 passes `unstable_retry` (not `reset`) to re-render the segment.
 */
export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard error boundary]", error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="text-xs tracking-[0.2em] uppercase text-brand-sage mb-4">
        Something went wrong
      </p>
      <h1 className="text-2xl font-light text-brand-primary mb-3">
        This unit couldn&apos;t load.
      </h1>
      <p className="text-sm text-brand-muted mb-8">
        Usually a temporary blip. Try again — if it keeps happening, let
        balance Education know which unit you were opening.
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
          href="/dashboard"
          className="px-6 py-2.5 text-sm text-brand-primary border border-brand-border rounded-full hover:bg-white transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
      {error.digest && (
        <p className="mt-8 text-[10px] text-brand-muted/70 tabular-nums">
          Ref {error.digest}
        </p>
      )}
    </div>
  );
}
