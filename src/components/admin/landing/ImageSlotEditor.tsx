"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function ImageSlotEditor({
  slot,
  label,
  currentUrl,
  hasCustom,
}: {
  slot: string;
  label: string;
  currentUrl: string;
  hasCustom: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/landing-assets/${slot}`, {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleReset() {
    if (!confirm(`Reset "${label}" to the default image?`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/landing-assets/${slot}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-brand-border p-4">
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-brand-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt={label}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-brand-primary text-sm">{label}</p>
          <p className="text-xs text-brand-muted mt-0.5">
            {hasCustom ? "Custom upload" : "Default image"}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <label className="px-3 py-1.5 text-xs bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors cursor-pointer">
              {busy ? "Working…" : "Upload new"}
              <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFile}
                disabled={busy}
                className="hidden"
              />
            </label>
            {hasCustom && (
              <button
                type="button"
                onClick={handleReset}
                disabled={busy}
                className="px-3 py-1.5 text-xs text-brand-muted border border-brand-border rounded-full hover:bg-brand-surface disabled:opacity-50"
              >
                Reset to default
              </button>
            )}
          </div>
          {error && (
            <p className="text-xs text-red-600 mt-2 break-words">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
