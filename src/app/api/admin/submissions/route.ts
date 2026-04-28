import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { submissionId } = (await req.json()) as { submissionId: string };

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: { reviewed: true },
  });

  return NextResponse.json(updated);
}
