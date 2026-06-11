"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useSectionSave<TContent>(section: string, template = "default") {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save(content: TContent) {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/landing-sections/${section}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, content }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return { save, busy, error, saved };
}

export function SaveBar({
  busy,
  saved,
  error,
  onClick,
  label = "Save changes",
}: {
  busy: boolean;
  saved: boolean;
  error: string | null;
  onClick: () => void;
  label?: string;
}) {
  return (
    <>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onClick}
          disabled={busy}
          className="px-5 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
        >
          {busy ? "Saving…" : label}
        </button>
        {saved && <span className="text-sm text-brand-success">✓ Saved</span>}
      </div>
    </>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
      />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  disabled,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
      />
    </div>
  );
}

export function BulletEditor({
  label,
  items,
  onChange,
  disabled,
  placeholder = "Bullet text",
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs tracking-wider uppercase text-brand-muted">
          {label}
        </label>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          disabled={disabled}
          className="text-xs text-brand-sage hover:text-brand-sage-dark"
        >
          + Add
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((v, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={v}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              disabled={disabled}
              placeholder={placeholder}
              className="flex-1 px-3 py-1.5 border border-brand-border rounded-lg bg-white text-brand-primary text-sm focus:outline-none focus:border-brand-sage"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              disabled={disabled || items.length <= 1}
              className="text-brand-muted hover:text-red-600 disabled:opacity-30 px-2"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
