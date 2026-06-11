"use client";

import { useState } from "react";
import type { TimelineContent } from "@/lib/landing/config";
import { useSectionSave, SaveBar, TextInput } from "./_shared";

export default function TimelineEditor({
  initialContent,
}: {
  initialContent: TimelineContent;
}) {
  const [content, setContent] = useState<TimelineContent>(initialContent);
  const { save, busy, error, saved } = useSectionSave("timeline");

  function update(i: number, patch: Partial<TimelineContent["items"][number]>) {
    setContent((c) => ({
      ...c,
      items: c.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
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
            Timeline items
          </label>
          <button
            type="button"
            onClick={() =>
              setContent({
                ...content,
                items: [...content.items, { label: "New milestone", date: "CONFIRM" }],
              })
            }
            disabled={busy}
            className="text-xs text-brand-sage hover:text-brand-sage-dark"
          >
            + Add item
          </button>
        </div>
        <ul className="space-y-2">
          {content.items.map((it, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={it.label}
                onChange={(e) => update(i, { label: e.target.value })}
                disabled={busy}
                placeholder="Milestone label"
                className="flex-1 px-3 py-1.5 border border-brand-border rounded-lg bg-white text-brand-primary text-sm focus:outline-none focus:border-brand-sage"
              />
              <input
                type="text"
                value={it.date}
                onChange={(e) => update(i, { date: e.target.value })}
                disabled={busy}
                placeholder="e.g. 14 Mar 2026"
                className="w-40 px-3 py-1.5 border border-brand-border rounded-lg bg-white text-brand-primary text-sm focus:outline-none focus:border-brand-sage"
              />
              <button
                type="button"
                onClick={() =>
                  setContent({
                    ...content,
                    items: content.items.filter((_, idx) => idx !== i),
                  })
                }
                disabled={busy || content.items.length <= 1}
                className="text-brand-muted hover:text-red-600 disabled:opacity-30 px-2"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
      <TextInput
        label="Footnote (small text under the timeline)"
        value={content.footnote}
        onChange={(v) => setContent({ ...content, footnote: v })}
        disabled={busy}
      />
      <SaveBar busy={busy} saved={saved} error={error} onClick={() => save(content)} />
    </div>
  );
}
