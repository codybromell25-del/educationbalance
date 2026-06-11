"use client";

import { useState } from "react";
import type { WhatYouGetContent } from "@/lib/landing/config";
import { useSectionSave, SaveBar, TextInput, TextArea } from "./_shared";

export default function WhatYouGetEditor({
  initialContent,
}: {
  initialContent: WhatYouGetContent;
}) {
  const [content, setContent] = useState<WhatYouGetContent>(initialContent);
  const { save, busy, error, saved } = useSectionSave("what-you-get");

  function update(i: number, patch: Partial<WhatYouGetContent["items"][number]>) {
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
      <div className="grid sm:grid-cols-2 gap-4">
        {content.items.map((it, i) => (
          <div
            key={i}
            className="rounded-xl border border-brand-border p-4 bg-brand-surface/30 space-y-2"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={it.icon}
                onChange={(e) => update(i, { icon: e.target.value })}
                disabled={busy}
                placeholder="emoji"
                className="w-16 px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary text-center focus:outline-none focus:border-brand-sage"
              />
              <input
                type="text"
                value={it.title}
                onChange={(e) => update(i, { title: e.target.value })}
                disabled={busy}
                placeholder="Title"
                className="flex-1 px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
              />
            </div>
            <TextArea
              label="Body"
              value={it.body}
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
