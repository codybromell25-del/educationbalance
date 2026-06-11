"use client";

import { useState } from "react";
import type { CoursePillarsContent } from "@/lib/landing/config";
import { useSectionSave, SaveBar, TextInput, TextArea } from "./_shared";

export default function CoursePillarsEditor({
  initialContent,
}: {
  initialContent: CoursePillarsContent;
}) {
  const [content, setContent] = useState<CoursePillarsContent>(initialContent);
  const { save, busy, error, saved } = useSectionSave("course-pillars");

  function updatePillar(i: number, patch: Partial<CoursePillarsContent["pillars"][number]>) {
    setContent((c) => ({
      ...c,
      pillars: c.pillars.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    }));
  }

  return (
    <div className="space-y-5">
      <TextInput
        label="Eyebrow (small uppercase text)"
        value={content.eyebrow}
        onChange={(v) => setContent({ ...content, eyebrow: v })}
        disabled={busy}
      />
      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Headline — 2 lines (line 2 renders italic)
        </label>
        <div className="grid sm:grid-cols-2 gap-2">
          {[0, 1].map((i) => (
            <input
              key={i}
              type="text"
              value={content.headlineLines[i] ?? ""}
              onChange={(e) => {
                const next = [...content.headlineLines];
                next[i] = e.target.value;
                setContent({ ...content, headlineLines: next });
              }}
              disabled={busy}
              placeholder={`Line ${i + 1}`}
              className="px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            />
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {content.pillars.map((p, i) => (
          <div
            key={i}
            className="rounded-xl border border-brand-border p-4 bg-brand-surface/30 space-y-2"
          >
            <p className="text-xs tracking-wider uppercase text-brand-muted">
              Pillar {i + 1} — image slot{" "}
              <span className="font-mono">{p.slotKey}</span>
            </p>
            <TextInput
              label="Title"
              value={p.title}
              onChange={(v) => updatePillar(i, { title: v })}
              disabled={busy}
            />
            <TextArea
              label="Description"
              value={p.desc}
              onChange={(v) => updatePillar(i, { desc: v })}
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
