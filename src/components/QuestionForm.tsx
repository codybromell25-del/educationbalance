"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuestionForm({ sectionId }: { sectionId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setSuccess(false);

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId, message }),
    });

    if (res.ok) {
      setMessage("");
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-brand-border p-6">
      <label
        htmlFor="question"
        className="block text-sm font-medium text-brand-primary mb-3"
      >
        Have a question about this section?
      </label>
      <textarea
        id="question"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 rounded-lg border border-brand-border bg-background text-brand-primary placeholder:text-brand-muted/50 resize-none focus:border-brand-accent transition-colors"
        placeholder="Type your question here..."
        required
      />
      <div className="flex items-center justify-between mt-4">
        {success && (
          <p className="text-sm text-brand-success">
            Question sent! We&apos;ll get back to you soon.
          </p>
        )}
        {!success && <div />}
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="px-6 py-2.5 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
