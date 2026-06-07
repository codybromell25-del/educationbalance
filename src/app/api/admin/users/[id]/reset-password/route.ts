import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmailAsync } from "@/lib/email";
import { welcomeEmail } from "@/lib/emails/welcome";
import bcryptjs from "bcryptjs";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

/**
 * Admin-initiated password reset. Generates a new temporary password,
 * updates the user's hash, and emails them the new credentials (reusing
 * the welcome email template so the format is consistent).
 *
 * Use case: student locked themselves out and can't / won't go through
 * the self-serve forgot-password flow.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Generate a memorable-ish 12-char temporary password
  const temporaryPassword = randomBytes(9).toString("base64").replace(/[+/=]/g, "");
  const passwordHash = await bcryptjs.hash(temporaryPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  // Invalidate any outstanding self-serve reset tokens too
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  // Email the user the new temp password
  const appUrl =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  const { subject, html, text } = welcomeEmail({
    recipientName: user.name,
    recipientEmail: user.email,
    temporaryPassword,
    appUrl,
  });
  sendEmailAsync({ to: user.email, subject, html, text });

  return NextResponse.json({ success: true, temporaryPassword });
}
