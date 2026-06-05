import { prisma } from "@/lib/db";
import { sendEmailAsync } from "@/lib/email";
import { passwordResetEmail } from "@/lib/emails/password-reset";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

const TOKEN_TTL_MINUTES = 60;

/**
 * Request a password-reset email.
 *
 * Always returns 200 regardless of whether the email exists, to prevent
 * an attacker from enumerating registered users. The email is only sent
 * if the user actually exists.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.email !== "string") {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();

  // Always pretend to succeed — fire the actual lookup async.
  void (async () => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true },
      });
      if (!user) return; // silent no-op

      // Generate token + persist
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000);
      await prisma.passwordResetToken.create({
        data: { userId: user.id, token, expiresAt },
      });

      const appUrl =
        process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
      const resetUrl = `${appUrl}/reset-password/${token}`;

      const { subject, html, text } = passwordResetEmail({
        recipientName: user.name,
        resetUrl,
        expiresInMinutes: TOKEN_TTL_MINUTES,
      });

      sendEmailAsync({ to: user.email, subject, html, text });
    } catch (e) {
      console.error("[forgot-password] failed:", e);
    }
  })();

  return NextResponse.json({ success: true });
}
