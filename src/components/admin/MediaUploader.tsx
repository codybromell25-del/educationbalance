"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 20 * 1024 * 1024;

type Job = {
  id: string;
  name: string;
  size: number;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
  publicUrl?: string;
};

/**
 * Drag-and-drop / click-to-choose image uploader for the media library.
 *
 * Flow per file: ask our API for a one-shot signed upload URL, then PUT
 * the bytes straight to Supabase from the browser. Nothing large ever
 * passes through a Vercel function. Files upload one at a time so the
 * status list stays readable; errors are shown inline, never swallowed.
 */
export default function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  function patch(id: string, delta: Partial<Job>) {
    setJobs((curr) => curr.map((j) => (j.id === id ? { ...j, ...delta } : j)));
  }

  async function uploadOne(file: File, id: string) {
    patch(id, { status: "uploading" });
    try {
      // 1. Get a signed upload URL (validates type + size server-side too).
      const res = await fetch("/api/admin/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        signedUrl?: string;
        publicUrl?: string;
        error?: string;
      };
      if (!res.ok || !data.signedUrl || !data.publicUrl) {
        throw new Error(data.error ?? `Could not prepare upload (HTTP ${res.status})`);
      }

      // 2. PUT the file directly to storage. The token in the URL is the
      //    only credential involved — no keys in the browser.
      const put = await fetch(data.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) {
        const text = await put.text().catch(() => "");
        throw new Error(
          `Storage rejected the upload (HTTP ${put.status})${text ? `: ${text.slice(0, 160)}` : ""}`,
        );
      }

      patch(id, { status: "done", publicUrl: data.publicUrl });
    } catch (e) {
      patch(id, {
        status: "error",
        error: e instanceof Error ? e.message : "Upload failed",
      });
    }
  }

  async function handleFiles(list: FileList | File[]) {
    const files = Array.from(list);
    if (files.length === 0) return;

    // Pre-validate so obvious problems show instantly without a round trip.
    const newJobs: Job[] = files.map((f) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      if (!ALLOWED.includes(f.type)) {
        return {
          id,
          name: f.name,
          size: f.size,
          status: "error",
          error: "Only JPG, PNG, WebP and GIF images are accepted.",
        };
      }
      if (f.size > MAX_BYTES) {
        return {
          id,
          name: f.name,
          size: f.size,
          status: "error",
          error: `Too large (${(f.size / 1024 / 1024).toFixed(1)} MB). Limit is 20 MB — resize it and try again.`,
        };
      }
      return { id, name: f.name, size: f.size, status: "queued" };
    });
    setJobs((curr) => [...newJobs, ...curr]);

    setBusy(true);
    for (let i = 0; i < files.length; i++) {
      const job = newJobs[i];
      if (job.status === "queued") await uploadOne(files[i], job.id);
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    // Pull the fresh list into the grid below.
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={
          "rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors select-none " +
          (dragging
            ? "border-brand-sage bg-brand-sage/5"
            : "border-brand-border bg-white hover:border-brand-sage/60")
        }
      >
        <p className="text-brand-primary font-medium">
          Drop images here, or click to choose
        </p>
        <p className="text-xs text-brand-muted mt-1">
          JPG, PNG, WebP or GIF · up to 20 MB each · you can select several at
          once
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && void handleFiles(e.target.files)}
          disabled={busy}
        />
      </div>

      {jobs.length > 0 && (
        <ul className="space-y-1.5">
          {jobs.map((j) => (
            <li
              key={j.id}
              className="flex items-start justify-between gap-3 text-sm bg-white border border-brand-border rounded-lg px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-brand-primary truncate">{j.name}</p>
                {j.status === "error" && (
                  <p className="text-xs text-red-600 mt-0.5">{j.error}</p>
                )}
                {j.status === "done" && j.publicUrl && (
                  <p className="text-xs text-brand-muted mt-0.5 truncate">
                    {j.publicUrl}
                  </p>
                )}
              </div>
              <span
                className={
                  "shrink-0 text-xs tracking-wider uppercase " +
                  (j.status === "done"
                    ? "text-brand-sage"
                    : j.status === "error"
                      ? "text-red-600"
                      : "text-brand-muted")
                }
              >
                {j.status === "queued" && "Waiting"}
                {j.status === "uploading" && "Uploading…"}
                {j.status === "done" && "Uploaded"}
                {j.status === "error" && "Failed"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
