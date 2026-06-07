import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmailAsync } from "@/lib/email";
import { submissionReviewedEmail } from "@/lib/emails/submission-reviewed";
import { NextResponse } from "next/server";

/**
 * Marks a submission reviewed, optionally with feedback for the student.
 * Body: { submissionId, feedback? }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { submissionId, feedback } = (await req.json()) as {
    submissionId: string;
    feedback?: string | null;
  };

  if (!submissionId) {
    return NextResponse.json({ error: "submissionId required" }, { status: 400 });
  }

  const trimmedFeedback = feedback?.trim() || null;

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      reviewed: true,
      reviewedAt: new Date(),
      feedback: trimmedFeedback,
    },
    include: {
      user: { select: { name: true, email: true } },
      part: {
        select: {
          title: true,
          section: { select: { title: true, slug: true } },
        },
      },
    },
  });

  // Notify student — fire and forget
  void (async () => {
    try {
      const appUrl =
        process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
      const { subject, html, text } = submissionReviewedEmail({
        studentName: updated.user.name,
        sectionTitle: updated.part.section.title,
        partTitle: updated.part.title,
        feedback: trimmedFeedback,
        appUrl,
        sectionSlug: updated.part.section.slug,
      });
      sendEmailAsync({ to: updated.user.email, subject, html, text });
    } catch (e) {
      console.error("[submission-reviewed notify] failed:", e);
    }
  })();

  return NextResponse.json(updated);
}
