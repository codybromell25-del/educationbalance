"use client";

import { useState } from "react";
import type { FaqsContent } from "@/lib/landing/config";
import { useSectionSave, SaveBar, TextInput } from "./_shared";

export default function FaqsEditor({
  initialContent,
}: {
  initialContent: FaqsContent;
}) {
  const [content, setContent] = useState<FaqsContent>(initialContent);
  const { save, busy, error, saved } = useSectionSave("faqs");

  function update(i: number, patch: Partial<FaqsContent["items"][number]>) {
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
            Questions
          </label>
          <button
            type="button"
            onClick={() =>
              setContent({ ...content, items: [...content.items, { q: "", a: "" }] })
            }
            disabled={busy}
            className="text-xs text-brand-sage hover:text-brand-sage-dark"
          >
            + Add FAQ
          </button>
        </div>
        <div className="space-y-4">
          {content.items.map((it, i) => (
            <div
              key={i}
              className="rounded-xl border border-brand-border p-4 bg-brand-surface/30 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-wider uppercase text-brand-sage">
                  FAQ {i + 1}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      items: content.items.filter((_, idx) => idx !== i),
                    })
                  }
                  disabled={busy || content.items.length <= 1}
                  className="text-xs text-brand-muted hover:text-red-600 disabled:opacity-30"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={it.q}
                onChange={(e) => update(i, { q: e.target.value })}
                disabled={busy}
                placeholder="Question"
                className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
              />
              <textarea
                value={it.a}
                onChange={(e) => update(i, { a: e.target.value })}
                disabled={busy}
                rows={3}
                placeholder="Answer"
                className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary text-sm focus:outline-none focus:border-brand-sage"
              />
            </div>
          ))}
        </div>
      </div>
      <SaveBar busy={busy} saved={saved} error={error} onClick={() => save(content)} />
    </div>
  );
}
