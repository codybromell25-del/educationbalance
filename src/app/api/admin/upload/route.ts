import { auth } from "@/lib/auth";
import { uploadFile, type StorageFolder } from "@/lib/storage";
import { NextResponse } from "next/server";

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

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form-data" }, { status: 400 });
  }

  const file = form.get("file");
  const folderRaw = (form.get("folder") as string | null) ?? "parts";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!["parts", "submissions", "hourlogs"].includes(folderRaw)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  try {
    const path = await uploadFile(file, folderRaw as StorageFolder, file.name);
    return NextResponse.json({
      path,
      contentType: file.type,
      size: file.size,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
