"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  path: string;
  name: string;
  size: number;
  createdAt: string | null;
  publicUrl: string;
};

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * One tile in the media grid: thumbnail, name, size, and the two actions
 * an author needs — copy the permanent URL, or delete the object.
 */
export default function MediaCard({ path, name, size, createdAt, publicUrl }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can be unavailable (non-https, permissions). The
      // read-only input below is always there as a manual fallback.
      setError("Couldn't copy automatically — select the link below and copy it.");
    }
  }

  async function remove() {
    if (
      !confirm(
        `Delete "${name}"?\n\nIf any unit still uses this image, it will show as broken there. This cannot be undone.`,
      )
    )
      return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/media?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Delete failed (HTTP ${res.status})`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setBusy(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-brand-border overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-brand-surface flex items-center justify-center overflow-hidden">
        {/* Plain <img>: admin thumbnails don't need next/image optimisation,
            and it avoids any remotePatterns coupling for the admin grid. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={publicUrl}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 space-y-2">
        <div className="min-w-0">
          <p className="text-sm text-brand-primary truncate" title={name}>
            {name}
          </p>
          <p className="text-xs text-brand-muted">
            {formatBytes(size)}
            {createdAt &&
              ` · ${new Date(createdAt).toLocaleDateString("en-IE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}`}
          </p>
        </div>
        <input
          readOnly
          value={publicUrl}
          onFocus={(e) => e.target.select()}
          className="w-full text-[11px] px-2 py-1 rounded border border-brand-border bg-brand-surface/60 text-brand-muted font-mono truncate"
          aria-label={`Public URL for ${name}`}
        />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={copy}
            disabled={busy}
            className="flex-1 px-3 py-1.5 text-xs bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy URL"}
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-full hover:bg-red-50 disabled:opacity-50"
          >
            {busy ? "…" : "Delete"}
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
