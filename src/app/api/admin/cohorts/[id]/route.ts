import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Update a cohort — rename, change dates, toggle active/archived flags,
 * edit description. Slug is intentionally NOT editable after creation to
 * keep any bookmarked filter URLs stable.
 *
 * Non-destructive: archiving does not delete anything. Users retain their
 * cohortId; admin views can hide archived cohorts by default.
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
  if (typeof body.name === "string") {
    if (!body.name.trim()) {
      return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
    }
    data.name = body.name.trim();
  }
  if (body.startDate !== undefined) {
    const d = new Date(body.startDate);
    if (isNaN(d.getTime())) {
      return NextResponse.json({ error: "Invalid startDate" }, { status: 400 });
    }
    data.startDate = d;
  }
  if (body.endDate !== undefined) {
    if (body.endDate === null || body.endDate === "") {
      data.endDate = null;
    } else {
      const d = new Date(body.endDate);
      if (isNaN(d.getTime())) {
        return NextResponse.json({ error: "Invalid endDate" }, { status: 400 });
      }
      data.endDate = d;
    }
  }
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (typeof body.isArchived === "boolean") data.isArchived = body.isArchived;
  if (body.description !== undefined) {
    data.description = body.description ? String(body.description).trim() : null;
  }

  try {
    const cohort = await prisma.cohort.update({ where: { id }, data });
    return NextResponse.json({ cohort });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "A cohort with that name already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
