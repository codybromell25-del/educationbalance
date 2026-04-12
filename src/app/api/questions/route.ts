import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sectionId, message } = await req.json();

  const question = await prisma.question.create({
    data: {
      userId: session.user.id,
      sectionId,
      message,
    },
  });

  return NextResponse.json(question);
}
