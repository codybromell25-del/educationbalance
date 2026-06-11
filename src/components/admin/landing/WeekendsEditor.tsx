"use client";

import { useState } from "react";
import type { WeekendsContent } from "@/lib/landing/config";
import { useSectionSave, SaveBar, TextInput, TextArea } from "./_shared";

export default function WeekendsEditor({
  initialContent,
}: {
  initialContent: WeekendsContent;
}) {
  const [content, setContent] = useState<WeekendsContent>(initialContent);
  const { save, busy, error, saved } = useSectionSave("weekends");

  function update(i: number, patch: Partial<WeekendsContent["weekends"][number]>) {
    setContent((c) => ({
      ...c,
      weekends: c.weekends.map((w, idx) => (idx === i ? { ...w, ...patch } : w)),
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
      <div className="grid sm:grid-cols-2 gap-4">
        {content.weekends.map((w, i) => (
          <div
            key={i}
            className="rounded-xl border border-brand-border p-4 bg-brand-surface/30 space-y-2"
          >
            <p className="text-xs tracking-wider uppercase text-brand-sage">
              Weekend {w.n}
            </p>
            <TextInput
              label="Title"
              value={w.title}
              onChange={(v) => update(i, { title: v })}
              disabled={busy}
            />
            <TextArea
              label="Body"
              value={w.body}
              onChange={(v) => update(i, { body: v })}
              disabled={busy}
              rows={3}
            />
          </div>
        ))}
      </div>
      <SaveBar busy={busy} saved={saved} error={error} onClick={() => save(content)} />
    </div>
  );
}
