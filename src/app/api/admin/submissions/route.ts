import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Marks a submission reviewed, optionally with feedback for the student.
 * Body: { submissionId, feedback? }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { submissionId, feedback } = (await req.json()) as {
    submissionId: string;
    feedback?: string | null;
  };

  if (!submissionId) {
    return NextResponse.json({ error: "submissionId required" }, { status: 400 });
  }

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      reviewed: true,
      reviewedAt: new Date(),
      feedback: feedback?.trim() || null,
    },
  });

  return NextResponse.json(updated);
}
