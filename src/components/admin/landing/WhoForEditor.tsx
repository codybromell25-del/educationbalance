"use client";

import { useState } from "react";
import type { WhoForContent } from "@/lib/landing/config";
import { useSectionSave, SaveBar, TextInput, BulletEditor } from "./_shared";

export default function WhoForEditor({
  initialContent,
}: {
  initialContent: WhoForContent;
}) {
  const [content, setContent] = useState<WhoForContent>(initialContent);
  const { save, busy, error, saved } = useSectionSave("who-for");

  return (
    <div className="space-y-5">
      <TextInput
        label="Eyebrow"
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
      <BulletEditor
        label="Checklist bullets"
        items={content.bullets}
        onChange={(b) => setContent({ ...content, bullets: b })}
        disabled={busy}
        placeholder="e.g. You want to become a qualified Pilates instructor"
      />
      <SaveBar busy={busy} saved={saved} error={error} onClick={() => save(content)} />
    </div>
  );
}
