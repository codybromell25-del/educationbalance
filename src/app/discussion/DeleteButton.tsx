"use client";

import { deletePost } from "./actions";

/**
 * Delete button — rendered only for posts the current user can delete
 * (their own, or any post if admin). Uses a native confirm() so we
 * don't need to build a modal.
 */
export default function DeleteButton({ postId }: { postId: string }) {
  return (
    <form
      action={async (fd) => {
        await deletePost(fd);
      }}
      onSubmit={(e) => {
        if (!window.confirm("Delete this post?")) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={postId} />
      <button
        type="submit"
        className="text-xs text-brand-error/80 hover:text-brand-error tracking-wider uppercase"
      >
        Delete
      </button>
    </form>
  );
}
