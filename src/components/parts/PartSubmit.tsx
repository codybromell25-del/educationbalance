"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ExistingSubmission = {
  id: string;
  content: string;
  submittedAt: string;
  reviewed: boolean;
};

export default function PartSubmit({
  partId,
  existing,
}: {
  partId: string;
  existing: ExistingSubmission | null;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<ExistingSubmission | null>(
    existing,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partId, content }),
    });
    if (res.ok) {
      const data = (await res.json()) as ExistingSubmission;
      setSubmitted(data);
      setContent("");
      router.refresh();
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-brand-success/30 bg-brand-success/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-5 h-5 text-brand-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <p className="text-sm font-medium text-brand-success">
            Submitted{" "}
            {new Date(submitted.submittedAt).toLocaleDateString("en-IE", {
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <p className="text-sm text-brand-primary/80 whitespace-pre-wrap">
          {submitted.content}
        </p>
        <p className="text-xs text-brand-muted mt-4">
          {submitted.reviewed
            ? "Reviewed by the balance team."
            : "Awaiting review by the balance team."}
        </p>
        <button
          onClick={() => setSubmitted(null)}
          className="mt-4 text-sm text-brand-sage hover:text-brand-primary transition-colors"
        >
          Submit a new response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        className="w-full px-4 py-3 rounded-lg border border-brand-border bg-background text-brand-primary placeholder:text-brand-muted/50 resize-none focus:border-brand-sage transition-colors"
        placeholder="Write your reflective response here..."
        required
      />
      <div className="flex items-center justify-end mt-4">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-6 py-2.5 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit response"}
        </button>
      </div>
    </form>
  );
}
