import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SECTION_REGISTRY, type SectionKey } from "@/lib/landing/config";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Upsert the template + content for a landing section. Validates the
 * section key and template id; the content shape itself is trusted to
 * be correct (the admin UI hard-codes the field set per section).
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { section } = await params;

  if (!(section in SECTION_REGISTRY)) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { template, content } = body as {
    template: string;
    content: unknown;
  };

  const cfg = SECTION_REGISTRY[section as SectionKey];
  if (!cfg.templates.some((t) => t.id === template)) {
    return NextResponse.json(
      {
        error: `Unknown template "${template}" for section "${section}".`,
      },
      { status: 400 },
    );
  }
  if (!content || typeof content !== "object") {
    return NextResponse.json({ error: "content required" }, { status: 400 });
  }

  const updated = await prisma.landingSection.upsert({
    where: { section },
    update: {
      template,
      content: content as object,
    },
    create: {
      section,
      template,
      content: content as object,
    },
  });

  // Invalidate the public landing page cache so the new state shows up
  revalidatePath("/");

  return NextResponse.json({ section: updated });
}
