/**
 * Supabase Storage helpers — server-side only.
 *
 * Uses the SERVICE_ROLE key so it bypasses RLS. Never import this from
 * a Client Component or expose the underlying client to the browser.
 *
 * Bucket layout (single private bucket "course-files"):
 *   parts/<cuid>.<ext>        — admin-uploaded PDFs and other course files
 *   submissions/<cuid>.<ext>  — student submission uploads
 *   hourlogs/<cuid>.<ext>     — student hour-log attachments
 *
 * Files are stored privately. Use `getSignedUrl` to produce a
 * time-limited read URL when rendering a download link.
 */
import { StorageClient } from "@supabase/storage-js";
import { randomUUID } from "node:crypto";

export const STORAGE_BUCKET = "course-files";

function getStorageClient(): StorageClient {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase storage not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.",
    );
  }
  return new StorageClient(`${SUPABASE_URL}/storage/v1`, {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  });
}

export type StorageFolder = "parts" | "submissions" | "hourlogs";

/** Uploads a File / Blob and returns its storage path (e.g. "parts/abc.pdf"). */
export async function uploadFile(
  file: File | Blob,
  folder: StorageFolder,
  originalName?: string,
): Promise<string> {
  const storage = getStorageClient();
  const ext = inferExtension(file, originalName);
  const path = `${folder}/${randomUUID()}${ext ? `.${ext}` : ""}`;

  const { error } = await storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType:
        (file as File).type || guessContentType(ext) || "application/octet-stream",
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  return path;
}

/** Returns a time-limited signed URL for a stored object. */
export async function getSignedUrl(
  path: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const storage = getStorageClient();
  const { data, error } = await storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data) throw new Error(`Signed URL failed: ${error?.message}`);
  return data.signedUrl;
}

/** Best-effort delete. Swallows "not found" errors. */
export async function deleteFile(path: string): Promise<void> {
  const storage = getStorageClient();
  const { error } = await storage.from(STORAGE_BUCKET).remove([path]);
  if (error && !/not found/i.test(error.message)) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Idempotent — creates the bucket if it doesn't exist. Call once from a
 * setup script. Safe to call repeatedly.
 */
export async function ensureBucket(): Promise<void> {
  const storage = getStorageClient();
  const { data: buckets, error: listErr } = await storage.listBuckets();
  if (listErr) throw new Error(`List buckets failed: ${listErr.message}`);

  if (buckets.some((b) => b.name === STORAGE_BUCKET)) return;

  const { error: createErr } = await storage.createBucket(STORAGE_BUCKET, {
    public: false,
  });
  if (createErr) throw new Error(`Create bucket failed: ${createErr.message}`);
}

// --- helpers ---

function inferExtension(file: File | Blob, originalName?: string): string {
  const name = originalName ?? (file as File).name;
  if (!name) return "";
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

function guessContentType(ext: string): string | null {
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "mp4":
      return "video/mp4";
    case "mov":
      return "video/quicktime";
    case "webm":
      return "video/webm";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return null;
  }
}
