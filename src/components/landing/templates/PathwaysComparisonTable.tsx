import type { PathwaysContent } from "@/lib/landing/config";

export default function PathwaysComparisonTable({
  content,
}: {
  content: PathwaysContent;
}) {
  return (
    <section id="pathways" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-4">
            Three pathways
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-brand-primary leading-tight">
            Side-by-side comparison
          </h2>
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
                    <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-1">
                      Pathway {p.code}
                    </p>
                    <p className="text-lg font-medium text-brand-primary">
                      {p.title}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              <ComparisonRow
                label="Summary"
                values={content.pathways.map((p) => p.summary)}
              />
              <ComparisonRow
                label="Format"
                values={content.pathways.map((p) => p.duration)}
              />
              <ComparisonRow
                label="Best for"
                values={content.pathways.map((p) => p.bestFor)}
              />
              <ComparisonRow
                label="Price"
                values={content.pathways.map((p) => p.price)}
                strong
              />
              <tr>
                <td className="px-5 md:px-7 py-5"></td>
                {content.pathways.map((p) => (
                  <td key={p.code} className="px-5 md:px-7 py-5 align-top">
                    <a
                      href="#apply"
                      className="inline-block text-xs tracking-wider uppercase text-brand-sage hover:text-brand-sage-dark"
                    >
                      Apply for Pathway {p.code} →
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ComparisonRow({
  label,
  values,
  strong,
}: {
  label: string;
  values: string[];
  strong?: boolean;
}) {
  return (
    <tr>
      <th
        scope="row"
        className="text-left px-5 md:px-7 py-5 align-top text-xs tracking-wider uppercase text-brand-muted whitespace-nowrap"
      >
        {label}
      </th>
      {values.map((v, i) => (
        <td
          key={i}
          className={`px-5 md:px-7 py-5 align-top ${strong ? "text-brand-primary font-medium text-base md:text-lg" : "text-brand-primary/85"}`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}
