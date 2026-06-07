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
 *   requiresPriorCompletion
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
