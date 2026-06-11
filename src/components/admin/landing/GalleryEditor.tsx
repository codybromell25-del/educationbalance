"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GALLERY_TEMPLATES, type GalleryContent } from "@/lib/landing/config";

export default function GalleryEditor({
  initialTemplate,
  initialContent,
}: {
  initialTemplate: string;
  initialContent: GalleryContent;
}) {
  const router = useRouter();
  const [template, setTemplate] = useState(initialTemplate);
  const [intro, setIntro] = useState(initialContent.intro);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/landing-sections/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          content: { ...initialContent, intro },
        }),
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
          {GALLERY_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Intro paragraph (under the section heading)
        </label>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          disabled={busy}
          rows={3}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
        />
      </div>

      <p className="text-xs text-brand-muted">
        Six photo slots are shown below — upload to swap, reset to use the
        default studio shots. Slot 1 becomes the large feature tile in the
        mosaic template.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="px-5 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save template + intro"}
        </button>
        {saved && <span className="text-sm text-brand-success">✓ Saved</span>}
      </div>
    </div>
  );
}
