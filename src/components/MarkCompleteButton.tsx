"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkCompleteButton({
  sectionId,
  isCompleted,
}: {
  sectionId: string;
  isCompleted: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId, completed: !isCompleted }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-6 py-2.5 text-sm tracking-wider uppercase rounded-full transition-colors disabled:opacity-50 shrink-0 ${
        isCompleted
          ? "bg-brand-success/10 text-brand-success border border-brand-success/20 hover:bg-brand-success/20"
          : "bg-brand-primary text-white hover:bg-brand-primary/90"
      }`}
    >
      {loading
        ? "..."
        : isCompleted
        ? "Completed"
        : "Mark Complete"}
    </button>
  );
}
