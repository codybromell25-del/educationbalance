"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { HourCategory } from "@prisma/client";

type LogRow = {
  id: string;
  category: HourCategory;
  date: string;
  durationMinutes: number;
  description: string;
  fileUrl: string | null;
  fileSignedUrl: string | null;
  signedOffAt: string | null;
  signedOffByName: string | null;
  feedback: string | null;
};

const CATEGORY_LABEL: Record<HourCategory, string> = {
  OBSERVATION: "Observation",
  TEACHING: "Teaching",
  SELF_PRACTICE: "Self-practice",
};

const CATEGORY_BADGE: Record<HourCategory, string> = {
  OBSERVATION: "bg-brand-sage/10 text-brand-sage",
  TEACHING: "bg-brand-accent/10 text-brand-accent",
  SELF_PRACTICE: "bg-brand-primary/10 text-brand-primary",
};

export default function HourLogList({
  initialLogs,
}: {
  initialLogs: LogRow[];
}) {
  const router = useRouter();
  const [logs, setLogs] = useState(initialLogs);
  const [showAdd, setShowAdd] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm("Delete this log?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/hours/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setLogs((curr) => curr.filter((l) => l.id !== id));
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm tracking-wider uppercase text-brand-muted">
          Your logs ({logs.length})
        </h2>
        {!showAdd && (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors"
            disabled={busy}
          >
            + Add hours
          </button>
        )}
      </div>

      {showAdd && (
        <div className="mb-4">
          <HourLogForm
            onCreated={(log) => {
              setLogs((curr) => [
                {
                  ...log,
                  fileSignedUrl: null,
                  signedOffAt: null,
                  signedOffByName: null,
                  feedback: null,
                },
                ...curr,
              ]);
              setShowAdd(false);
              router.refresh();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </div>
      )}

      <ul className="space-y-3">
        {logs.map((l) => {
          const signedOff = !!l.signedOffAt;
          return (
            <li
              key={l.id}
              className={`bg-white rounded-xl border p-5 ${
                signedOff ? "border-brand-success/30" : "border-brand-border"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span
                      className={`text-xs tracking-wider uppercase rounded-full px-2 py-0.5 ${CATEGORY_BADGE[l.category]}`}
                    >
                      {CATEGORY_LABEL[l.category]}
                    </span>
                    <span className="text-sm text-brand-primary font-medium">
                      {formatMinutes(l.durationMinutes)}
                    </span>
                    <span className="text-sm text-brand-muted">
                      {new Date(l.date).toLocaleDateString("en-IE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {signedOff && (
                      <span className="text-xs text-brand-success">
                        ✓ Signed off
                        {l.signedOffByName ? ` by ${l.signedOffByName}` : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-brand-primary/80 whitespace-pre-wrap">
                    {l.description}
                  </p>
                  {l.fileSignedUrl && (
                    <a
                      href={l.fileSignedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-brand-sage hover:text-brand-sage-dark"
                    >
                      📎 Open attached file
                    </a>
                  )}
                  {l.feedback && (
                    <div className="mt-3 pt-3 border-t border-brand-success/30">
                      <p className="text-xs tracking-wider uppercase text-brand-sage mb-1">
                        Instructor feedback
                      </p>
                      <p className="text-sm text-brand-primary/80 whitespace-pre-wrap">
                        {l.feedback}
                      </p>
                    </div>
                  )}
                </div>
                {!signedOff && (
                  <button
                    type="button"
                    onClick={() => handleDelete(l.id)}
                    disabled={busy}
                    className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-full hover:bg-red-50 shrink-0"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          );
        })}
        {logs.length === 0 && !showAdd && (
          <li className="text-center py-12 text-brand-muted bg-white rounded-xl border border-brand-border">
            No hours logged yet. Click &ldquo;Add hours&rdquo; to start.
          </li>
        )}
      </ul>
    </div>
  );
}

// --- form ---

function HourLogForm({
  onCreated,
  onCancel,
}: {
  onCreated: (log: LogRow) => void;
  onCancel: () => void;
}) {
  const [category, setCategory] = useState<HourCategory>("OBSERVATION");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [hours, setHours] = useState(1);
  const [extraMinutes, setExtraMinutes] = useState(0);
  const [description, setDescription] = useState("");
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "hourlogs");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
      const { path } = await res.json();
      setFilePath(path);
      setFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const durationMinutes = hours * 60 + extraMinutes;
    if (durationMinutes <= 0) {
      setError("Duration must be greater than zero");
      return;
    }
    if (!description.trim()) {
      setError("Description required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          date,
          durationMinutes,
          description,
          fileUrl: filePath,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const { hourLog } = await res.json();
      onCreated({
        id: hourLog.id,
        category: hourLog.category,
        date: hourLog.date,
        durationMinutes: hourLog.durationMinutes,
        description: hourLog.description,
        fileUrl: hourLog.fileUrl,
        fileSignedUrl: null,
        signedOffAt: null,
        signedOffByName: null,
        feedback: null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-surface/30 border border-brand-border rounded-xl p-5 space-y-4"
    >
      <h3 className="font-medium text-brand-primary">New log entry</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as HourCategory)}
            disabled={busy}
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          >
            <option value="OBSERVATION">Observation</option>
            <option value="TEACHING">Teaching</option>
            <option value="SELF_PRACTICE">Self-practice</option>
          </select>
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={busy}
            max={new Date().toISOString().slice(0, 10)}
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Duration
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={hours}
            onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
            disabled={busy}
            className="w-24 px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          />
          <span className="text-sm text-brand-muted">hours</span>
          <input
            type="number"
            min={0}
            max={59}
            value={extraMinutes}
            onChange={(e) =>
              setExtraMinutes(Math.max(0, Math.min(59, Number(e.target.value))))
            }
            disabled={busy}
            className="w-24 px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          />
          <span className="text-sm text-brand-muted">minutes</span>
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          What did you do?
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          disabled={busy}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          placeholder="Briefly describe the session — what you observed, taught, or practised."
        />
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Evidence (optional)
        </label>
        {fileName ? (
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white rounded-lg border border-brand-border">
            <span className="text-sm text-brand-primary truncate">
              {fileName}
            </span>
            <button
              type="button"
              onClick={() => {
                setFilePath(null);
                setFileName(null);
              }}
              className="text-xs text-brand-muted hover:text-brand-primary"
              disabled={busy}
            >
              Remove
            </button>
          </div>
        ) : (
          <input
            type="file"
            onChange={handleFile}
            disabled={busy || uploading}
            accept=".pdf,.docx,.png,.jpg,.jpeg,.mp4,.mov,.webm"
            className="block w-full text-sm text-brand-primary file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand-sage file:text-white file:cursor-pointer file:hover:bg-brand-sage-dark"
          />
        )}
        {uploading && (
          <p className="text-sm text-brand-muted mt-1">Uploading…</p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={busy || uploading}
          className="px-5 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save log"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="px-5 py-2 text-sm text-brand-muted hover:text-brand-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
