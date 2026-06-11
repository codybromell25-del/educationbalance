import { auth } from "@/lib/auth";
import { uploadFile, type StorageFolder } from "@/lib/storage";
import { NextResponse } from "next/server";

// Force Node runtime (Supabase SDK needs Node), give large uploads 60s
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Admin-only file upload. Accepts multipart form-data with:
 *   - file: the binary
 *   - folder: "parts" | "submissions" | "hourlogs" (defaults to "parts")
 *
 * Returns { path, contentType, size } — the path is what you store in
 * Part.fileUrl / Submission.fileUrl / HourLog.fileUrl.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Quick env-var sanity check up front so the error is meaningful
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[upload] env vars missing", {
      hasUrl: !!process.env.SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    return NextResponse.json(
      {
        error:
          "Storage not configured on the server. Restart the dev server after editing .env.",
      },
      { status: 500 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not parse upload";
    console.error("[upload] formData parse failed:", msg);
    return NextResponse.json(
      { error: `Could not parse upload: ${msg}` },
      { status: 400 },
    );
  }

  const file = form.get("file");
  const folderRaw = (form.get("folder") as string | null) ?? "parts";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!["parts", "submissions", "hourlogs"].includes(folderRaw)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  console.log(
    `[upload] ${session.user.email} → ${folderRaw}/ "${file.name}" (${file.size} bytes, ${file.type || "no type"})`,
  );

  try {
    const path = await uploadFile(file, folderRaw as StorageFolder, file.name);
    console.log(`[upload] success: ${path}`);
    return NextResponse.json({
      path,
      contentType: file.type,
      size: file.size,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    console.error(`[upload] storage error: ${msg}`);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
