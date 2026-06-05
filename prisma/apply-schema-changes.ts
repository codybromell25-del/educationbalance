/**
 * Manual migration script — applies schema changes via the runtime
 * Prisma client because the Supavisor session pooler is rejecting
 * connections from the Prisma schema engine.
 *
 * Safe to re-run: every statement uses IF NOT EXISTS / IF EXISTS guards
 * or is wrapped in a DO block that swallows duplicate-object errors.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statements: { label: string; sql: string }[] = [
  {
    label: "Create HourCategory enum",
    sql: `
      DO $$ BEGIN
        CREATE TYPE "HourCategory" AS ENUM ('OBSERVATION', 'TEACHING', 'SELF_PRACTICE');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `,
  },
  {
    label: "Section.requiresPriorCompletion",
    sql: `
      ALTER TABLE "Section"
      ADD COLUMN IF NOT EXISTS "requiresPriorCompletion" BOOLEAN NOT NULL DEFAULT true;
    `,
  },
  {
    label: "Quiz.maxAttempts",
    sql: `ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "maxAttempts" INTEGER;`,
  },
  {
    label: "Submission.fileUrl",
    sql: `ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "fileUrl" TEXT;`,
  },
  {
    label: "Submission.feedback",
    sql: `ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "feedback" TEXT;`,
  },
  {
    label: "Submission.reviewedAt",
    sql: `ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3);`,
  },
  {
    label: "Create HourLog table",
    sql: `
      CREATE TABLE IF NOT EXISTS "HourLog" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "sectionId" TEXT,
        "category" "HourCategory" NOT NULL,
        "date" TIMESTAMP(3) NOT NULL,
        "durationMinutes" INTEGER NOT NULL,
        "description" TEXT NOT NULL,
        "fileUrl" TEXT,
        "signedOffById" TEXT,
        "signedOffAt" TIMESTAMP(3),
        "feedback" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "HourLog_pkey" PRIMARY KEY ("id")
      );
    `,
  },
  {
    label: "HourLog.userId foreign key",
    sql: `
      DO $$ BEGIN
        ALTER TABLE "HourLog"
        ADD CONSTRAINT "HourLog_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `,
  },
  {
    label: "HourLog.signedOffById foreign key",
    sql: `
      DO $$ BEGIN
        ALTER TABLE "HourLog"
        ADD CONSTRAINT "HourLog_signedOffById_fkey"
        FOREIGN KEY ("signedOffById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `,
  },
  {
    label: "HourLog.sectionId foreign key",
    sql: `
      DO $$ BEGIN
        ALTER TABLE "HourLog"
        ADD CONSTRAINT "HourLog_sectionId_fkey"
        FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `,
  },
  {
    label: "HourLog userId index",
    sql: `CREATE INDEX IF NOT EXISTS "HourLog_userId_idx" ON "HourLog"("userId");`,
  },
  {
    label: "HourLog signedOffById index",
    sql: `CREATE INDEX IF NOT EXISTS "HourLog_signedOffById_idx" ON "HourLog"("signedOffById");`,
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
  console.log("\nAll schema changes applied.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
