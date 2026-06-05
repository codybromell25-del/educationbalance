import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { HourCategory } from "@prisma/client";
import { NextResponse } from "next/server";

const VALID_CATEGORIES: HourCategory[] = [
  HourCategory.OBSERVATION,
  HourCategory.TEACHING,
  HourCategory.SELF_PRACTICE,
];

/**
 * Create an hour log for the current student.
 * Body: { category, date (ISO), durationMinutes, description, fileUrl? }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { category, date, durationMinutes, description, fileUrl } = body as {
    category: HourCategory;
    date: string;
    durationMinutes: number;
    description: string;
    fileUrl?: string | null;
  };

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "invalid category" }, { status: 400 });
  }
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return NextResponse.json({ error: "invalid date" }, { status: 400 });
  }
  if (
    !Number.isFinite(durationMinutes) ||
    durationMinutes <= 0 ||
    durationMinutes > 24 * 60
  ) {
    return NextResponse.json(
      { error: "durationMinutes must be 1–1440" },
      { status: 400 },
    );
  }
  if (!description?.trim()) {
    return NextResponse.json({ error: "description required" }, { status: 400 });
  }

  const created = await prisma.hourLog.create({
    data: {
      userId: session.user.id,
      category,
      date: parsedDate,
      durationMinutes: Math.round(durationMinutes),
      description: description.trim(),
      fileUrl: fileUrl ?? null,
    },
  });

  return NextResponse.json({ hourLog: created });
}
