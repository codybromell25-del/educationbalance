"use client";

import { useRef } from "react";
import { createPost } from "./actions";
import SubmitButton from "./SubmitButton";

/**
 * Top-level post composer. Sits at the top of the board.
 */
export default function PostForm() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createPost(fd);
        formRef.current?.reset();
      }}
      className="bg-white border border-brand-border rounded-2xl p-5 space-y-3"
    >
      <label
        htmlFor="post-body"
        className="block text-xs tracking-wider uppercase text-brand-muted"
      >
        Start a discussion
      </label>
      <textarea
        id="post-body"
        name="body"
        required
        rows={4}
        maxLength={4000}
        placeholder="Ask a question, share what's working, tell the group what's on your mind…"
        className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
      />
      <div className="flex justify-end">
        <SubmitButton label="Post" pendingLabel="Posting…" />
      </div>
    </form>
  );
}
