"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Pathway = "MAT" | "REFORMER" | "COMPREHENSIVE";
const LABEL: Record<Pathway, string> = {
  MAT: "Mat",
  REFORMER: "Reformer",
  COMPREHENSIVE: "Comprehensive",
};
const ORDER: Pathway[] = ["MAT", "REFORMER", "COMPREHENSIVE"];

/**
 * Slim bar shown under the student nav while an admin is in preview
 * mode. Says which pathway is being previewed, lets them switch, and
 * exits back to admin. Rendered only by the dashboard layout, only for
 * ADMIN + preview cookie — students never see it.
 */
export default function PreviewBar({ pathway }: { pathway: Pathway }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function switchTo(next: Pathway) {
    if (next === pathway || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathway: next }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Switch failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Switch failed");
    } finally {
      setBusy(false);
    }
  }

  async function exit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/preview", { method: "DELETE" });
      if (!res.ok) throw new Error("Could not exit preview");
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not exit preview");
      setBusy(false);
    }
  }

  return (
    <div className="bg-brand-accent/15 border-b border-brand-accent/40 text-brand-primary">
      <div className="max-w-7xl mx-auto px-6 py-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        <span className="font-semibold tracking-[0.18em] uppercase text-brand-accent-dark">
          Preview
        </span>
        <span>
          Viewing as a <strong>{LABEL[pathway]}</strong> student. Locked units
          open for you only; nothing you do here is recorded.
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="text-brand-muted mr-1">Switch:</span>
          {ORDER.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => switchTo(p)}
              disabled={busy || p === pathway}
              className={
                "px-2.5 py-1 rounded-full border transition-colors disabled:cursor-default " +
                (p === pathway
                  ? "bg-brand-accent-dark text-white border-brand-accent-dark"
                  : "bg-white border-brand-border hover:border-brand-accent-dark disabled:opacity-50")
              }
            >
              {LABEL[p]}
            </button>
          ))}
          <button
            type="button"
            onClick={exit}
            disabled={busy}
            className="ml-2 px-3 py-1 rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 disabled:opacity-50"
          >
            Exit preview
          </button>
        </span>
        {error && <span className="basis-full text-red-700">{error}</span>}
      </div>
    </div>
  );
}
