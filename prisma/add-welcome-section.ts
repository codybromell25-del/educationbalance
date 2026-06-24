/**
 * Inserts a new "Course Welcome and Orientation" section at order 1
 * and shifts every existing section down by one (Foundations of
 * Pilates becomes order 2, etc.).
 *
 * Also creates 5 placeholder TEXT parts inside the new section:
 *   1. Welcome to the course
 *   2. How to use this LMS
 *   3. Student handbook
 *   4. Course calendar
 *   5. Safety non-negotiables
 *
 * Idempotent — if a section with slug "welcome-and-orientation" already
 * exists, the script exits without changing anything.
 *
 * Run: node --env-file=.env --import tsx prisma/add-welcome-section.ts
 */
import { PrismaClient, PartType } from "@prisma/client";

const prisma = new PrismaClient();

const WELCOME_SLUG = "welcome-and-orientation";

const WELCOME_PARTS = [
  "Welcome to the course",
  "How to use this LMS",
  "Student handbook",
  "Course calendar",
  "Safety non-negotiables",
];

async function main() {
  // Idempotency guard
  const existing = await prisma.section.findUnique({
    where: { slug: WELCOME_SLUG },
  });
  if (existing) {
    console.log(
      `Section "${WELCOME_SLUG}" already exists at order ${existing.order}. Nothing to do.`,
    );
    return;
  }

  // Shift every existing section down by one. `order` is @unique so we
  // can't bump in place — do a two-pass transaction via negative
  // temporary values.
  const sections = await prisma.section.findMany({
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });

  if (sections.length > 0) {
    await prisma.$transaction([
      // Park each at -(currentOrder)
      ...sections.map((s) =>
        prisma.section.update({
          where: { id: s.id },
          data: { order: -s.order },
        }),
      ),
      // Place each at currentOrder + 1
      ...sections.map((s) =>
        prisma.section.update({
          where: { id: s.id },
          data: { order: s.order + 1 },
        }),
      ),
    ]);
    console.log(`✓ Shifted ${sections.length} existing sections down by 1.`);
  }

  // Create the new section at order 1.
  const newSection = await prisma.section.create({
    data: {
      title: "Course Welcome and Orientation",
      slug: WELCOME_SLUG,
      description:
        "Start here. Orientation, handbook, calendar, and the studio's safety non-negotiables before the course begins.",
      content: "<p><em>Section overview coming soon.</em></p>",
      order: 1,
      // Unlock immediately — orientation should be available the
      // moment a student logs in.
      unlockDate: new Date(),
      // No prerequisite (it's the first section anyway).
      requiresPriorCompletion: false,
    },
  });
  console.log(`✓ Created section "${newSection.title}" (id ${newSection.id}).`);

  // Create 5 placeholder TEXT parts.
  for (let i = 0; i < WELCOME_PARTS.length; i++) {
    await prisma.part.create({
      data: {
        sectionId: newSection.id,
        order: i + 1,
        title: WELCOME_PARTS[i],
        type: PartType.TEXT,
        body: "<p><em>Content coming soon.</em></p>",
      },
    });
  }
  console.log(`✓ Created ${WELCOME_PARTS.length} parts.`);

  console.log(
    "\nDone. Section is editable at /admin/sections/{id} like any other.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
