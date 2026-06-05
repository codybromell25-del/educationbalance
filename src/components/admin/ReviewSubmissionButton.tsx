"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewSubmissionButton({
  submissionId,
}: {
  submissionId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId, feedback }),
    });
    if (res.ok) {
      router.refresh();
      setOpen(false);
      setFeedback("");
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 px-4 py-2 text-xs tracking-wider uppercase rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors"
      >
        Review
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full mt-3 space-y-2">
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary text-sm focus:outline-none focus:border-brand-sage"
        placeholder="Optional feedback for the student (visible on their submission)…"
        disabled={loading}
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-xs tracking-wider uppercase rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "…" : "Mark reviewed"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setFeedback("");
          }}
          disabled={loading}
          className="px-4 py-2 text-xs text-brand-muted hover:text-brand-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
