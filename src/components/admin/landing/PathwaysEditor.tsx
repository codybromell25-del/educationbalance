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

      <div className="space-y-4">
        {content.pathways.map((p, i) => (
          <div
            key={i}
            className="rounded-xl border border-brand-border p-4 bg-brand-surface/30 space-y-3"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={p.code}
                onChange={(e) => updatePathway(i, { code: e.target.value })}
                disabled={busy}
                placeholder="A"
                className="w-16 px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary text-center focus:outline-none focus:border-brand-sage"
              />
              <input
                type="text"
                value={p.title}
                onChange={(e) => updatePathway(i, { title: e.target.value })}
                disabled={busy}
                placeholder="Pathway title"
                className="flex-1 px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
              />
            </div>
            <input
              type="text"
              value={p.summary}
              onChange={(e) => updatePathway(i, { summary: e.target.value })}
              disabled={busy}
              placeholder="Summary"
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            />
            <input
              type="text"
              value={p.duration}
              onChange={(e) => updatePathway(i, { duration: e.target.value })}
              disabled={busy}
              placeholder="Format / duration"
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            />
            <input
              type="text"
              value={p.price}
              onChange={(e) => updatePathway(i, { price: e.target.value })}
              disabled={busy}
              placeholder="Price (e.g. €2,495 or 'CONFIRM pricing')"
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            />
            <textarea
              value={p.bestFor}
              onChange={(e) => updatePathway(i, { bestFor: e.target.value })}
              disabled={busy}
              rows={2}
              placeholder="Best for…"
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            />
          </div>
        ))}
      </div>

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
