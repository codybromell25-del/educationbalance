"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Admin "Add a new cohort" form. Collapses to a single button; expands
 * to a full-width form on click. Slug auto-generates from the name but
 * stays editable so Catherine can shorten it (e.g. "cohort-2" rather
 * than "cohort-2-february-2027").
 */
export default function CreateCohortForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(v: string) {
    setName(v);
    if (!slugTouched) {
      // Auto-generate a URL-safe slug from the name until the user
      // manually edits it.
      const auto = v
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(auto);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cohorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          startDate,
          endDate: endDate || null,
          description: description || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Create failed");
      }
      setName("");
      setSlug("");
      setSlugTouched(false);
      setStartDate("");
      setEndDate("");
      setDescription("");
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
        onClick={() => setOpen(true)}
        className="px-6 py-2.5 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors"
      >
        + New cohort
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-brand-border p-6">
      <h3 className="font-medium text-brand-primary mb-4">Create a new cohort</h3>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs text-brand-muted mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="e.g. Cohort 2 · February 2027"
            className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-background text-sm"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-brand-muted mb-1">
            Slug{" "}
            <span className="text-brand-muted/70">
              (URL-safe, no spaces)
            </span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            required
            pattern="[a-z0-9\-]+"
            placeholder="cohort-2"
            className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-background text-sm"
          />
        </div>
        <div className="min-w-[160px]">
          <label className="block text-xs text-brand-muted mb-1">
            Start date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-background text-sm"
          />
        </div>
        <div className="min-w-[160px]">
          <label className="block text-xs text-brand-muted mb-1">
            End date{" "}
            <span className="text-brand-muted/70">(optional)</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-background text-sm"
          />
        </div>
        <div className="flex-1 min-w-[260px] basis-full">
          <label className="block text-xs text-brand-muted mb-1">
            Description{" "}
            <span className="text-brand-muted/70">(optional)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Anything worth noting internally about this cohort"
            className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-background text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="px-6 py-2.5 bg-brand-primary text-white text-sm rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
          >
            {busy ? "Creating…" : "Create cohort"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setError("");
            }}
            className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </div>
  );
}
