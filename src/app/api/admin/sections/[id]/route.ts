import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Update a Section's editable properties. Order is intentionally not
 * editable here — that would require swap logic across the unique
 * constraint and is a separate concern.
 *
 * Body may contain any of:
 *   title, slug, description, content, unlockDate (ISO),
 *   requiresPriorCompletion, visibleToMat, visibleToReformer,
 *   unlockDates ({MAT|REFORMER|COMPREHENSIVE: ISO}), prerequisiteId
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

  if (typeof body.title === "string") {
    if (!body.title.trim()) {
      return NextResponse.json({ error: "title cannot be empty" }, { status: 400 });
    }
    data.title = body.title.trim();
  }
  if (typeof body.slug === "string") {
    const slug = body.slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug can only contain lowercase letters, numbers, and dashes" },
        { status: 400 },
      );
    }
    data.slug = slug;
  }
  if (typeof body.description === "string") data.description = body.description;
  if (typeof body.content === "string") data.content = body.content;
  if (typeof body.unlockDate === "string") {
    const parsed = new Date(body.unlockDate);
    if (isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Invalid unlockDate" }, { status: 400 });
    }
    data.unlockDate = parsed;
  }
  if (typeof body.requiresPriorCompletion === "boolean") {
    data.requiresPriorCompletion = body.requiresPriorCompletion;
  }

  if (typeof body.visibleToMat === "boolean") {
    data.visibleToMat = body.visibleToMat;
  }
  if (typeof body.visibleToReformer === "boolean") {
    data.visibleToReformer = body.visibleToReformer;
  }

  if (body.unlockDates !== undefined) {
    // Accept null to clear, or an object like {MAT: "…", REFORMER: "…", COMPREHENSIVE: "…"}
    if (body.unlockDates === null) {
      data.unlockDates = null;
    } else if (typeof body.unlockDates === "object" && !Array.isArray(body.unlockDates)) {
      const cleaned: Record<string, string> = {};
      for (const key of ["MAT", "REFORMER", "COMPREHENSIVE"] as const) {
        const raw = (body.unlockDates as Record<string, unknown>)[key];
        if (typeof raw === "string" && raw.length > 0) {
          const parsed = new Date(raw);
          if (isNaN(parsed.getTime())) {
            return NextResponse.json(
              { error: `Invalid unlockDates.${key}` },
              { status: 400 },
            );
          }
          cleaned[key] = parsed.toISOString();
        }
      }
      data.unlockDates = Object.keys(cleaned).length > 0 ? cleaned : null;
    } else {
      return NextResponse.json({ error: "Invalid unlockDates" }, { status: 400 });
    }
  }

  if (body.prerequisiteId !== undefined) {
    // Empty string / null both clear the pointer.
    if (body.prerequisiteId === null || body.prerequisiteId === "") {
      data.prerequisiteId = null;
    } else if (typeof body.prerequisiteId === "string") {
      // Guard against self-reference.
      if (body.prerequisiteId === id) {
        return NextResponse.json(
          { error: "A unit cannot be its own prerequisite" },
          { status: 400 },
        );
      }
      // Verify the target exists and walk ITS prerequisite chain. If the
      // chain ever leads back to this unit, saving would create a loop
      // (A needs B, B needs A) that locks both units forever for every
      // student. Bounded by `seen` so a pre-existing cycle elsewhere
      // can't spin us.
      let cursor: string | null = body.prerequisiteId;
      const seen = new Set<string>();
      while (cursor) {
        if (cursor === id) {
          return NextResponse.json(
            {
              error:
                "That unit already depends on this one (directly or through other units). Choosing it would create a loop and lock both units for every student.",
            },
            { status: 400 },
          );
        }
        if (seen.has(cursor)) break;
        seen.add(cursor);
        const node: { prerequisiteId: string | null } | null =
          await prisma.section.findUnique({
            where: { id: cursor },
            select: { prerequisiteId: true },
          });
        if (!node) {
          if (cursor === body.prerequisiteId) {
            return NextResponse.json(
              { error: "Prerequisite unit not found" },
              { status: 400 },
            );
          }
          break;
        }
        cursor = node.prerequisiteId;
      }
      data.prerequisiteId = body.prerequisiteId;
    } else {
      return NextResponse.json({ error: "Invalid prerequisiteId" }, { status: 400 });
    }
  }

  try {
    const updated = await prisma.section.update({ where: { id }, data });
    return NextResponse.json({ section: updated });
  } catch (e) {
    // Most likely cause: slug uniqueness conflict.
    const msg = e instanceof Error ? e.message : "Update failed";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Another section is already using that slug." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * Delete a section. Cascades to all its parts (and their quizzes,
 * submissions, etc.), plus all Progress / Question / HourLog rows that
 * reference it. After delete, compact the remaining sections' order
 * values so there are no holes.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const section = await prisma.section.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!section) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.section.delete({ where: { id } });

  // Compact remaining sections so there are no holes in `order`.
  // Two-pass to avoid (order @unique) collisions: first push everything
  // negative, then re-set to 1..n.
  const remaining = await prisma.section.findMany({
    orderBy: { order: "asc" },
    select: { id: true },
  });
  await prisma.$transaction([
    ...remaining.map((s, i) =>
      prisma.section.update({
        where: { id: s.id },
        data: { order: -(i + 1) },
      }),
    ),
    ...remaining.map((s, i) =>
      prisma.section.update({
        where: { id: s.id },
        data: { order: i + 1 },
      }),
    ),
  ]);

  return NextResponse.json({ success: true });
}
