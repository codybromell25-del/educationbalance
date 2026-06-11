"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApplicationRowActions({
  id,
  contacted,
}: {
  id: string;
  contacted: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacted: !contacted }),
    });
    router.refresh();
    setBusy(false);
  }

  async function remove() {
    if (!confirm("Delete this application?")) return;
    setBusy(true);
    await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-1 flex-wrap justify-end">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`px-3 py-1.5 text-xs rounded-full border disabled:opacity-50 ${
          contacted
            ? "text-brand-muted border-brand-border hover:bg-brand-surface"
            : "text-brand-sage border-brand-sage/30 hover:bg-brand-sage/5"
        }`}
      >
        {contacted ? "Mark as new" : "Mark contacted"}
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-full hover:bg-red-50 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
