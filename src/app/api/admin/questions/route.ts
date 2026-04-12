import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { questionId, response } = await req.json();

  await prisma.question.update({
    where: { id: questionId },
    data: {
      response,
      respondedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
