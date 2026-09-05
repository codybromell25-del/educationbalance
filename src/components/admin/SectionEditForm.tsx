"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type UnlockDates = {
  MAT?: string | null;
  REFORMER?: string | null;
  COMPREHENSIVE?: string | null;
};

type SectionData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  unlockDate: string; // ISO
  requiresPriorCompletion: boolean;
  visibleToMat: boolean;
  visibleToReformer: boolean;
  unlockDates: UnlockDates | null;
  prerequisiteId: string | null;
};

type OtherSection = { id: string; title: string; order: number };

/**
 * Convert an ISO date string (or null) to the value a
 * `<input type="date">` accepts (yyyy-MM-dd). Returns "" for null.
 */
function isoToDateInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function SectionEditForm({
  initial,
  otherSections,
}: {
  initial: SectionData;
  otherSections: OtherSection[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [description, setDescription] = useState(initial.description);
  const [content, setContent] = useState(initial.content);
  // Date-only (YYYY-MM-DD), stored as UTC midnight — same convention as
  // the per-pathway dates below. The old datetime-local input round-
  // tripped through local time and shifted the stored instant back one
  // hour on every save during Irish summer time.
  const [unlockDate, setUnlockDate] = useState(
    isoToDateInput(initial.unlockDate),
  );
  const [requiresPriorCompletion, setRequiresPriorCompletion] = useState(
    initial.requiresPriorCompletion,
  );

  // Pathway visibility (comp always visible — no field needed)
  const [visibleToMat, setVisibleToMat] = useState(initial.visibleToMat);
  const [visibleToReformer, setVisibleToReformer] = useState(
    initial.visibleToReformer,
  );

  // Per-pathway unlock dates (independent of the legacy single date above)
  const [matDate, setMatDate] = useState(
    isoToDateInput(initial.unlockDates?.MAT),
  );
  const [reformerDate, setReformerDate] = useState(
    isoToDateInput(initial.unlockDates?.REFORMER),
  );
  const [compDate, setCompDate] = useState(
    isoToDateInput(initial.unlockDates?.COMPREHENSIVE),
  );

  // Prerequisite pointer — "" means no explicit prerequisite
  const [prerequisiteId, setPrerequisiteId] = useState(
    initial.prerequisiteId ?? "",
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugChanged = slug !== initial.slug;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      slugChanged &&
      !confirm(
        "Changing the slug will break any existing bookmarks or links that use the old URL. Continue?",
      )
    ) {
      return;
    }

    setBusy(true);
    try {
      // Build unlockDates object — only include pathways with a value
      const unlockDates: UnlockDates = {};
      if (matDate) unlockDates.MAT = new Date(matDate).toISOString();
      if (reformerDate)
        unlockDates.REFORMER = new Date(reformerDate).toISOString();
      if (compDate)
        unlockDates.COMPREHENSIVE = new Date(compDate).toISOString();
      const unlockDatesPayload =
        Object.keys(unlockDates).length > 0 ? unlockDates : null;

      const res = await fetch(`/api/admin/sections/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          content,
          unlockDate: new Date(unlockDate).toISOString(),
          requiresPriorCompletion,
          visibleToMat,
          visibleToReformer,
          unlockDates: unlockDatesPayload,
          prerequisiteId: prerequisiteId || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-brand-sage hover:text-brand-sage-dark transition-colors"
      >
        Edit unit details
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-brand-border rounded-xl p-5 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-brand-primary">Edit unit</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={busy}
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          />
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Slug (URL)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            pattern="[a-z0-9-]+"
            disabled={busy}
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary font-mono text-sm focus:outline-none focus:border-brand-sage"
          />
          {slugChanged && (
            <p className="text-xs text-brand-accent mt-1">
              ⚠ Changing the slug breaks existing /course/{initial.slug} URLs.
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={busy}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
        />
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Unit overview content (HTML — shown when unit has no parts)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          disabled={busy}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary font-mono text-sm focus:outline-none focus:border-brand-sage"
        />
      </div>

      {/* ── Pathway visibility ── */}
      <fieldset className="rounded-lg border border-brand-sage/40 bg-brand-sage/[0.04] p-4">
        <legend className="px-1.5 text-xs tracking-wider uppercase text-brand-sage font-medium">
          Pathway visibility
        </legend>
        <p className="text-xs text-brand-muted mb-3">
          Comprehensive students always see every unit. Tick which of the
          other pathways can see this one. Unticking means the unit
          <em> never appears</em> on that pathway.
        </p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleToMat}
              onChange={(e) => setVisibleToMat(e.target.checked)}
              disabled={busy}
              className="w-4 h-4 accent-brand-sage"
            />
            <span className="text-sm text-brand-primary">
              Show to <strong>Mat</strong> students
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleToReformer}
              onChange={(e) => setVisibleToReformer(e.target.checked)}
              disabled={busy}
              className="w-4 h-4 accent-brand-sage"
            />
            <span className="text-sm text-brand-primary">
              Show to <strong>Reformer</strong> students
            </span>
          </label>
        </div>
      </fieldset>

      {/* ── Per-pathway unlock dates ── */}
      <fieldset className="rounded-lg border border-brand-sage/40 bg-brand-sage/[0.04] p-4">
        <legend className="px-1.5 text-xs tracking-wider uppercase text-brand-sage font-medium">
          Per-pathway unlock dates
        </legend>
        <p className="text-xs text-brand-muted mb-3">
          Set the date this unit opens for each pathway. Leave a field
          blank to fall back to the default unlock date below.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="block text-xs text-brand-muted mb-1">Mat</span>
            <input
              type="date"
              value={matDate}
              onChange={(e) => setMatDate(e.target.value)}
              disabled={busy || !visibleToMat}
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage disabled:opacity-40"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-brand-muted mb-1">Reformer</span>
            <input
              type="date"
              value={reformerDate}
              onChange={(e) => setReformerDate(e.target.value)}
              disabled={busy || !visibleToReformer}
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage disabled:opacity-40"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-brand-muted mb-1">
              Comprehensive
            </span>
            <input
              type="date"
              value={compDate}
              onChange={(e) => setCompDate(e.target.value)}
              disabled={busy}
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            />
          </label>
        </div>
      </fieldset>

      {/* ── Default unlock + prerequisite ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Default unlock date (fallback)
          </label>
          <input
            type="date"
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            required
            disabled={busy}
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          />
          <p className="text-xs text-brand-muted mt-1">
            Used when a pathway above has no date set. Unlocks at midnight
            on this date.
          </p>
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Prerequisite unit
          </label>
          <select
            value={prerequisiteId}
            onChange={(e) => setPrerequisiteId(e.target.value)}
            disabled={busy}
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          >
            <option value="">— None —</option>
            {otherSections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.order}. {s.title}
              </option>
            ))}
          </select>
          <p className="text-xs text-brand-muted mt-1">
            When set, this unit stays locked until the chosen one is
            completed — regardless of dates.
          </p>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={requiresPriorCompletion}
            onChange={(e) => setRequiresPriorCompletion(e.target.checked)}
            disabled={busy || !!prerequisiteId}
            className="w-4 h-4 accent-brand-sage"
          />
          <span className="text-sm text-brand-primary">
            Fallback: require the <em>previous</em> unit to be completed
            {prerequisiteId ? " (overridden by prerequisite above)" : ""}
          </span>
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={busy}
          className="px-5 py-2 text-sm text-brand-muted hover:text-brand-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
