/**
 * Cohort feature schema — adds Cohort table, User.cohortId nullable column,
 * seeds "Cohort 1 · September 2026", and backfills existing students to it.
 *
 * Non-destructive: only new tables / columns are added; existing rows are
 * only READ or UPDATED to set a previously-null cohortId. No existing
 * content is removed by this script.
 *
 * Same idempotent runtime-client DDL pattern as apply-pathway-schema.ts.
 * Safe to re-run.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statements: { label: string; sql: string }[] = [
  {
    label: "Create Cohort table",
    sql: `
      CREATE TABLE IF NOT EXISTS "Cohort" (
        "id"          TEXT        PRIMARY KEY,
        "name"        TEXT        NOT NULL UNIQUE,
        "slug"        TEXT        NOT NULL UNIQUE,
        "startDate"   TIMESTAMP(3) NOT NULL,
        "endDate"     TIMESTAMP(3),
        "isActive"    BOOLEAN     NOT NULL DEFAULT TRUE,
        "isArchived"  BOOLEAN     NOT NULL DEFAULT FALSE,
        "description" TEXT,
        "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    label: "Cohort.isActive index",
    sql: `CREATE INDEX IF NOT EXISTS "Cohort_isActive_idx" ON "Cohort"("isActive");`,
  },
  {
    label: "User.cohortId column",
    sql: `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "cohortId" TEXT;`,
  },
  {
    label: "User.cohortId index",
    sql: `CREATE INDEX IF NOT EXISTS "User_cohortId_idx" ON "User"("cohortId");`,
  },
  {
    label: "User.cohortId → Cohort FK (SetNull on delete)",
    sql: `
      DO $$ BEGIN
        ALTER TABLE "User"
        ADD CONSTRAINT "User_cohortId_fkey"
        FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `,
  },
  {
    label: "Seed Cohort 1 · September 2026",
    // Uses a fixed cuid-shape id so we can rely on it in the backfill,
    // and ON CONFLICT DO NOTHING so re-running the script is safe.
    sql: `
      INSERT INTO "Cohort" ("id", "name", "slug", "startDate", "isActive", "createdAt", "updatedAt")
      VALUES (
        'clbalancecohort1seed00001',
        'Cohort 1 · September 2026',
        'cohort-1',
        '2026-09-11T00:00:00Z',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (slug) DO NOTHING;
    `,
  },
  {
    label: "Backfill existing students to Cohort 1",
    // Only updates USER-role rows that don't already have a cohort assigned.
    // Staff (ADMIN/ENQUIRIES) stay cohort-null — they don't belong to any cohort.
    sql: `
      UPDATE "User"
      SET "cohortId" = (SELECT "id" FROM "Cohort" WHERE "slug" = 'cohort-1')
      WHERE "cohortId" IS NULL AND "role" = 'USER';
    `,
  },
];

async function main() {
  for (const { label, sql } of statements) {
    try {
      const result = await prisma.$executeRawUnsafe(sql);
      // For UPDATE statements the return is the row count, useful to see.
      const rowInfo = typeof result === "number" && result > 0 ? ` (${result} rows)` : "";
      console.log(`✓ ${label}${rowInfo}`);
    } catch (e) {
      console.error(`✗ ${label}:`, e);
      throw e;
    }
  }
  const students = await prisma.user.count({ where: { role: "USER" } });
  const inCohort1 = await prisma.user.count({
    where: { role: "USER", cohort: { slug: "cohort-1" } },
  });
  console.log(`\nCohort schema applied. ${inCohort1}/${students} students assigned to Cohort 1.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
