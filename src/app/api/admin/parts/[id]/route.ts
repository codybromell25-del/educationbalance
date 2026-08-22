import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteFile } from "@/lib/storage";
import { NextResponse } from "next/server";

/**
 * Update a Part. Body may contain any of: title, body, videoUrl,
 * fileUrl, sectionId.
 *
 * Passing sectionId moves the part into a different unit. It's placed
 * at the end of the target unit's part list; both source and target
 * unit have their part `order` values compacted afterwards so there
 * are no holes on either side.
 *
 * `type` and `order` (within the same unit) can't be changed here —
 * use the reorder endpoint for order, and delete + recreate to change
 * type.
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

  // sectionId change = move part to a different unit.
  let sourceSectionId: string | null = null;
  if (typeof body.sectionId === "string" && body.sectionId.length > 0) {
    const existing = await prisma.part.findUnique({
      where: { id },
      select: { sectionId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.sectionId !== body.sectionId) {
      // Verify target unit exists.
      const target = await prisma.section.findUnique({
        where: { id: body.sectionId },
        select: { id: true },
      });
      if (!target) {
        return NextResponse.json(
          { error: "Target unit not found" },
          { status: 400 },
        );
      }
      // Find the highest order in the target unit so we can drop the
      // moved part at the end.
      const highest = await prisma.part.aggregate({
        where: { sectionId: body.sectionId },
        _max: { order: true },
      });
      data.sectionId = body.sectionId;
      data.order = (highest._max.order ?? 0) + 1;
      sourceSectionId = existing.sectionId;
    }
  }

  const updated = await prisma.part.update({ where: { id }, data });

  // Compact source unit's order values after a move so there's no hole.
  if (sourceSectionId) {
    const remaining = await prisma.part.findMany({
      where: { sectionId: sourceSectionId },
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
  }

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
