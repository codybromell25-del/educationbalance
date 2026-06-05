"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PartType } from "@prisma/client";

type PartRow = {
  id: string;
  order: number;
  title: string;
  type: PartType;
  body: string | null;
  videoUrl: string | null;
  fileUrl: string | null;
  quizId: string | null;
  quizQuestionCount: number | null;
};

const TYPE_LABEL: Record<PartType, string> = {
  TEXT: "Text",
  VIDEO: "Video",
  DOWNLOAD: "Download",
  QUIZ: "Quiz",
  SUBMIT: "Submission",
};

const TYPE_BADGE_COLOR: Record<PartType, string> = {
  TEXT: "bg-brand-surface text-brand-muted",
  VIDEO: "bg-brand-sage/10 text-brand-sage",
  DOWNLOAD: "bg-brand-accent/10 text-brand-accent",
  QUIZ: "bg-brand-primary/10 text-brand-primary",
  SUBMIT: "bg-brand-sage/20 text-brand-sage",
};

export default function PartsManager({
  sectionId,
  initialParts,
}: {
  sectionId: string;
  initialParts: PartRow[];
}) {
  const router = useRouter();
  const [parts, setParts] = useState(initialParts);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    router.refresh();
  }

  async function handleCreate(payload: PartFormPayload) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, sectionId }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const { part } = await res.json();
      // The POST response doesn't include the newly-created Quiz's id;
      // a router.refresh() below pulls it in for QUIZ parts.
      setParts((curr) => [
        ...curr,
        {
          ...part,
          quizId: null,
          quizQuestionCount: part.type === "QUIZ" ? 0 : null,
        },
      ]);
      setShowAdd(false);
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create part");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(id: string, payload: Partial<PartFormPayload>) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/parts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const { part } = await res.json();
      setParts((curr) =>
        curr.map((p) => (p.id === id ? { ...p, ...part } : p)),
      );
      setEditingId(null);
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update part");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this part? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/parts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setParts((curr) =>
        curr
          .filter((p) => p.id !== id)
          .map((p, i) => ({ ...p, order: i + 1 })),
      );
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setBusy(false);
    }
  }

  async function handleMove(id: string, direction: "up" | "down") {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/parts/${id}/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      // Optimistically swap in local state
      setParts((curr) => {
        const idx = curr.findIndex((p) => p.id === id);
        const otherIdx = direction === "up" ? idx - 1 : idx + 1;
        if (otherIdx < 0 || otherIdx >= curr.length) return curr;
        const next = [...curr];
        [next[idx], next[otherIdx]] = [next[otherIdx], next[idx]];
        return next.map((p, i) => ({ ...p, order: i + 1 }));
      });
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to reorder");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm tracking-wider uppercase text-brand-muted">
          Parts ({parts.length})
        </h2>
        {!showAdd && (
          <button
            type="button"
            onClick={() => {
              setShowAdd(true);
              setEditingId(null);
            }}
            className="px-4 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors"
            disabled={busy}
          >
            + Add part
          </button>
        )}
      </div>

      {showAdd && (
        <PartForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => setShowAdd(false)}
          busy={busy}
        />
      )}

      <ul className="space-y-3">
        {parts.map((part, i) => (
          <li
            key={part.id}
            className="bg-white rounded-xl border border-brand-border overflow-hidden"
          >
            {editingId === part.id ? (
              <PartForm
                mode="edit"
                initialValues={{
                  title: part.title,
                  type: part.type,
                  body: part.body ?? "",
                  videoUrl: part.videoUrl ?? "",
                  fileUrl: part.fileUrl ?? "",
                }}
                onSubmit={(payload) => handleUpdate(part.id, payload)}
                onCancel={() => setEditingId(null)}
                busy={busy}
                typeLocked
              />
            ) : (
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-brand-surface text-brand-muted flex items-center justify-center shrink-0 text-xs font-medium mt-0.5">
                      {part.order}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-brand-primary">
                          {part.title}
                        </h3>
                        <span
                          className={`text-xs tracking-wider uppercase rounded-full px-2 py-0.5 ${TYPE_BADGE_COLOR[part.type]}`}
                        >
                          {TYPE_LABEL[part.type]}
                        </span>
                      </div>
                      <p className="text-sm text-brand-muted mt-1">
                        {summaryOf(part)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {part.type === "QUIZ" && part.quizId && (
                      <Link
                        href={`/admin/quizzes/${part.quizId}`}
                        className="px-3 py-1.5 text-xs text-brand-sage border border-brand-sage/30 rounded-full hover:bg-brand-sage/5"
                      >
                        Manage quiz
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleMove(part.id, "up")}
                      disabled={busy || i === 0}
                      className="w-8 h-8 rounded hover:bg-brand-surface disabled:opacity-30 disabled:hover:bg-transparent text-brand-muted"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(part.id, "down")}
                      disabled={busy || i === parts.length - 1}
                      className="w-8 h-8 rounded hover:bg-brand-surface disabled:opacity-30 disabled:hover:bg-transparent text-brand-muted"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(part.id);
                        setShowAdd(false);
                      }}
                      disabled={busy}
                      className="px-3 py-1.5 text-xs text-brand-primary border border-brand-border rounded-full hover:bg-brand-surface"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(part.id)}
                      disabled={busy}
                      className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-full hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}

        {parts.length === 0 && !showAdd && (
          <li className="text-center py-12 text-brand-muted bg-white rounded-xl border border-brand-border">
            No parts yet. Click &ldquo;Add part&rdquo; to create one.
          </li>
        )}
      </ul>
    </div>
  );
}

function summaryOf(part: PartRow): string {
  switch (part.type) {
    case "TEXT":
    case "SUBMIT":
      return part.body
        ? stripHtml(part.body).slice(0, 120) +
            (stripHtml(part.body).length > 120 ? "…" : "")
        : "No body content";
    case "VIDEO":
      return part.videoUrl ? part.videoUrl : "No video URL set";
    case "DOWNLOAD":
      return part.fileUrl ? "File uploaded" : "No file uploaded";
    case "QUIZ":
      return `${part.quizQuestionCount ?? 0} questions`;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

// --- Form ---

type PartFormPayload = {
  title: string;
  type: PartType;
  body?: string | null;
  videoUrl?: string | null;
  fileUrl?: string | null;
};

function PartForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  busy,
  typeLocked = false,
}: {
  mode: "create" | "edit";
  initialValues?: {
    title: string;
    type: PartType;
    body: string;
    videoUrl: string;
    fileUrl: string;
  };
  onSubmit: (payload: PartFormPayload) => void;
  onCancel: () => void;
  busy: boolean;
  typeLocked?: boolean;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [type, setType] = useState<PartType>(initialValues?.type ?? "TEXT");
  const [body, setBody] = useState(initialValues?.body ?? "");
  const [videoUrl, setVideoUrl] = useState(initialValues?.videoUrl ?? "");
  const [fileUrl, setFileUrl] = useState(initialValues?.fileUrl ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "parts");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
      const { path } = await res.json();
      setFileUrl(path);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    const payload: PartFormPayload = { title: title.trim(), type };
    if (type === "TEXT" || type === "SUBMIT") payload.body = body || null;
    if (type === "VIDEO") payload.videoUrl = videoUrl || null;
    if (type === "DOWNLOAD") payload.fileUrl = fileUrl || null;
    onSubmit(payload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-surface/30 border border-brand-border rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-brand-primary">
          {mode === "create" ? "New part" : "Edit part"}
        </h3>
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          placeholder="e.g. The story of Pilates"
          required
          disabled={busy}
        />
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as PartType)}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage disabled:bg-brand-surface disabled:cursor-not-allowed"
          disabled={busy || typeLocked}
        >
          <option value="TEXT">Text — written content</option>
          <option value="VIDEO">Video — Vimeo or YouTube embed</option>
          <option value="DOWNLOAD">Download — PDF or other file</option>
          <option value="QUIZ">Quiz — MCQ with passing score</option>
          <option value="SUBMIT">Submission — student response</option>
        </select>
        {typeLocked && (
          <p className="text-xs text-brand-muted mt-1">
            Type can&rsquo;t be changed after creation. Delete and recreate to switch.
          </p>
        )}
      </div>

      {(type === "TEXT" || type === "SUBMIT") && (
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Body (HTML allowed)
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary font-mono text-sm focus:outline-none focus:border-brand-sage"
            placeholder={
              type === "SUBMIT"
                ? "<p>Reflect on... Minimum 200 words.</p>"
                : "<p>Your written content here. Use &lt;h3&gt; for sub-headings, &lt;ul&gt; for lists.</p>"
            }
            disabled={busy}
          />
        </div>
      )}

      {type === "VIDEO" && (
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            Video URL
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
            placeholder="https://vimeo.com/123456789 or https://youtu.be/xyz"
            disabled={busy}
          />
        </div>
      )}

      {type === "DOWNLOAD" && (
        <div>
          <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
            File
          </label>
          {fileUrl && (
            <p className="text-sm text-brand-muted mb-2 font-mono break-all">
              Current: {fileUrl}
            </p>
          )}
          <input
            type="file"
            onChange={handleFile}
            accept=".pdf,.docx,.mp4,.mov,.webm,.png,.jpg,.jpeg"
            className="w-full text-sm text-brand-primary file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand-sage file:text-white file:cursor-pointer file:hover:bg-brand-sage-dark"
            disabled={busy || uploading}
          />
          {uploading && (
            <p className="text-sm text-brand-muted mt-1">Uploading…</p>
          )}
        </div>
      )}

      {type === "QUIZ" && (
        <p className="text-sm text-brand-muted">
          A blank quiz will be created. Use the quiz builder (coming soon) to
          add questions.
        </p>
      )}

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={busy || uploading}
          className="px-5 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
        >
          {mode === "create" ? "Create part" : "Save changes"}
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
