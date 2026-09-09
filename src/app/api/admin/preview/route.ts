import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PREVIEW_COOKIE, PREVIEW_MAX_AGE, isPathway } from "@/lib/preview";

/**
 * Turn admin "preview as student" on (POST { pathway }) or off (DELETE).
 * Cookies can only be set from a Route Handler or Server Function in
 * Next 16, hence this endpoint. ADMIN only — ENQUIRIES can't preview.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as { pathway?: unknown } | null;
  if (!body || !isPathway(body.pathway)) {
    return NextResponse.json(
      { error: "pathway must be MAT, REFORMER or COMPREHENSIVE" },
      { status: 400 },
    );
  }
  (await cookies()).set(PREVIEW_COOKIE, body.pathway, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PREVIEW_MAX_AGE,
  });
  return NextResponse.json({ ok: true, pathway: body.pathway });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  (await cookies()).delete(PREVIEW_COOKIE);
  return NextResponse.json({ ok: true });
}
