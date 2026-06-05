import { prisma } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

const MIN_PASSWORD_LENGTH = 8;

/**
 * Consume a password-reset token and set the new password.
 * Body: { token, newPassword }
 *
 * Token must exist, not be expired, and not have been used. After a
 * successful reset, the token is marked used and all other outstanding
 * tokens for that user are invalidated (so a second email can't be
 * replayed).
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (
    !body ||
    typeof body.token !== "string" ||
    typeof body.newPassword !== "string"
  ) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { token, newPassword } = body;

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 },
    );
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: { select: { id: true } } },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Request a new one." },
      { status: 400 },
    );
  }

  const passwordHash = await bcryptjs.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.user.id },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    // Invalidate any other live tokens for this user
    prisma.passwordResetToken.updateMany({
      where: {
        userId: record.user.id,
        usedAt: null,
        id: { not: record.id },
      },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ success: true });
}
