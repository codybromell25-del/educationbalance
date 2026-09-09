"use client";

import { useState } from "react";

type Pathway = "MAT" | "REFORMER" | "COMPREHENSIVE";
const LABEL: Record<Pathway, string> = {
  MAT: "Mat",
  REFORMER: "Reformer",
  COMPREHENSIVE: "Comprehensive",
};

/**
 * Admin control: "Preview as student — Mat · Reformer · Comprehensive".
 * Sets the preview cookie for the chosen pathway, then opens `href` (a
 * unit or the dashboard) in a new tab rendered exactly as that student
 * sees it. The admin tab stays put.
 */
export default function PreviewAsStudent({
  href,
  label = "Preview as student",
}: {
  href: string;
  label?: string;
}) {
  const [busy, setBusy] = useState<Pathway | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function open(pathway: Pathway) {
    setBusy(pathway);
    setError(null);
    try {
      const res = await fetch("/api/admin/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathway }),
      });
      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).error ?? "Could not start preview");
      }
      window.open(href, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start preview");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-brand-muted">{label}:</span>
      {(["MAT", "REFORMER", "COMPREHENSIVE"] as Pathway[]).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => open(p)}
          disabled={busy !== null}
          className="px-3 py-1.5 text-xs text-brand-sage border border-brand-sage/30 rounded-full hover:bg-brand-sage/5 disabled:opacity-50"
          title={`Open in a new tab as a ${LABEL[p]} student`}
        >
          {busy === p ? "Opening…" : LABEL[p]}
        </button>
      ))}
      {error && <span className="text-xs text-red-600 basis-full">{error}</span>}
    </div>
  );
}
