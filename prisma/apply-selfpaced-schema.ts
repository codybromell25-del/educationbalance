/**
 * Self-paced students — adds User.selfPaced (default false) and seeds a
 * "Staff" cohort for self-paced staff accounts so they don't skew
 * Cohort 1's numbers.
 *
 * A self-paced student ignores unit unlock DATES only. Pathway
 * visibility and the "finish the previous unit first" chain still apply,
 * so units open one after another as they complete them.
 *
 * Purely additive: one new column with a default, one new cohort row
 * (ON CONFLICT DO NOTHING). No existing row is modified. Idempotent.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statements: { label: string; sql: string }[] = [
  {
    label: "User.selfPaced column (default false)",
    sql: `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "selfPaced" BOOLEAN NOT NULL DEFAULT false;`,
  },
  {
    label: "Seed 'Staff' cohort",
    sql: `
      INSERT INTO "Cohort" ("id", "name", "slug", "startDate", "isActive", "description", "createdAt", "updatedAt")
      VALUES (
        'clbalancecohortstaff00001',
        'Staff · self-paced',
        'staff',
        CURRENT_TIMESTAMP,
        TRUE,
        'Staff and tutors working through the course at their own pace. Kept separate so they don''t affect cohort statistics.',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (slug) DO NOTHING;
    `,
  },
];

async function main() {
  for (const { label, sql } of statements) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log(`✓ ${label}`);
    } catch (e) {
      console.error(`✗ ${label}:`, e);
      throw e;
    }
  }
  const staff = await prisma.cohort.findUnique({ where: { slug: "staff" } });
  const selfPacedCount = await prisma.user.count({ where: { selfPaced: true } });
  console.log(`\nSelf-paced schema applied. Staff cohort: ${staff?.name} (${staff?.id}). Self-paced users right now: ${selfPacedCount}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
