import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { renderCertificate } from "@/lib/certificate";
import { NextResponse } from "next/server";

/**
 * Download the current user's completion certificate as a PDF.
 *
 * Eligibility: every Section in the course must have a completed
 * Progress row for the student. The certificate's "completed date" is
 * the latest of those completion timestamps.
 *
 * Admins can pass ?userId=X to download any student's certificate.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const requestedUserId = url.searchParams.get("userId");
  const targetUserId =
    requestedUserId && session.user.role === "ADMIN"
      ? requestedUserId
      : session.user.id;

  const [user, totalSections, progressRows] = await Promise.all([
    prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true },
    }),
    prisma.section.count(),
    prisma.progress.findMany({
      where: { userId: targetUserId, completed: true },
      select: { sectionId: true, completedAt: true },
    }),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (totalSections === 0) {
    return NextResponse.json(
      { error: "No course sections exist yet." },
      { status: 400 },
    );
  }

  if (progressRows.length < totalSections) {
    return NextResponse.json(
      {
        error: `Not all sections complete yet (${progressRows.length}/${totalSections}).`,
      },
      { status: 403 },
    );
  }

  const latestCompletion = progressRows
    .map((p) => p.completedAt ?? new Date(0))
    .reduce((latest, d) => (d > latest ? d : latest), new Date(0));

  // Stable, recognisable cert id — encode user + completion date
  const certificateId = `BAL-${user.id.slice(-8).toUpperCase()}-${latestCompletion.getFullYear()}`;

  const pdf = await renderCertificate({
    studentName: user.name,
    completedDate: latestCompletion,
    certificateId,
  });

  // Buffer is fine at runtime; cast to Uint8Array for NextResponse's BodyInit type
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="balance-certificate-${user.name.replace(/\s+/g, "-").toLowerCase()}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
