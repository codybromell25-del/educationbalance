import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/** Update quiz settings (passingScore, maxAttempts). */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (typeof body.passingScore === "number") {
    if (body.passingScore < 0 || body.passingScore > 100) {
      return NextResponse.json(
        { error: "passingScore must be 0–100" },
        { status: 400 },
      );
    }
    data.passingScore = body.passingScore;
  }
  if (
    body.maxAttempts === null ||
    (typeof body.maxAttempts === "number" && body.maxAttempts >= 1)
  ) {
    data.maxAttempts = body.maxAttempts;
  }

  const updated = await prisma.quiz.update({ where: { id }, data });
  return NextResponse.json({ quiz: updated });
}
