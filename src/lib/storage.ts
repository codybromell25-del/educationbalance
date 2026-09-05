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
      "Supabase storage not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment (locally in .env, or in the Vercel project's Environment Variables settings for the live site) and redeploy.",
    );
  }
  return new StorageClient(`${SUPABASE_URL}/storage/v1`, {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  });
}

export type StorageFolder = "parts" | "submissions" | "hourlogs" | "landing";

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

/**
 * Convenience: if the input looks like an http(s) URL, return it as-is;
 * otherwise treat it as a storage path and return a signed URL. Useful
 * for fields like Part.fileUrl that might hold either form during the
 * transition from "paste a public URL" to "upload to bucket".
 *
 * Pass `download` to force the browser to save the file to disk with
 * that name instead of previewing it in the tab. Ignored when the
 * input is an external http(s) URL (we can't rewrite headers on those).
 */
export async function resolveFileUrl(
  pathOrUrl: string | null,
  expiresInSeconds = 3600,
  download?: string | boolean,
): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  // Never let one bad path (deleted object, missing SUPABASE_* env var,
  // network blip) take down a whole page. Every caller already handles
  // `null` — PartDownload shows "Download coming soon", admin pages skip
  // the link, the landing loader falls back to the bundled image.
  try {
    return await getSignedUrl(pathOrUrl, expiresInSeconds, download);
  } catch (e) {
    console.error(
      `[storage] resolveFileUrl failed for "${pathOrUrl}":`,
      e instanceof Error ? e.message : e,
    );
    return null;
  }
}

/**
 * Returns a time-limited signed URL for a stored object.
 *
 * `download` — set to a filename string ("student-handbook.pdf") to
 * have Supabase send Content-Disposition: attachment with that
 * filename, so a click writes straight to the student's Downloads
 * folder instead of opening the PDF viewer in a new tab. `true` uses
 * the object's original storage-key basename.
 */
export async function getSignedUrl(
  path: string,
  expiresInSeconds = 3600,
  download?: string | boolean,
): Promise<string> {
  const storage = getStorageClient();
  const { data, error } = await storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(
      path,
      expiresInSeconds,
      download ? { download } : undefined,
    );
  if (error || !data) throw new Error(`Signed URL failed: ${error?.message}`);
  return data.signedUrl;
}

/**
 * Builds a browser-friendly download filename from a human title +
 * the object's storage path. Slugifies the title and inherits the
 * extension from the path.
 *
 *   downloadFilename("Student handbook", "parts/xyz/handbook.pdf")
 *     => "student-handbook.pdf"
 */
export function downloadFilename(title: string, storagePath: string): string {
  const ext = storagePath.match(/\.[a-z0-9]+$/i)?.[0] ?? "";
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${slug || "download"}${ext}`;
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

// ---------------------------------------------------------------------------
// Media library — a second, PUBLIC bucket for images used inside unit
// content. Objects get a permanent public URL (no expiry), so an author
// can paste the link into <img src="…"> in a Text or Embed part and it
// keeps working. Uploads go browser → Supabase directly via a signed
// upload URL, which sidesteps Vercel's 4.5 MB request-body ceiling and
// never exposes a key to the browser (the one-shot token is the auth).
// ---------------------------------------------------------------------------

export const MEDIA_BUCKET = "course-media";

/** Image types the library accepts. SVG deliberately excluded (can carry scripts). */
export const MEDIA_ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** 20 MB. Enforced client-side, in the upload-url route, and at bucket level. */
export const MEDIA_MAX_BYTES = 20 * 1024 * 1024;

/** Object names we mint: <uuid>-<slug>.<ext>. Used to validate delete requests. */
export const MEDIA_PATH_RE = /^[0-9a-f-]{36}-[a-z0-9-]{1,40}\.(jpg|png|webp|gif)$/;

export type MediaItem = {
  path: string;
  /** Human-friendly name (the original filename's slug + extension). */
  name: string;
  size: number;
  contentType: string | null;
  createdAt: string | null;
  publicUrl: string;
};

let mediaBucketEnsured: Promise<void> | null = null;

/**
 * Idempotent, memoised per server instance. Creates the public media
 * bucket on first use with type + size limits baked in at bucket level.
 */
export function ensureMediaBucket(): Promise<void> {
  if (!mediaBucketEnsured) {
    mediaBucketEnsured = (async () => {
      const storage = getStorageClient();
      const { data: buckets, error: listErr } = await storage.listBuckets();
      if (listErr) throw new Error(`List buckets failed: ${listErr.message}`);
      if (buckets.some((b) => b.name === MEDIA_BUCKET)) return;
      const { error: createErr } = await storage.createBucket(MEDIA_BUCKET, {
        public: true,
        allowedMimeTypes: Object.keys(MEDIA_ALLOWED_TYPES),
        fileSizeLimit: MEDIA_MAX_BYTES,
      });
      if (createErr) throw new Error(`Create media bucket failed: ${createErr.message}`);
    })().catch((e) => {
      mediaBucketEnsured = null; // allow a retry on the next call
      throw e;
    });
  }
  return mediaBucketEnsured;
}

/** Permanent public URL for a media object. Synchronous — no network call. */
export function mediaPublicUrl(path: string): string {
  return getStorageClient().from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Mints a one-shot signed upload URL for the browser to PUT a file to.
 * Object name is <uuid>-<slug-of-original-name>.<ext>, with the extension
 * derived from the validated content type (never from the filename), so
 * an uploaded "x.html" can't land as .html.
 */
export async function createMediaUploadUrl(
  originalName: string,
  contentType: string,
): Promise<{ signedUrl: string; path: string; publicUrl: string }> {
  const ext = MEDIA_ALLOWED_TYPES[contentType];
  if (!ext) throw new Error(`Unsupported image type: ${contentType}`);

  const base = originalName.replace(/\.[^.]+$/, "");
  const slug =
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image";
  const path = `${randomUUID()}-${slug}.${ext}`;

  const storage = getStorageClient();
  const { data, error } = await storage
    .from(MEDIA_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) {
    throw new Error(`Signed upload URL failed: ${error?.message}`);
  }
  return { signedUrl: data.signedUrl, path, publicUrl: mediaPublicUrl(path) };
}

/** Newest first. Skips folder placeholders (id === null). */
export async function listMedia(limit = 500): Promise<MediaItem[]> {
  const storage = getStorageClient();
  const { data, error } = await storage.from(MEDIA_BUCKET).list("", {
    limit,
    offset: 0,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw new Error(`List media failed: ${error.message}`);
  return (data ?? [])
    .filter((f) => f.id !== null)
    .map((f) => ({
      path: f.name,
      name: f.name.replace(/^[0-9a-f-]{36}-/, ""),
      size: Number(f.metadata?.size ?? 0),
      contentType: (f.metadata?.mimetype as string | undefined) ?? null,
      createdAt: f.created_at,
      publicUrl: mediaPublicUrl(f.name),
    }));
}

/** Best-effort delete. Swallows "not found". */
export async function deleteMedia(path: string): Promise<void> {
  const storage = getStorageClient();
  const { error } = await storage.from(MEDIA_BUCKET).remove([path]);
  if (error && !/not found/i.test(error.message)) {
    throw new Error(`Delete failed: ${error.message}`);
  }
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
