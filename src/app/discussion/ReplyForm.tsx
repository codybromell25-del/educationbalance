"use client";

import { useRef, useState } from "react";
import { createReply } from "./actions";
import SubmitButton from "./SubmitButton";

/**
 * Reply composer, collapsed by default. Click "Reply" to expand a
 * textarea + submit. Wraps the server action so the textarea clears
 * on success without a page-level redirect.
 */
export default function ReplyForm({ parentId }: { parentId: string }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-brand-sage hover:text-brand-sage-dark tracking-wider uppercase"
      >
        Reply
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createReply(fd);
        formRef.current?.reset();
        setOpen(false);
      }}
      className="mt-3 space-y-2"
    >
      <input type="hidden" name="parentId" value={parentId} />
      <textarea
        name="body"
        required
        rows={3}
        maxLength={4000}
        placeholder="Write a reply…"
        className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
      />
      <div className="flex items-center gap-2">
        <SubmitButton
          label="Reply"
          pendingLabel="Posting…"
          className="px-4 py-1.5 text-xs bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-brand-muted hover:text-brand-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
