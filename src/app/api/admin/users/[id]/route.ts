import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/** Update a user's name or email. Role is locked to USER from the UI. */
export async function PATCH(
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

  const data: Record<string, unknown> = {};
  if (typeof body.name === "string") {
    if (!body.name.trim()) {
      return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
    }
    data.name = body.name.trim();
  }
  if (typeof body.email === "string") {
    const email = body.email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    data.email = email;
  }

  try {
    const updated = await prisma.user.update({ where: { id }, data });
    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Another user is already using that email." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * Delete a user. Cascades to delete all their progress, submissions,
 * quiz attempts, hour logs, etc. Admin can't delete themselves.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "You can't delete your own admin account here." },
      { status: 400 },
    );
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
