"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RespondForm({ questionId }: { questionId: string }) {
  const router = useRouter();
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!response.trim()) return;

    setLoading(true);
    await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, response }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        rows={2}
        className="flex-1 px-4 py-2.5 rounded-lg border border-brand-border bg-background text-sm resize-none focus:border-brand-sage transition-colors"
        placeholder="Type your response..."
        required
      />
      <button
        type="submit"
        disabled={loading || !response.trim()}
        className="px-5 py-2.5 bg-brand-primary text-white text-sm rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50 shrink-0"
      >
        {loading ? "..." : "Reply"}
      </button>
    </form>
  );
}
