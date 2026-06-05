"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ExistingSubmission = {
  id: string;
  content: string;
  fileUrl: string | null;
  /** Pre-resolved signed URL for the existing file (server-rendered). */
  fileSignedUrl: string | null;
  submittedAt: string;
  reviewed: boolean;
};

export default function PartSubmit({
  partId,
  existing,
}: {
  partId: string;
  existing: ExistingSubmission | null;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<ExistingSubmission | null>(
    existing,
  );

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "submissions");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Upload failed");
      }
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
    if (!content.trim() && !filePath) {
      setError("Write a response or attach a file.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partId,
          content: content.trim() || undefined,
          fileUrl: filePath,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Submission failed");
      }
      const data = await res.json();
      // The new submission's fileSignedUrl will be resolved by the next
      // server render — for now we keep the page in sync by refreshing.
      setSubmitted({
        id: data.id,
        content: data.content,
        fileUrl: data.fileUrl,
        fileSignedUrl: null,
        submittedAt: data.submittedAt,
        reviewed: data.reviewed,
      });
      setContent("");
      setFilePath(null);
      setFileName(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-brand-success/30 bg-brand-success/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-5 h-5 text-brand-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <p className="text-sm font-medium text-brand-success">
            Submitted{" "}
            {new Date(submitted.submittedAt).toLocaleDateString("en-IE", {
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {submitted.content && (
          <p className="text-sm text-brand-primary/80 whitespace-pre-wrap">
            {submitted.content}
          </p>
        )}

        {submitted.fileSignedUrl && (
          <a
            href={submitted.fileSignedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-sm text-brand-sage hover:text-brand-sage-dark"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            View attached file
          </a>
        )}

        <p className="text-xs text-brand-muted mt-4">
          {submitted.reviewed
            ? "Reviewed by the balance team."
            : "Awaiting review by the balance team."}
        </p>
        <button
          onClick={() => setSubmitted(null)}
          className="mt-4 text-sm text-brand-sage hover:text-brand-primary transition-colors"
        >
          Submit a new response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        className="w-full px-4 py-3 rounded-lg border border-brand-border bg-background text-brand-primary placeholder:text-brand-muted/50 resize-none focus:border-brand-sage transition-colors"
        placeholder="Write your reflective response here... (optional if you're attaching a file)"
      />

      <div>
        <p className="text-xs tracking-wider uppercase text-brand-muted mb-2">
          Attach a file (optional — video, PDF, document)
        </p>
        {fileName ? (
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-brand-surface rounded-lg border border-brand-border">
            <span className="text-sm text-brand-primary truncate">
              {fileName}
            </span>
            <button
              type="button"
              onClick={() => {
                setFilePath(null);
                setFileName(null);
              }}
              className="text-xs text-brand-muted hover:text-brand-primary shrink-0"
              disabled={loading}
            >
              Remove
            </button>
          </div>
        ) : (
          <input
            type="file"
            onChange={handleFile}
            accept=".pdf,.docx,.mp4,.mov,.webm,.png,.jpg,.jpeg"
            disabled={uploading || loading}
            className="block w-full text-sm text-brand-primary file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand-sage file:text-white file:cursor-pointer file:hover:bg-brand-sage-dark"
          />
        )}
        {uploading && (
          <p className="text-sm text-brand-muted mt-1">Uploading…</p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={loading || uploading || (!content.trim() && !filePath)}
          className="px-6 py-2.5 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit response"}
        </button>
      </div>
    </form>
  );
}
