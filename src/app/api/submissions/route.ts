import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { partId, content } = (await req.json()) as {
    partId: string;
    content: string;
  };

  if (!partId || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const part = await prisma.part.findUnique({ where: { id: partId } });
  if (!part || part.type !== "SUBMIT") {
    return NextResponse.json({ error: "Invalid part" }, { status: 400 });
  }

  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      partId,
      content: content.trim(),
    },
  });

  return NextResponse.json(submission);
}
