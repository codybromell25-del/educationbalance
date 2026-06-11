import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadFile, deleteFile } from "@/lib/storage";
import { SECTION_REGISTRY } from "@/lib/landing/config";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/** All known asset slots (flattened across every section). */
function allowedSlots(): Set<string> {
  const set = new Set<string>();
  for (const cfg of Object.values(SECTION_REGISTRY)) {
    for (const s of cfg.assetSlots) set.add(s.key);
  }
  return set;
}

/**
 * Upload a new image for a landing slot. Replaces any existing
 * assignment and deletes the previous storage object so we don't
 * accumulate orphans.
 *
 * Multipart form-data: { file: <binary> }
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slot: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slot } = await params;

  if (!allowedSlots().has(slot)) {
    return NextResponse.json({ error: "Unknown slot" }, { status: 404 });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
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
    return NextResponse.json(
      { error: `Could not parse upload: ${msg}` },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  try {
    const existing = await prisma.landingAsset.findUnique({ where: { slot } });
    const newPath = await uploadFile(file, "landing", file.name);

    await prisma.landingAsset.upsert({
      where: { slot },
      update: { imagePath: newPath },
      create: { slot, imagePath: newPath },
    });

    // Best-effort cleanup of old object
    if (existing?.imagePath && existing.imagePath !== newPath) {
      await deleteFile(existing.imagePath).catch(() => {});
    }

    revalidatePath("/");
    return NextResponse.json({ slot, path: newPath });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    console.error(`[landing upload] ${slot}:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * Reset a slot to its registered fallback by deleting the LandingAsset
 * row and the underlying storage object.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slot: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slot } = await params;

  const existing = await prisma.landingAsset.findUnique({ where: { slot } });
  if (!existing) {
    return NextResponse.json({ success: true });
  }

  if (existing.imagePath) {
    await deleteFile(existing.imagePath).catch(() => {});
  }
  await prisma.landingAsset.delete({ where: { slot } });

  revalidatePath("/");
  return NextResponse.json({ success: true });
}
