import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { partId, content, fileUrl } = (await req.json()) as {
    partId: string;
    content?: string;
    fileUrl?: string | null;
  };

  if (!partId) {
    return NextResponse.json({ error: "partId required" }, { status: 400 });
  }

  // Must submit at least text OR a file.
  if (!content?.trim() && !fileUrl) {
    return NextResponse.json(
      { error: "Please write a response or attach a file." },
      { status: 400 },
    );
  }

  const part = await prisma.part.findUnique({ where: { id: partId } });
  if (!part || part.type !== "SUBMIT") {
    return NextResponse.json({ error: "Invalid part" }, { status: 400 });
  }

  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      partId,
      content: content?.trim() ?? "",
      fileUrl: fileUrl ?? null,
    },
  });

  return NextResponse.json(submission);
}
