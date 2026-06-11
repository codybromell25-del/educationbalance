"use client";

import { useState } from "react";
import type { WhyBalanceContent } from "@/lib/landing/config";
import { useSectionSave, SaveBar, TextInput } from "./_shared";

export default function WhyBalanceEditor({
  initialContent,
}: {
  initialContent: WhyBalanceContent;
}) {
  const [content, setContent] = useState<WhyBalanceContent>(initialContent);
  const { save, busy, error, saved } = useSectionSave("why-balance");

  function updateStat(i: number, patch: Partial<WhyBalanceContent["stats"][number]>) {
    setContent((c) => ({
      ...c,
      stats: c.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));
  }

  return (
    <div className="space-y-5">
      <TextInput
        label="Eyebrow"
        value={content.eyebrow}
        onChange={(v) => setContent({ ...content, eyebrow: v })}
        disabled={busy}
      />
      <TextInput
        label="Title"
        value={content.title}
        onChange={(v) => setContent({ ...content, title: v })}
        disabled={busy}
      />
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs tracking-wider uppercase text-brand-muted">
            Paragraphs
          </label>
          <button
            type="button"
            onClick={() => setContent({ ...content, paragraphs: [...content.paragraphs, ""] })}
            disabled={busy}
            className="text-xs text-brand-sage hover:text-brand-sage-dark"
          >
            + Add paragraph
          </button>
        </div>
        <ul className="space-y-2">
          {content.paragraphs.map((p, i) => (
            <li key={i} className="flex items-start gap-2">
              <textarea
                value={p}
                onChange={(e) => {
                  const next = [...content.paragraphs];
                  next[i] = e.target.value;
                  setContent({ ...content, paragraphs: next });
                }}
                disabled={busy}
                rows={3}
                className="flex-1 px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary text-sm focus:outline-none focus:border-brand-sage"
              />
              <button
                type="button"
                onClick={() =>
                  setContent({
                    ...content,
                    paragraphs: content.paragraphs.filter((_, idx) => idx !== i),
                  })
                }
                disabled={busy || content.paragraphs.length <= 1}
                className="text-brand-muted hover:text-red-600 disabled:opacity-30 px-2 pt-2"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Stats (value + label)
        </label>
        <div className="grid sm:grid-cols-3 gap-2">
          {content.stats.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-brand-border p-3 bg-brand-surface/30 space-y-2"
            >
              <input
                type="text"
                value={s.value}
                onChange={(e) => updateStat(i, { value: e.target.value })}
                disabled={busy}
                placeholder="e.g. 1000+"
                className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary text-center text-lg focus:outline-none focus:border-brand-sage"
              />
              <input
                type="text"
                value={s.label}
                onChange={(e) => updateStat(i, { label: e.target.value })}
                disabled={busy}
                placeholder="e.g. Clients trained"
                className="w-full px-3 py-1.5 border border-brand-border rounded-lg bg-white text-brand-primary text-sm text-center focus:outline-none focus:border-brand-sage"
              />
            </div>
          ))}
        </div>
      </div>
      <SaveBar busy={busy} saved={saved} error={error} onClick={() => save(content)} />
    </div>
  );
}
