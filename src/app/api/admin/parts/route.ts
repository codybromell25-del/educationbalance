import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PartType } from "@prisma/client";
import { NextResponse } from "next/server";

const VALID_TYPES: PartType[] = [
  PartType.TEXT,
  PartType.VIDEO,
  PartType.DOWNLOAD,
  PartType.QUIZ,
  PartType.SUBMIT,
];

/**
 * Creates a new Part at the next available order in a section.
 * Body: { sectionId, title, type, body?, videoUrl?, fileUrl? }
 * If type === "QUIZ", also creates an empty Quiz row.
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

  const { sectionId, title, type, body: partBody, videoUrl, fileUrl } = body;

  if (!sectionId || typeof sectionId !== "string") {
    return NextResponse.json({ error: "sectionId required" }, { status: 400 });
  }
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    select: { id: true },
  });
  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  const maxOrder = await prisma.part.aggregate({
    where: { sectionId },
    _max: { order: true },
  });
  const nextOrder = (maxOrder._max.order ?? 0) + 1;

  const created = await prisma.part.create({
    data: {
      sectionId,
      order: nextOrder,
      title,
      type,
      body: partBody ?? null,
      videoUrl: videoUrl ?? null,
      fileUrl: fileUrl ?? null,
    },
  });

  if (type === PartType.QUIZ) {
    await prisma.quiz.create({
      data: { partId: created.id, passingScore: 70 },
    });
  }

  return NextResponse.json({ part: created });
}
