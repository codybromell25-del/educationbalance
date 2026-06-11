"use client";

import { useState } from "react";
import type { FinalCtaContent } from "@/lib/landing/config";
import { useSectionSave, SaveBar, TextInput, TextArea } from "./_shared";

export default function FinalCtaEditor({
  initialContent,
}: {
  initialContent: FinalCtaContent;
}) {
  const [content, setContent] = useState<FinalCtaContent>(initialContent);
  const { save, busy, error, saved } = useSectionSave("final-cta");

  return (
    <div className="space-y-5">
      <TextInput
        label="Title"
        value={content.title}
        onChange={(v) => setContent({ ...content, title: v })}
        disabled={busy}
      />
      <TextArea
        label="Description"
        value={content.description}
        onChange={(v) => setContent({ ...content, description: v })}
        disabled={busy}
        rows={3}
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <TextInput
          label='Primary button label ("Sign Up Now" → /signup)'
          value={content.primaryLabel}
          onChange={(v) => setContent({ ...content, primaryLabel: v })}
          disabled={busy}
        />
        <TextInput
          label='Secondary button label (scrolls to apply form)'
          value={content.secondaryLabel}
          onChange={(v) => setContent({ ...content, secondaryLabel: v })}
          disabled={busy}
        />
      </div>
      <SaveBar busy={busy} saved={saved} error={error} onClick={() => save(content)} />
    </div>
  );
}
