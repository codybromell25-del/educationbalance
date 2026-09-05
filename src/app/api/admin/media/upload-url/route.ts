import { auth } from "@/lib/auth";
import {
  createMediaUploadUrl,
  ensureMediaBucket,
  MEDIA_ALLOWED_TYPES,
  MEDIA_MAX_BYTES,
} from "@/lib/storage";
import { NextResponse } from "next/server";

/**
 * Step 1 of a media-library upload. The browser sends the file's name,
 * type and size; we validate and hand back a one-shot signed URL it can
 * PUT the bytes to directly (Supabase, not Vercel — so no 4.5 MB cap).
 * The permanent public URL is returned up front so the UI can show it
 * the moment the PUT completes.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    filename?: unknown;
    contentType?: unknown;
    size?: unknown;
  } | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const filename =
    typeof body.filename === "string" && body.filename.trim()
      ? body.filename.trim().slice(0, 200)
      : "image";
  const contentType =
    typeof body.contentType === "string" ? body.contentType.toLowerCase() : "";
  const size = typeof body.size === "number" ? body.size : NaN;

  if (!MEDIA_ALLOWED_TYPES[contentType]) {
    return NextResponse.json(
      {
        error: `Only JPG, PNG, WebP and GIF images are accepted (got ${contentType || "unknown type"}).`,
      },
      { status: 400 },
    );
  }
  if (!Number.isFinite(size) || size <= 0) {
    return NextResponse.json({ error: "Invalid file size" }, { status: 400 });
  }
  if (size > MEDIA_MAX_BYTES) {
    return NextResponse.json(
      {
        error: `That image is ${(size / 1024 / 1024).toFixed(1)} MB — the limit is ${MEDIA_MAX_BYTES / 1024 / 1024} MB. Resize it and try again.`,
      },
      { status: 413 },
    );
  }

  try {
    await ensureMediaBucket();
    const result = await createMediaUploadUrl(filename, contentType);
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not prepare upload";
    console.error("[media/upload-url]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
