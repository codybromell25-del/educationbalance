"use client";

import { useState } from "react";
import type { FooterContent } from "@/lib/landing/config";
import { useSectionSave, SaveBar, TextInput } from "./_shared";

export default function FooterEditor({
  initialContent,
}: {
  initialContent: FooterContent;
}) {
  const [content, setContent] = useState<FooterContent>(initialContent);
  const { save, busy, error, saved } = useSectionSave("footer");

  return (
    <div className="space-y-5">
      <TextInput
        label="Tagline (under the logo)"
        value={content.tagline}
        onChange={(v) => setContent({ ...content, tagline: v })}
        disabled={busy}
      />
      <TextInput
        label="Contact email"
        value={content.contactEmail}
        onChange={(v) => setContent({ ...content, contactEmail: v })}
        disabled={busy}
        placeholder="hello@balancestudios.ie"
      />
      <TextInput
        label="Instagram URL"
        value={content.instagramUrl}
        onChange={(v) => setContent({ ...content, instagramUrl: v })}
        disabled={busy}
        placeholder="https://www.instagram.com/balancestudios"
      />
      <TextInput
        label="balance studio site URL"
        value={content.studioUrl}
        onChange={(v) => setContent({ ...content, studioUrl: v })}
        disabled={busy}
        placeholder="https://balancestudios.ie"
      />
      <SaveBar busy={busy} saved={saved} error={error} onClick={() => save(content)} />
    </div>
  );
}
