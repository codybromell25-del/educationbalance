import { ReactNode } from "react";

const TYPE_LABEL: Record<string, string> = {
  TEXT: "Read",
  VIDEO: "Watch",
  DOWNLOAD: "Download",
  QUIZ: "Quiz",
  SUBMIT: "Submit",
};

export default function PartShell({
  order,
  total,
  title,
  type,
  children,
  anchor,
}: {
  order: number;
  total: number;
  title: string;
  type: string;
  children: ReactNode;
  anchor: string;
}) {
  return (
    <section
      id={anchor}
      className="scroll-mt-24 bg-white rounded-2xl border border-brand-border p-8 md:p-10"
    >
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-brand-sage tracking-[0.3em] uppercase mb-2">
            Part {order} of {total}
          </p>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-brand-primary">
            {title}
          </h2>
        </div>
        <span className="shrink-0 text-xs tracking-wider uppercase text-brand-muted bg-brand-surface border border-brand-border rounded-full px-3 py-1">
          {TYPE_LABEL[type] ?? type}
        </span>
      </header>
      <div className="text-brand-primary/90 leading-relaxed">{children}</div>
    </section>
  );
}
