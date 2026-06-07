import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmailAsync } from "@/lib/email";
import { hoursSignedOffEmail } from "@/lib/emails/hours-signed-off";
import { NextResponse } from "next/server";

/**
 * Sign off (or un-sign) an hour log. Admin only.
 * Body: { signOff: boolean, feedback?: string }
 *
 * On sign-off (not revoke), emails the student a notification.
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

  const trimmedFeedback = feedback?.trim() || null;

  const updated = await prisma.hourLog.update({
    where: { id },
    data: signOff
      ? {
          signedOffById: session.user.id,
          signedOffAt: new Date(),
          feedback: trimmedFeedback,
        }
      : {
          signedOffById: null,
          signedOffAt: null,
          feedback: null,
        },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  // Email the student on sign-off (not on revoke)
  if (signOff) {
    void (async () => {
      try {
        const appUrl =
          process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
        const { subject, html, text } = hoursSignedOffEmail({
          studentName: updated.user.name,
          category: updated.category,
          dateISO: updated.date.toISOString(),
          durationMinutes: updated.durationMinutes,
          feedback: trimmedFeedback,
          appUrl,
        });
        sendEmailAsync({ to: updated.user.email, subject, html, text });
      } catch (e) {
        console.error("[hours-signed-off notify] failed:", e);
      }
    })();
  }

  return NextResponse.json({ hourLog: updated });
}
