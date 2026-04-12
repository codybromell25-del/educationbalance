import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sectionId, completed } = await req.json();

  await prisma.progress.upsert({
    where: {
      userId_sectionId: {
        userId: session.user.id,
        sectionId,
      },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
    },
    create: {
      userId: session.user.id,
      sectionId,
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  return NextResponse.json({ success: true });
}
