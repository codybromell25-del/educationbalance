"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PATHWAYS_TEMPLATES, type PathwaysContent } from "@/lib/landing/config";

export default function PathwaysEditor({
  initialTemplate,
  initialContent,
}: {
  initialTemplate: string;
  initialContent: PathwaysContent;
}) {
  const router = useRouter();
  const [template, setTemplate] = useState(initialTemplate);
  const [content, setContent] = useState<PathwaysContent>(initialContent);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function updatePathway(
    i: number,
    patch: Partial<PathwaysContent["pathways"][number]>,
  ) {
    setContent((c) => ({
      ...c,
      pathways: c.pathways.map((p, idx) =>
        idx === i ? { ...p, ...patch } : p,
      ),
    }));
  }

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/landing-sections/pathways", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, content }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Template
        </label>
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          disabled={busy}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
        >
          {PATHWAYS_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Section header fields */}
      <div className="rounded-xl border border-brand-border p-4 bg-brand-surface/30 space-y-3">
        <p className="text-xs tracking-wider uppercase text-brand-sage">
          Section header
        </p>
        <Input
          label="Eyebrow (small uppercase line above the title)"
          value={content.eyebrow ?? ""}
          onChange={(v) => setContent({ ...content, eyebrow: v })}
          disabled={busy}
        />
        <Input
          label="Title"
          value={content.title ?? ""}
          onChange={(v) => setContent({ ...content, title: v })}
          disabled={busy}
        />
        <Textarea
          label="Description (paragraph below the title)"
          value={content.description ?? ""}
          onChange={(v) => setContent({ ...content, description: v })}
          rows={2}
          disabled={busy}
        />
      </div>

      {/* Per-pathway editors */}
      <div className="space-y-4">
        {content.pathways.map((p, i) => (
          <div
            key={i}
            className="rounded-xl border border-brand-border p-4 bg-brand-surface/30 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-wider uppercase text-brand-sage">
                Pathway {i + 1}
              </p>
              <label className="flex items-center gap-2 text-xs text-brand-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!p.popular}
                  onChange={(e) =>
                    updatePathway(i, { popular: e.target.checked })
                  }
                  disabled={busy}
                  className="w-4 h-4 accent-brand-sage"
                />
                Show &ldquo;Most complete&rdquo; badge
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Input
                label="Internal code (e.g. MAT)"
                value={p.code}
                onChange={(v) => updatePathway(i, { code: v })}
                disabled={busy}
              />
              <Input
                label="Title (e.g. Mat Certification)"
                value={p.title}
                onChange={(v) => updatePathway(i, { title: v })}
                disabled={busy}
              />
            </div>
            <Input
              label="Subtitle (e.g. Comprehensive Mat Pilates)"
              value={p.subtitle ?? ""}
              onChange={(v) => updatePathway(i, { subtitle: v })}
              disabled={busy}
            />

            <div className="grid sm:grid-cols-3 gap-3">
              <Input
                label="Original price (strikethrough)"
                value={p.priceOriginal ?? ""}
                onChange={(v) => updatePathway(i, { priceOriginal: v })}
                placeholder="€1,195"
                disabled={busy}
              />
              <Input
                label="Pay-in-full price"
                value={p.priceFull ?? ""}
                onChange={(v) => updatePathway(i, { priceFull: v })}
                placeholder="€1,095"
                disabled={busy}
              />
              <Input
                label="Save line"
                value={p.saveLine ?? ""}
                onChange={(v) => updatePathway(i, { saveLine: v })}
                placeholder="Save €100 when you pay in full"
                disabled={busy}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <Input
                label="Deposit amount"
                value={p.depositAmount ?? ""}
                onChange={(v) => updatePathway(i, { depositAmount: v })}
                placeholder="€500"
                disabled={busy}
              />
              <Input
                label="Installments"
                value={p.installments ?? ""}
                onChange={(v) => updatePathway(i, { installments: v })}
                placeholder="1 payment of €695"
                disabled={busy}
              />
              <Input
                label="Total split"
                value={p.totalSplit ?? ""}
                onChange={(v) => updatePathway(i, { totalSplit: v })}
                placeholder="€1,195 total over 2 payments"
                disabled={busy}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Input
                label="Pay-in-full URL"
                value={p.payInFullUrl ?? ""}
                onChange={(v) => updatePathway(i, { payInFullUrl: v })}
                placeholder="https://buy.stripe.com/…"
                disabled={busy}
              />
              <Input
                label="Pay-deposit URL"
                value={p.payDepositUrl ?? ""}
                onChange={(v) => updatePathway(i, { payDepositUrl: v })}
                placeholder="https://buy.stripe.com/…"
                disabled={busy}
              />
            </div>
          </div>
        ))}
      </div>

      <Textarea
        label="Footnote (small print under the cards)"
        value={content.footnote ?? ""}
        onChange={(v) => setContent({ ...content, footnote: v })}
        rows={3}
        disabled={busy}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="px-5 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-sm text-brand-success">✓ Saved</span>}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  disabled,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
      />
    </div>
  );
}
