"use client";

import { useState } from "react";
import type { WhatYouLearnContent } from "@/lib/landing/config";
import { useSectionSave, SaveBar, TextInput, BulletEditor } from "./_shared";

export default function WhatYouLearnEditor({
  initialContent,
}: {
  initialContent: WhatYouLearnContent;
}) {
  const [content, setContent] = useState<WhatYouLearnContent>(initialContent);
  const { save, busy, error, saved } = useSectionSave("what-you-learn");

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
      <BulletEditor
        label="Outcome bullets"
        items={content.bullets}
        onChange={(b) => setContent({ ...content, bullets: b })}
        disabled={busy}
        placeholder="e.g. Cue clients with clarity, calm and confidence"
      />
      <SaveBar busy={busy} saved={saved} error={error} onClick={() => save(content)} />
    </div>
  );
}
