import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Create a new Section (a.k.a. Unit). Kelly uses this to add new
 * course units from the admin editor without needing developer help.
 *
 * Body:
 *   title       (required)
 *   slug        (required, lowercase + dashes + digits only)
 *   description (required)
 *   content     (optional, HTML string, defaults to "")
 *   unlockDate  (required, ISO date string; used as fallback when a
 *                pathway-specific date isn't set)
 *
 * The `order` field is set automatically — new units land at the end
 * of the current list. Reorder via the dedicated reorder endpoint.
 *
 * Pathway visibility + per-pathway dates + prerequisite can be set
 * with the PATCH endpoint on the same section after creation, so this
 * endpoint stays focused on the required-to-exist fields.
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

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug =
    typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const description =
    typeof body.description === "string" ? body.description : "";
  const content = typeof body.content === "string" ? body.content : "";
  const unlockDateRaw =
    typeof body.unlockDate === "string" ? body.unlockDate : "";

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "slug is required and can only contain lowercase letters, numbers and dashes" },
      { status: 400 },
    );
  }
  if (!description.trim()) {
    return NextResponse.json({ error: "description is required" }, { status: 400 });
  }
  const unlockDate = new Date(unlockDateRaw);
  if (!unlockDateRaw || isNaN(unlockDate.getTime())) {
    return NextResponse.json(
      { error: "unlockDate is required (ISO date string)" },
      { status: 400 },
    );
  }

  // Assign the next order value so this unit lands at the end.
  const highest = await prisma.section.aggregate({ _max: { order: true } });
  const nextOrder = (highest._max.order ?? 0) + 1;

  try {
    const created = await prisma.section.create({
      data: {
        title,
        slug,
        description,
        content,
        unlockDate,
        order: nextOrder,
      },
    });
    return NextResponse.json({ section: created }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Create failed";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Another unit is already using that slug — pick a different one." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
