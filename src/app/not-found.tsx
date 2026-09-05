import Link from "next/link";

/**
 * Friendly 404 — a mistyped /course/<slug> or stale bookmark used to show
 * Next's bare default with no way back into the site.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-brand-surface">
      <div className="max-w-md text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-brand-sage mb-4">
          Not found
        </p>
        <h1 className="text-2xl font-light text-brand-primary mb-3">
          That page doesn&apos;t exist.
        </h1>
        <p className="text-sm text-brand-muted mb-8">
          The link may be out of date, or the unit may have been renamed.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors"
          >
            My dashboard
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 text-sm text-brand-primary border border-brand-border rounded-full hover:bg-white transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
