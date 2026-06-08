"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SectionRowActions({
  sectionId,
  sectionTitle,
  isFirst,
  isLast,
}: {
  sectionId: string;
  sectionTitle: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function move(direction: "up" | "down") {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/sections/${sectionId}/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to reorder");
    } finally {
      setBusy(false);
    }
  }

  async function del() {
    if (
      !confirm(
        `Delete "${sectionTitle}"?\n\nThis permanently removes:\n• All parts in this section\n• All student progress, submissions, quiz attempts and questions on this section\n• Any hour logs tagged to this section (unsigned-off ones are cascaded too)\n\nThis cannot be undone.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/sections/${sectionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          move("up");
        }}
        disabled={busy || isFirst}
        className="w-8 h-8 rounded hover:bg-brand-surface disabled:opacity-30 disabled:hover:bg-transparent text-brand-muted"
        title="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          move("down");
        }}
        disabled={busy || isLast}
        className="w-8 h-8 rounded hover:bg-brand-surface disabled:opacity-30 disabled:hover:bg-transparent text-brand-muted"
        title="Move down"
      >
        ↓
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          del();
        }}
        disabled={busy}
        className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-full hover:bg-red-50 disabled:opacity-50 ml-1"
      >
        Delete
      </button>
    </div>
  );
}
