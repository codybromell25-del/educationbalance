import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmailAsync } from "@/lib/email";
import { welcomeEmail } from "@/lib/emails/welcome";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, password, pathway } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  // Pathway is required for student accounts so per-pathway visibility
  // + unlock dates can be applied. Accept one of the three enum values.
  const VALID_PATHWAYS = ["MAT", "REFORMER", "COMPREHENSIVE"] as const;
  if (!pathway || !VALID_PATHWAYS.includes(pathway)) {
    return NextResponse.json(
      { error: "Pathway is required (MAT, REFORMER, or COMPREHENSIVE)" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 400 }
    );
  }

  const passwordHash = await bcryptjs.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "USER", pathway },
  });

  // Send welcome email with login credentials — fire and forget
  void (async () => {
    try {
      const appUrl =
        process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
      const { subject, html, text } = welcomeEmail({
        recipientName: name,
        recipientEmail: email,
        temporaryPassword: password,
        appUrl,
      });
      sendEmailAsync({ to: email, subject, html, text });
    } catch (e) {
      console.error("[welcome email] failed:", e);
    }
  })();

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}
