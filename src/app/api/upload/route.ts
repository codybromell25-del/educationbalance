import { auth } from "@/lib/auth";
import { uploadFile, type StorageFolder } from "@/lib/storage";
import { NextResponse } from "next/server";

/**
 * Student-accessible file upload. Used for submission attachments and
 * hour-log evidence. Restricted to the "submissions" and "hourlogs"
 * folders — admin uploads (parts/) go through /api/admin/upload.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form-data" }, { status: 400 });
  }

  const file = form.get("file");
  const folderRaw = (form.get("folder") as string | null) ?? "submissions";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!["submissions", "hourlogs"].includes(folderRaw)) {
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
