"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CohortShape = {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  isArchived: boolean;
  description: string | null;
};

/**
 * Inline edit for one cohort row. Rename, adjust dates, toggle active,
 * archive. Slug is not editable after creation (keeps bookmarked filter
 * URLs stable). No delete button — archiving is the non-destructive way
 * to retire a cohort while keeping historical student links intact.
 */
export default function CohortRowActions({ cohort }: { cohort: CohortShape }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(cohort.name);
  const [startDate, setStartDate] = useState(cohort.startDate.slice(0, 10));
  const [endDate, setEndDate] = useState(cohort.endDate?.slice(0, 10) ?? "");
  const [description, setDescription] = useState(cohort.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/cohorts/${cohort.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          startDate,
          endDate: endDate || null,
          description: description || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function togglePatch(field: "isActive" | "isArchived", value: boolean) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/cohorts/${cohort.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Update failed");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="flex flex-wrap items-end gap-2">
        <div>
          <label className="block text-[10px] text-brand-muted uppercase tracking-wider mb-0.5">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
            required
            className="px-3 py-1.5 text-sm border border-brand-border rounded-lg w-56"
          />
        </div>
        <div>
          <label className="block text-[10px] text-brand-muted uppercase tracking-wider mb-0.5">
            Start
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={busy}
            required
            className="px-3 py-1.5 text-sm border border-brand-border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-[10px] text-brand-muted uppercase tracking-wider mb-0.5">
            End
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={busy}
            className="px-3 py-1.5 text-sm border border-brand-border rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] text-brand-muted uppercase tracking-wider mb-0.5">
            Description
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={busy}
            className="w-full px-3 py-1.5 text-sm border border-brand-border rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="px-3 py-1.5 text-xs bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark disabled:opacity-50"
        >
          {busy ? "…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setName(cohort.name);
            setStartDate(cohort.startDate.slice(0, 10));
            setEndDate(cohort.endDate?.slice(0, 10) ?? "");
            setDescription(cohort.description ?? "");
            setError(null);
          }}
          disabled={busy}
          className="px-3 py-1.5 text-xs text-brand-muted hover:text-brand-primary"
        >
          Cancel
        </button>
        {error && (
          <p className="text-xs text-red-600 basis-full">{error}</p>
        )}
      </form>
    );
  }

  return (
    <div className="flex items-center gap-1 flex-wrap justify-end">
      <button
        type="button"
        onClick={() => setEditing(true)}
        disabled={busy}
        className="px-3 py-1.5 text-xs text-brand-primary border border-brand-border rounded-full hover:bg-brand-surface"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => togglePatch("isActive", !cohort.isActive)}
        disabled={busy}
        className="px-3 py-1.5 text-xs text-brand-sage border border-brand-sage/30 rounded-full hover:bg-brand-sage/5 disabled:opacity-50"
      >
        {cohort.isActive ? "Mark inactive" : "Mark active"}
      </button>
      <button
        type="button"
        onClick={() => togglePatch("isArchived", !cohort.isArchived)}
        disabled={busy}
        className="px-3 py-1.5 text-xs text-brand-muted border border-brand-border rounded-full hover:bg-brand-surface disabled:opacity-50"
      >
        {cohort.isArchived ? "Unarchive" : "Archive"}
      </button>
    </div>
  );
}
