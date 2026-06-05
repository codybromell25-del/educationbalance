import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteFile } from "@/lib/storage";
import { NextResponse } from "next/server";

/**
 * Update a Part. Body may contain any of: title, body, videoUrl, fileUrl.
 * Note: `type` and `order` cannot be changed here — use the reorder
 * endpoint for order, and delete + recreate to change type.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.body === "string" || body.body === null) data.body = body.body;
  if (typeof body.videoUrl === "string" || body.videoUrl === null)
    data.videoUrl = body.videoUrl;
  if (typeof body.fileUrl === "string" || body.fileUrl === null)
    data.fileUrl = body.fileUrl;

  // If swapping fileUrl, delete the old object from storage to avoid orphans
  if ("fileUrl" in data) {
    const existing = await prisma.part.findUnique({
      where: { id },
      select: { fileUrl: true },
    });
    if (
      existing?.fileUrl &&
      existing.fileUrl !== data.fileUrl &&
      !existing.fileUrl.startsWith("http")
    ) {
      // Storage paths don't start with http; only delete those.
      await deleteFile(existing.fileUrl).catch(() => {});
    }
  }

  const updated = await prisma.part.update({ where: { id }, data });
  return NextResponse.json({ part: updated });
}

/** Delete a Part. Also deletes its storage object (if any) and cascades quiz. */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const part = await prisma.part.findUnique({
    where: { id },
    select: { fileUrl: true, sectionId: true, order: true },
  });
  if (!part) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (part.fileUrl && !part.fileUrl.startsWith("http")) {
    await deleteFile(part.fileUrl).catch(() => {});
  }

  await prisma.part.delete({ where: { id } });

  // Compact the remaining parts' order values so there are no holes
  const remaining = await prisma.part.findMany({
    where: { sectionId: part.sectionId },
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });
  await Promise.all(
    remaining.map((p, i) =>
      p.order === i + 1
        ? Promise.resolve()
        : prisma.part.update({ where: { id: p.id }, data: { order: i + 1 } }),
    ),
  );

  return NextResponse.json({ success: true });
}
