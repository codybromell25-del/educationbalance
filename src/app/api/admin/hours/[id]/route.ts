import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Sign off (or un-sign) an hour log. Admin only.
 * Body: { signOff: boolean, feedback?: string }
 */
export async function POST(
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
  const { signOff, feedback } = body as {
    signOff: boolean;
    feedback?: string | null;
  };

  const updated = await prisma.hourLog.update({
    where: { id },
    data: signOff
      ? {
          signedOffById: session.user.id,
          signedOffAt: new Date(),
          feedback: feedback?.trim() || null,
        }
      : {
          signedOffById: null,
          signedOffAt: null,
          feedback: null,
        },
  });

  return NextResponse.json({ hourLog: updated });
}
