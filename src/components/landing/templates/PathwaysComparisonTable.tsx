import type { PathwaysContent } from "@/lib/landing/config";

export default function PathwaysComparisonTable({
  content,
}: {
  content: PathwaysContent;
}) {
  return (
    <section id="pathways" className="py-20 md:py-28 px-5 md:px-8 bg-brand-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
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

        <div className="overflow-x-auto bg-white rounded-2xl border border-brand-border">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-brand-surface">
              <tr>
                <th className="text-left px-5 md:px-7 py-5 font-medium text-brand-muted text-xs tracking-wider uppercase">
                  &nbsp;
                </th>
                {content.pathways.map((p) => (
                  <th
                    key={p.code}
                    className="px-5 md:px-7 py-5 text-left align-bottom"
                  >
                    {p.popular && (
                      <span className="inline-block mb-2 px-2 py-0.5 bg-brand-sage text-white text-[10px] tracking-[0.2em] uppercase rounded-full">
                        Most complete
                      </span>
                    )}
                    <p className="text-lg font-medium text-brand-primary">
                      {p.title}
                    </p>
                    {p.subtitle && (
                      <p className="text-xs text-brand-muted mt-1">
                        {p.subtitle}
                      </p>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              <Row
                label="Pay in full"
                cells={content.pathways.map((p) => (
                  <div key={p.code}>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-light text-brand-primary">
                        {p.priceFull}
                      </span>
                      {p.priceOriginal && (
                        <span className="text-sm text-brand-muted line-through">
                          {p.priceOriginal}
                        </span>
                      )}
                    </div>
                    {p.saveLine && (
                      <p className="text-xs text-brand-accent mt-1">
                        {p.saveLine}
                      </p>
                    )}
                  </div>
                ))}
              />
              <Row
                label="Deposit + plan"
                cells={content.pathways.map((p) => (
                  <div key={p.code} className="text-brand-primary/85">
                    <p>
                      {p.depositAmount} deposit, then{" "}
                      <strong>{p.installments}</strong>
                    </p>
                    {p.totalSplit && (
                      <p className="text-xs text-brand-muted mt-1">
                        {p.totalSplit}
                      </p>
                    )}
                  </div>
                ))}
              />
              <tr>
                <td className="px-5 md:px-7 py-5"></td>
                {content.pathways.map((p) => (
                  <td key={p.code} className="px-5 md:px-7 py-5 align-top">
                    <div className="flex flex-col gap-2">
                      <a
                        href={p.payInFullUrl || "#"}
                        className={`inline-flex items-center justify-center px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase rounded-full ${
                          p.popular
                            ? "bg-brand-sage text-white hover:bg-brand-sage-dark"
                            : "bg-brand-primary text-white hover:bg-brand-primary/90"
                        }`}
                      >
                        Pay in full
                      </a>
                      <a
                        href={p.payDepositUrl || "#"}
                        className="inline-flex items-center justify-center px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase rounded-full border border-brand-border text-brand-primary hover:bg-brand-surface"
                      >
                        Pay deposit
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
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

function Row({
  label,
  cells,
}: {
  label: string;
  cells: React.ReactNode[];
}) {
  return (
    <tr>
      <th
        scope="row"
        className="text-left px-5 md:px-7 py-5 align-top text-xs tracking-wider uppercase text-brand-muted whitespace-nowrap"
      >
        {label}
      </th>
      {cells.map((c, i) => (
        <td key={i} className="px-5 md:px-7 py-5 align-top">
          {c}
        </td>
      ))}
    </tr>
  );
}
