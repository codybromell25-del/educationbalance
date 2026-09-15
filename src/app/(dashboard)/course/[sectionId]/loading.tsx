/**
 * Instant skeleton for a unit page. Appears the moment a student taps a
 * unit card, while the server loads the parts, quiz and progress. Shapes
 * match the real page (back link, unit header, part cards) so the real
 * content slots in without a jump.
 */
export default function SectionLoading() {
  return (
    <div
      className="max-w-6xl mx-auto px-5 md:px-6 py-10 md:py-14"
      aria-busy="true"
      aria-label="Loading unit"
    >
      {/* Back link + header */}
      <div className="animate-pulse mb-10">
        <div className="h-3 w-28 bg-brand-surface rounded mb-8" />
        <div className="h-3 w-20 bg-brand-surface rounded mb-4" />
        <div className="h-9 w-3/4 max-w-xl bg-brand-surface rounded mb-4" />
        <div className="h-4 w-1/2 max-w-md bg-brand-surface rounded" />
      </div>

      {/* Part cards */}
      <div className="space-y-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-brand-border p-8 md:p-10 animate-pulse"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <div className="h-3 w-24 bg-brand-surface rounded mb-3" />
                <div className="h-7 w-2/3 max-w-md bg-brand-surface rounded" />
              </div>
              <div className="h-6 w-16 rounded-full bg-brand-surface shrink-0" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-brand-surface rounded" />
              <div className="h-4 w-11/12 bg-brand-surface rounded" />
              <div className="h-4 w-4/5 bg-brand-surface rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
