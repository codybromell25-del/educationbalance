"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Admin "Add a new unit" form. Catherine clicks the toggle, fills in the
 * required fields, and a new empty unit gets created at the bottom of
 * the list. She can then click into it and manage parts / pathway
 * rules / dates in the standard section editor.
 *
 * Slug is auto-generated from the title as she types unless she has
 * already typed something into the slug field herself.
 */
export default function CreateSectionForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [unlockDate, setUnlockDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function slugify(v: string) {
    return v
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  function updateTitle(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  function reset() {
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setDescription("");
    setUnlockDate(new Date().toISOString().slice(0, 10));
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          unlockDate: new Date(unlockDate).toISOString(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-sage text-white text-sm font-medium hover:bg-brand-sage-dark transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add a new unit
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white border border-brand-sage/40 rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-brand-primary">New unit</h2>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="text-sm text-brand-muted hover:text-brand-primary"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
            required
            disabled={busy}
            placeholder="e.g. Screening and Biomechanics"
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          />
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Slug (URL segment)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value.toLowerCase());
            }}
            required
            disabled={busy}
            pattern="[a-z0-9-]+"
            placeholder="screening-and-biomechanics"
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary font-mono text-sm focus:outline-none focus:border-brand-sage"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Description (short summary shown on the dashboard card)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={busy}
          rows={2}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
        />
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Default unlock date (fallback — set per-pathway dates later)
        </label>
        <input
          type="date"
          value={unlockDate}
          onChange={(e) => setUnlockDate(e.target.value)}
          required
          disabled={busy}
          className="px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
        />
      </div>

      {error && <p className="text-sm text-brand-error">{error}</p>}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2 text-sm bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create unit"}
        </button>
        <p className="text-xs text-brand-muted">
          Lands at the bottom of the list. You can reorder and set
          pathway rules once it's created.
        </p>
      </div>
    </form>
  );
}
