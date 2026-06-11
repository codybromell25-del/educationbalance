import { prisma } from "@/lib/db";
import { sendEmailAsync } from "@/lib/email";
import { applicationReceivedEmail } from "@/lib/emails/application-received";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { name, email, pathway, notes } = body as {
    name: string;
    email: string;
    pathway: string;
    notes?: string;
  };

  if (!name?.trim() || !email?.trim() || !pathway?.trim()) {
    return NextResponse.json(
      { error: "Name, email and pathway are required" },
      { status: 400 },
    );
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const trimmedNotes = notes?.trim() || null;

  const created = await prisma.application.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      pathway: pathway.trim(),
      notes: trimmedNotes,
    },
  });

  // Notify admins (fire-and-forget — never fail the applicant's submit)
  void (async () => {
    try {
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { email: true },
      });
      if (admins.length === 0) return;
      const appUrl =
        process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
      const { subject, html, text } = applicationReceivedEmail({
        applicantName: created.name,
        applicantEmail: created.email,
        pathway: created.pathway,
        notes: created.notes,
        appUrl,
      });
      sendEmailAsync({
        to: admins.map((a) => a.email),
        subject,
        html,
        text,
        replyTo: created.email,
      });
    } catch (e) {
      console.error("[application notify] failed:", e);
    }
  })();

  return NextResponse.json({ success: true });
}
