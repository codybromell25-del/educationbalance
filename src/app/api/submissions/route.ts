import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sendEmailAsync } from "@/lib/email";
import { submissionReceivedEmail } from "@/lib/emails/submission-received";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { partId, content, fileUrl } = (await req.json()) as {
    partId: string;
    content?: string;
    fileUrl?: string | null;
  };

  if (!partId) {
    return NextResponse.json({ error: "partId required" }, { status: 400 });
  }

  // Must submit at least text OR a file.
  if (!content?.trim() && !fileUrl) {
    return NextResponse.json(
      { error: "Please write a response or attach a file." },
      { status: 400 },
    );
  }

  const part = await prisma.part.findUnique({
    where: { id: partId },
    include: { section: { select: { title: true } } },
  });
  if (!part || part.type !== "SUBMIT") {
    return NextResponse.json({ error: "Invalid part" }, { status: 400 });
  }

  const trimmedContent = content?.trim() ?? "";
  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      partId,
      content: trimmedContent,
      fileUrl: fileUrl ?? null,
    },
  });

  // Notify admins — fire and forget so a Resend hiccup never fails the submit
  void (async () => {
    try {
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { email: true },
      });
      if (admins.length === 0) return;

      const appUrl =
        process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

      const { subject, html, text } = submissionReceivedEmail({
        studentName: session.user.name,
        studentEmail: session.user.email ?? "",
        sectionTitle: part.section.title,
        partTitle: part.title,
        hasFile: !!fileUrl,
        contentPreview: trimmedContent ? trimmedContent.slice(0, 280) : null,
        appUrl,
      });

      sendEmailAsync({
        to: admins.map((a) => a.email),
        subject,
        html,
        text,
        replyTo: session.user.email ?? undefined,
      });
    } catch (e) {
      console.error("[submission-received notify] failed:", e);
    }
  })();

  return NextResponse.json(submission);
}
