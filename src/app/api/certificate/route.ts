import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { renderCertificate } from "@/lib/certificate";
import { isVisibleTo } from "@/lib/access";
import { NextResponse } from "next/server";

/**
 * Download the current user's completion certificate as a PDF.
 *
 * Eligibility: every Section *visible to the student's pathway* must
 * have a completed Progress row. This matches the dashboard's own
 * "certificate ready" banner, which counts pathway-visible units only —
 * previously this route counted ALL sections, so Mat/Reformer students
 * saw the banner and then got a raw JSON 403 on click.
 *
 * The certificate's "completed date" is the latest of those completion
 * timestamps. Admins can pass ?userId=X to download any student's.
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

  // If a browser navigated here directly (the dashboard link is a plain
  // <a>), bounce back to the dashboard on failure instead of rendering
  // a JSON blob in the tab.
  const wantsHtml = req.headers.get("accept")?.includes("text/html") ?? false;
  const fail = (message: string, status: number) =>
    wantsHtml
      ? NextResponse.redirect(new URL("/dashboard", req.url))
      : NextResponse.json({ error: message }, { status });

  const [user, allSections, progressRows] = await Promise.all([
    prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true, pathway: true },
    }),
    prisma.section.findMany({
      select: { id: true, visibleToMat: true, visibleToReformer: true },
    }),
    prisma.progress.findMany({
      where: { userId: targetUserId, completed: true },
      select: { sectionId: true, completedAt: true },
    }),
  ]);

  if (!user) {
    return fail("User not found", 404);
  }

  const visibleIds = new Set(
    allSections.filter((s) => isVisibleTo(s, user.pathway)).map((s) => s.id),
  );

  if (visibleIds.size === 0) {
    return fail("No course sections exist yet.", 400);
  }

  const completedVisible = progressRows.filter((p) => visibleIds.has(p.sectionId));

  if (completedVisible.length < visibleIds.size) {
    return fail(
      `Not all sections complete yet (${completedVisible.length}/${visibleIds.size}).`,
      403,
    );
  }

  const latestCompletion = completedVisible
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
