import type { PathwaysContent } from "@/lib/landing/config";

/**
 * Dark full-width promotional banner for the "hold my space for the
 * next cohort" holding-deposit offer. Content lives on the pathways
 * section (PathwaysContent.holdingDeposit) so the CMS can edit it
 * once and every render location picks up the change.
 *
 * The banner is spacing-agnostic — callers wrap it in their own
 * padding / max-width container so it can sit anywhere on the page.
 */
export default function HoldingDepositBanner({
  deposit,
}: {
  deposit: NonNullable<PathwaysContent["holdingDeposit"]>;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-primary text-white">
      {/* Subtle radial highlight so the dark card doesn't feel flat */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.08), transparent 55%)",
        }}
      />
      <div className="relative grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center px-7 py-9 md:px-12 md:py-12">
        <div>
          <p className="text-brand-sage-light text-[11px] md:text-xs tracking-[0.3em] uppercase mb-3">
            {deposit.eyebrow}
          </p>
          <h3 className="font-heading italic text-3xl md:text-4xl leading-tight mb-4">
            {deposit.title}
          </h3>
          <p className="text-white/75 leading-relaxed max-w-xl text-sm md:text-base">
            {deposit.body}
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
          <p className="text-white/60 text-[10px] tracking-[0.25em] uppercase">
            {deposit.amountLabel}
          </p>
          <p className="text-5xl md:text-6xl font-light leading-none">
            {deposit.amount}
          </p>
          <a
            href={deposit.ctaUrl}
            className="mt-5 inline-flex items-center justify-center px-8 py-3.5 bg-brand-sage text-white text-xs tracking-[0.25em] uppercase rounded-full hover:bg-brand-sage-dark transition-colors font-medium whitespace-nowrap"
          >
            {deposit.ctaLabel} →
          </a>
        </div>
      </div>
    </div>
  );
}
