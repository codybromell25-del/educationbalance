"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const MAX_BODY = 4000;

function trimBody(raw: FormDataEntryValue | null): string {
  return String(raw ?? "").trim().slice(0, MAX_BODY);
}

/** Top-level post. */
export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const body = trimBody(formData.get("body"));
  if (!body) return;

  await prisma.discussionPost.create({
    data: {
      authorId: session.user.id,
      body,
    },
  });
  revalidatePath("/discussion");
}

/** Reply beneath an existing top-level post. */
export async function createReply(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const body = trimBody(formData.get("body"));
  const parentId = String(formData.get("parentId") ?? "");
  if (!body || !parentId) return;

  // Enforce one-level threading: reject if the "parent" is itself a
  // reply. Cheap read against the indexed table.
  const parent = await prisma.discussionPost.findUnique({
    where: { id: parentId },
    select: { parentId: true },
  });
  if (!parent || parent.parentId !== null) return;

  await prisma.discussionPost.create({
    data: {
      authorId: session.user.id,
      parentId,
      body,
    },
  });
  revalidatePath("/discussion");
}

/**
 * Soft-delete a post/reply. Author can delete their own; admin can
 * delete anyone's. Soft delete keeps the row + child replies intact
 * so threads don't collapse when a parent is removed.
 */
export async function deletePost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const post = await prisma.discussionPost.findUnique({
    where: { id },
    select: { authorId: true, deletedAt: true },
  });
  if (!post || post.deletedAt) return;

  const isAuthor = post.authorId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isAuthor && !isAdmin) return;

  await prisma.discussionPost.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  revalidatePath("/discussion");
}
