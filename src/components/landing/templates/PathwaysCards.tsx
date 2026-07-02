import type { PathwaysContent } from "@/lib/landing/config";

export default function PathwaysCards({
  content,
}: {
  content: PathwaysContent;
}) {
  return (
    <section id="pathways" className="py-20 md:py-28 px-5 md:px-8 bg-brand-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-14">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-brand-muted mb-4">
            {content.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-light text-brand-primary leading-tight max-w-3xl mx-auto">
            {content.title}
          </h2>
          {content.description && (
            <p className="mt-5 text-brand-primary/75 max-w-2xl mx-auto leading-relaxed">
              {content.description}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {content.pathways.map((p) => (
            <PricingCard
              key={p.code}
              pathway={p}
              bookingDeadline={content.bookingDeadline}
            />
          ))}
        </div>

        {content.footnote && (
          <p className="mt-14 text-center text-sm text-brand-muted/80 max-w-3xl mx-auto leading-relaxed">
            {content.footnote}
          </p>
        )}
      </div>
    </section>
  );
}

function PricingCard({
  pathway: p,
  bookingDeadline,
}: {
  pathway: PathwaysContent["pathways"][number];
  bookingDeadline?: string;
}) {
  return (
    <div
      className={`relative flex flex-col bg-white rounded-2xl p-7 md:p-8 ${
        p.popular
          ? "border-2 border-brand-sage shadow-lg md:scale-[1.02]"
          : "border border-brand-border"
      }`}
    >
      {p.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-sage text-white text-[10px] tracking-[0.2em] uppercase rounded-full whitespace-nowrap">
          Most complete
        </span>
      )}

      <div>
        <h3 className="text-xl md:text-2xl font-medium text-brand-primary">
          {p.title}
        </h3>
        {p.subtitle && (
          <p className="text-sm text-brand-muted mt-1">{p.subtitle}</p>
        )}
      </div>

      {/* Pay-in-full price */}
      <div className="mt-6">
        <div className="flex items-baseline gap-3 flex-wrap">
          <p className="text-4xl md:text-5xl font-light text-brand-primary leading-none">
            {p.priceFull}
          </p>
          {p.priceOriginal && (
            <p className="text-lg text-brand-muted line-through">
              {p.priceOriginal}
            </p>
          )}
        </div>
        {p.saveLine && (
          <p className="mt-2 text-sm text-brand-accent">{p.saveLine}</p>
        )}
      </div>

      <hr className="my-6 border-brand-border" />

      {/* Deposit / installment plan */}
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">
          Or spread the cost
        </p>
        <p className="text-sm text-brand-primary">
          <span className="font-medium">{p.depositAmount}</span> deposit, then{" "}
          <span className="font-semibold">{p.installments}</span>
        </p>
        {p.totalSplit && (
          <p className="text-xs text-brand-muted mt-1">{p.totalSplit}</p>
        )}
      </div>

      {/* CTAs — pinned to the bottom so all cards align */}
      <div className="mt-auto pt-7 flex flex-col gap-2">
        {bookingDeadline && (
          <p className="text-center text-[11px] tracking-[0.18em] uppercase text-brand-accent mb-1">
            {bookingDeadline}
          </p>
        )}
        <a
          href={p.payInFullUrl || "#"}
          className={`inline-flex items-center justify-center px-5 py-3 text-xs tracking-[0.2em] uppercase rounded-full transition-colors ${
            p.popular
              ? "bg-brand-sage text-white hover:bg-brand-sage-dark"
              : "bg-brand-primary text-white hover:bg-brand-primary/90"
          }`}
        >
          Pay in full
        </a>
        <a
          href={p.payDepositUrl || "#"}
          className="inline-flex items-center justify-center px-5 py-3 text-xs tracking-[0.2em] uppercase rounded-full border border-brand-border text-brand-primary hover:bg-brand-surface transition-colors"
        >
          Pay deposit
        </a>
      </div>
    </div>
  );
}
