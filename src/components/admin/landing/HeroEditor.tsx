"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HERO_TEMPLATES, type HeroContent } from "@/lib/landing/config";

export default function HeroEditor({
  initialTemplate,
  initialContent,
}: {
  initialTemplate: string;
  initialContent: HeroContent;
}) {
  const router = useRouter();
  const [template, setTemplate] = useState(initialTemplate);
  const [content, setContent] = useState<HeroContent>(initialContent);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function updateLine(i: number, value: string) {
    setContent((c) => {
      const lines = [...c.headlineLines];
      lines[i] = value;
      return { ...c, headlineLines: lines };
    });
  }

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/landing-sections/hero", {
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
          {HERO_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <Field
        label="Tagline (small uppercase text at the top)"
        value={content.tagline}
        onChange={(v) => setContent({ ...content, tagline: v })}
        disabled={busy}
      />

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Headline — 4 lines (last line is italicised)
        </label>
        <div className="grid sm:grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              type="text"
              value={content.headlineLines[i] ?? ""}
              onChange={(e) => updateLine(i, e.target.value)}
              disabled={busy}
              placeholder={`Line ${i + 1}`}
              className="px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            />
          ))}
        </div>
      </div>

      <Field
        label="Description / hook paragraph"
        value={content.description}
        onChange={(v) => setContent({ ...content, description: v })}
        disabled={busy}
        multiline
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Primary button label"
          value={content.ctaPrimaryLabel}
          onChange={(v) => setContent({ ...content, ctaPrimaryLabel: v })}
          disabled={busy}
        />
        <Field
          label="Secondary button label"
          value={content.ctaSecondaryLabel}
          onChange={(v) => setContent({ ...content, ctaSecondaryLabel: v })}
          disabled={busy}
        />
      </div>

      <Field
        label="Cohort dates strap (small text under buttons)"
        value={content.cohortDates}
        onChange={(v) => setContent({ ...content, cohortDates: v })}
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
        {saved && (
          <span className="text-sm text-brand-success">✓ Saved</span>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={3}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
        />
      )}
    </div>
  );
}
