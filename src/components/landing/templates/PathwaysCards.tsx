import type { PathwaysContent } from "@/lib/landing/config";

export default function PathwaysCards({
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
            Pick the route that fits where you&rsquo;re going
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {content.pathways.map((p) => (
            <div
              key={p.code}
              className="rounded-2xl border border-brand-border bg-white p-7 flex flex-col"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-3">
                Pathway {p.code}
              </p>
              <h3 className="text-xl font-medium text-brand-primary mb-3">{p.title}</h3>
              <p className="text-sm text-brand-primary/80 mb-4">{p.summary}</p>
              <p className="text-xs text-brand-muted mb-1">Format</p>
              <p className="text-sm text-brand-primary/90 mb-4">{p.duration}</p>
              <p className="text-xs text-brand-muted mb-1">Best for</p>
              <p className="text-sm text-brand-primary/90 mb-6">{p.bestFor}</p>
              <div className="mt-auto pt-4 border-t border-brand-border flex items-center justify-between">
                <p className="text-lg font-light text-brand-primary">{p.price}</p>
                <a
                  href="#apply"
                  className="text-xs tracking-wider uppercase text-brand-sage hover:text-brand-sage-dark"
                >
                  Apply →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
