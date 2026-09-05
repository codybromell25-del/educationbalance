/**
 * Embed part schema — adds the EMBED value to the PartType enum and the
 * EmbedAttempt table that records outcomes reported by author-built
 * interactive exercises.
 *
 * Purely additive: a new enum value and a new empty table. No existing
 * row, column, or table is touched. Same idempotent runtime-client DDL
 * pattern as apply-pathway-schema.ts / apply-cohort-schema.ts. Safe to
 * re-run.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statements: { label: string; sql: string }[] = [
  {
    label: "PartType.EMBED enum value",
    // ADD VALUE can't run inside a transaction block; $executeRawUnsafe
    // issues it as a standalone statement, which is what Postgres wants.
    sql: `ALTER TYPE "PartType" ADD VALUE IF NOT EXISTS 'EMBED';`,
  },
  {
    label: "Create EmbedAttempt table",
    sql: `
      CREATE TABLE IF NOT EXISTS "EmbedAttempt" (
        "id"          TEXT         PRIMARY KEY,
        "userId"      TEXT         NOT NULL,
        "partId"      TEXT         NOT NULL,
        "score"       INTEGER,
        "passed"      BOOLEAN,
        "payload"     JSONB,
        "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    label: "EmbedAttempt.userId → User FK (Cascade)",
    sql: `
      DO $$ BEGIN
        ALTER TABLE "EmbedAttempt"
        ADD CONSTRAINT "EmbedAttempt_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `,
  },
  {
    label: "EmbedAttempt.partId → Part FK (Cascade)",
    sql: `
      DO $$ BEGIN
        ALTER TABLE "EmbedAttempt"
        ADD CONSTRAINT "EmbedAttempt_partId_fkey"
        FOREIGN KEY ("partId") REFERENCES "Part"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `,
  },
  {
    label: "EmbedAttempt (userId, partId) index",
    sql: `CREATE INDEX IF NOT EXISTS "EmbedAttempt_userId_partId_idx" ON "EmbedAttempt"("userId", "partId");`,
  },
  {
    label: "EmbedAttempt.completedAt index",
    sql: `CREATE INDEX IF NOT EXISTS "EmbedAttempt_completedAt_idx" ON "EmbedAttempt"("completedAt");`,
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
  const values = await prisma.$queryRawUnsafe<{ enumlabel: string }[]>(
    `SELECT enumlabel FROM pg_enum WHERE enumtypid = '"PartType"'::regtype ORDER BY enumsortorder;`,
  );
  console.log(
    `\nEmbed schema applied. PartType values: ${values.map((v) => v.enumlabel).join(", ")}`,
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
