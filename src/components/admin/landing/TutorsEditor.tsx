"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TUTORS_TEMPLATES, type TutorsContent } from "@/lib/landing/config";

export default function TutorsEditor({
  initialTemplate,
  initialContent,
}: {
  initialTemplate: string;
  initialContent: TutorsContent;
}) {
  const router = useRouter();
  const [template, setTemplate] = useState(initialTemplate);
  const [content, setContent] = useState<TutorsContent>(initialContent);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function updateTutor(
    i: number,
    patch: Partial<TutorsContent["tutors"][number]>,
  ) {
    setContent((c) => ({
      ...c,
      tutors: c.tutors.map((t, idx) => (idx === i ? { ...t, ...patch } : t)),
    }));
  }

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/landing-sections/tutors", {
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
          {TUTORS_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {content.tutors.map((t, i) => (
          <div
            key={i}
            className="rounded-xl border border-brand-border p-4 bg-brand-surface/30 space-y-3"
          >
            <p className="text-xs tracking-wider uppercase text-brand-muted">
              Tutor {i + 1} — image slot{" "}
              <span className="font-mono">{t.slotKey}</span>
            </p>
            <input
              type="text"
              value={t.name}
              onChange={(e) => updateTutor(i, { name: e.target.value })}
              disabled={busy}
              placeholder="Name"
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            />
            <input
              type="text"
              value={t.role}
              onChange={(e) => updateTutor(i, { role: e.target.value })}
              disabled={busy}
              placeholder="Role (e.g. 'Lead tutor')"
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            />
            <textarea
              value={t.bio}
              onChange={(e) => updateTutor(i, { bio: e.target.value })}
              disabled={busy}
              rows={5}
              placeholder="Bio"
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
