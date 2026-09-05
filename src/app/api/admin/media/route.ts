import { auth } from "@/lib/auth";
import { deleteMedia, MEDIA_PATH_RE } from "@/lib/storage";
import { NextResponse } from "next/server";

/**
 * Delete one media-library object. `?path=<uuid>-<slug>.<ext>`.
 * The path must match the exact shape we mint, so this can't be pointed
 * at anything outside the media bucket's flat namespace.
 *
 * Note: deleting an image that a unit still references will break that
 * <img> — the UI confirm says so. There's no reference tracking (images
 * live inside free-form HTML), so this is on the author.
 */
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = new URL(req.url).searchParams.get("path") ?? "";
  if (!MEDIA_PATH_RE.test(path)) {
    return NextResponse.json({ error: "Invalid media path" }, { status: 400 });
  }

  try {
    await deleteMedia(path);
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    console.error("[media/delete]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
