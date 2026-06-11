"use client";

import { useState } from "react";

const PATHWAYS = [
  { value: "A", label: "Pathway A — Full comprehensive (mat + reformer)" },
  { value: "B", label: "Pathway B — Mat only" },
  { value: "C", label: "Pathway C — Reformer only (need existing mat qual)" },
  { value: "UNSURE", label: "Not sure yet — happy to talk it through" },
];

export default function ApplicationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pathway, setPathway] = useState("A");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, pathway, notes }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full bg-brand-sage/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-brand-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-xl font-light text-brand-primary mb-2">Thanks — we&rsquo;ve got it</p>
        <p className="text-sm text-brand-muted">
          We&rsquo;ll be in touch within a week. Keep an eye on{" "}
          <span className="text-brand-primary font-medium">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="app-name" className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Name
          </label>
          <input
            id="app-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={busy}
            className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="app-email" className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Email
          </label>
          <input
            id="app-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={busy}
            className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="app-pathway" className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Pathway you&rsquo;re interested in
        </label>
        <select
          id="app-pathway"
          value={pathway}
          onChange={(e) => setPathway(e.target.value)}
          required
          disabled={busy}
          className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
        >
          {PATHWAYS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="app-notes" className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Anything you&rsquo;d like us to know
        </label>
        <textarea
          id="app-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          disabled={busy}
          className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          placeholder="Background, existing qualifications, questions about dates / pricing… (optional)"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full px-8 py-3.5 bg-brand-primary text-white text-xs tracking-[0.25em] uppercase rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
      >
        {busy ? "Sending…" : "Send application"}
      </button>

      <p className="text-xs text-brand-muted text-center">
        We&rsquo;ll only use your details to follow up about this course.
      </p>
    </form>
  );
}
