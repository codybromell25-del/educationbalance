"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SectionData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  unlockDate: string; // ISO
  requiresPriorCompletion: boolean;
};

export default function SectionEditForm({
  initial,
}: {
  initial: SectionData;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [description, setDescription] = useState(initial.description);
  const [content, setContent] = useState(initial.content);
  // Date input wants yyyy-MM-ddTHH:mm without timezone — strip seconds + zone
  const [unlockDate, setUnlockDate] = useState(
    initial.unlockDate.slice(0, 16),
  );
  const [requiresPriorCompletion, setRequiresPriorCompletion] = useState(
    initial.requiresPriorCompletion,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugChanged = slug !== initial.slug;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      slugChanged &&
      !confirm(
        "Changing the slug will break any existing bookmarks or links that use the old URL. Continue?",
      )
    ) {
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`/api/admin/sections/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          content,
          unlockDate: new Date(unlockDate).toISOString(),
          requiresPriorCompletion,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-brand-sage hover:text-brand-sage-dark transition-colors"
      >
        Edit section details
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-brand-border rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-brand-primary">Edit section</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={busy}
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          />
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Slug (URL)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            pattern="[a-z0-9-]+"
            disabled={busy}
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary font-mono text-sm focus:outline-none focus:border-brand-sage"
          />
          {slugChanged && (
            <p className="text-xs text-brand-accent mt-1">
              ⚠ Changing the slug breaks existing /course/{initial.slug} URLs.
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={busy}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
        />
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Section overview content (HTML — shown when section has no parts)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          disabled={busy}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary font-mono text-sm focus:outline-none focus:border-brand-sage"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Unlock date
          </label>
          <input
            type="datetime-local"
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            disabled={busy}
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={requiresPriorCompletion}
              onChange={(e) => setRequiresPriorCompletion(e.target.checked)}
              disabled={busy}
              className="w-4 h-4 accent-brand-sage"
            />
            <span className="text-sm text-brand-primary">
              Require previous section to be completed
            </span>
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={busy}
          className="px-5 py-2 text-sm text-brand-muted hover:text-brand-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
