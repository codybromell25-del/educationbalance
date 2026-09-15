/**
 * Instant skeleton for the student dashboard. Shown the moment a student
 * navigates here, while the server fetches units + progress. Mirrors the
 * real layout (hero band, progress strip, unit cards) so the swap to real
 * content doesn't jump. Next also prefetches this boundary for links in
 * view, so taps feel immediate.
 */
export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Loading your course">
      {/* Hero band */}
      <div className="h-64 md:h-80 bg-brand-surface animate-pulse" />

      <div className="max-w-5xl mx-auto px-6 -mt-10 relative">
        {/* Progress card */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 mb-10 animate-pulse">
          <div className="h-3 w-24 bg-brand-surface rounded mb-4" />
          <div className="h-2 w-full bg-brand-surface rounded-full mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 bg-brand-surface rounded-lg" />
            ))}
          </div>
        </div>

        {/* Unit cards */}
        <div className="h-3 w-28 bg-brand-surface rounded mb-6 animate-pulse" />
        <div className="space-y-3 pb-12">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-brand-border bg-white p-5 flex items-center gap-4 animate-pulse"
            >
              <div className="w-11 h-11 rounded-full bg-brand-surface shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-2/3 max-w-xs bg-brand-surface rounded mb-2" />
                <div className="h-3 w-1/2 max-w-[12rem] bg-brand-surface rounded" />
              </div>
              <div className="h-9 w-20 rounded-full bg-brand-surface shrink-0 hidden sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
