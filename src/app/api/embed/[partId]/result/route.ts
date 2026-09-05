import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Records the outcome of an author-built interactive exercise (EMBED
 * part). Called by PartEmbed when the sandboxed frame posts a
 * `{ balance: "result", ... }` message.
 *
 * Body (all optional): { score: 0–100 integer, passed: boolean, payload: object ≤ 4 KB }
 * An empty body records a plain "completed" attempt.
 *
 * Trust model mirrors quiz attempts: the student's identity comes from
 * the session; the outcome comes from the author's code running in the
 * student's browser. Section visibility/unlock gating is not enforced
 * here yet — same as /api/quiz/[quizId]/attempt — and is scheduled together.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ partId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { partId } = await params;

  const body = (await req.json().catch(() => ({}))) as {
    score?: unknown;
    passed?: unknown;
    payload?: unknown;
  };
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const part = await prisma.part.findUnique({
    where: { id: partId },
    select: { id: true, type: true },
  });
  if (!part) {
    return NextResponse.json({ error: "Part not found" }, { status: 404 });
  }
  if (part.type !== "EMBED") {
    return NextResponse.json(
      { error: "Not an interactive part" },
      { status: 400 },
    );
  }

  let score: number | null = null;
  if (body.score !== undefined && body.score !== null) {
    const n = Number(body.score);
    if (!Number.isInteger(n) || n < 0 || n > 100) {
      return NextResponse.json(
        { error: "score must be a whole number from 0 to 100" },
        { status: 400 },
      );
    }
    score = n;
  }

  let passed: boolean | null = null;
  if (body.passed !== undefined && body.passed !== null) {
    if (typeof body.passed !== "boolean") {
      return NextResponse.json(
        { error: "passed must be true or false" },
        { status: 400 },
      );
    }
    passed = body.passed;
  }

  let payload: Prisma.InputJsonValue | undefined;
  if (body.payload !== undefined && body.payload !== null) {
    if (typeof body.payload !== "object" || Array.isArray(body.payload)) {
      return NextResponse.json(
        { error: "payload must be an object" },
        { status: 400 },
      );
    }
    if (JSON.stringify(body.payload).length > 4096) {
      return NextResponse.json(
        { error: "payload too large (max 4 KB)" },
        { status: 413 },
      );
    }
    payload = body.payload as Prisma.InputJsonValue;
  }

  const attempt = await prisma.embedAttempt.create({
    data: {
      userId: session.user.id,
      partId: part.id,
      score,
      passed,
      payload,
    },
  });

  return NextResponse.json({
    id: attempt.id,
    score: attempt.score,
    passed: attempt.passed,
    completedAt: attempt.completedAt.toISOString(),
  });
}
