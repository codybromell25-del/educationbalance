import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteFile } from "@/lib/storage";
import { NextResponse } from "next/server";

/**
 * Delete an hour log. Students can only delete their own logs and only
 * before they're signed off.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const log = await prisma.hourLog.findUnique({
    where: { id },
    select: { userId: true, signedOffAt: true, fileUrl: true },
  });
  if (!log) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (log.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (log.signedOffAt && session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Can't delete a signed-off log" },
      { status: 403 },
    );
  }

  if (log.fileUrl && !log.fileUrl.startsWith("http")) {
    await deleteFile(log.fileUrl).catch(() => {});
  }
  await prisma.hourLog.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
