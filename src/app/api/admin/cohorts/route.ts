import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * List every cohort — newest start-date first. Admin-only.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cohorts = await prisma.cohort.findMany({
    orderBy: [{ isArchived: "asc" }, { startDate: "desc" }],
    include: { _count: { select: { users: true } } },
  });
  return NextResponse.json({ cohorts });
}

/**
 * Create a new cohort. Requires name, slug, and startDate. Optional endDate
 * and description. Slug must be URL-safe and unique.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { name, slug, startDate, endDate, description, isActive } = body as {
    name?: string;
    slug?: string;
    startDate?: string;
    endDate?: string | null;
    description?: string | null;
    isActive?: boolean;
  };

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!slug || typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug must be lowercase letters, numbers, and hyphens only" },
      { status: 400 },
    );
  }
  if (!startDate || isNaN(new Date(startDate).getTime())) {
    return NextResponse.json(
      { error: "Valid startDate is required" },
      { status: 400 },
    );
  }
  const parsedEnd = endDate ? new Date(endDate) : null;
  if (parsedEnd && isNaN(parsedEnd.getTime())) {
    return NextResponse.json({ error: "Invalid endDate" }, { status: 400 });
  }

  try {
    const cohort = await prisma.cohort.create({
      data: {
        name: name.trim(),
        slug,
        startDate: new Date(startDate),
        endDate: parsedEnd,
        description: description?.trim() || null,
        isActive: isActive ?? true,
      },
    });
    return NextResponse.json({ cohort });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Create failed";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "A cohort with that name or slug already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
