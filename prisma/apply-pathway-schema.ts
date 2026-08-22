/**
 * Pathway feature schema — adds per-pathway visibility + unlock dates
 * + prerequisite pointer to Section, adds User.pathway.
 *
 * Same runtime-client DDL pattern as earlier phase apply scripts.
 * Idempotent — every statement uses IF NOT EXISTS / DO $$ … EXCEPTION.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statements: { label: string; sql: string }[] = [
  {
    label: "Create Pathway enum",
    sql: `
      DO $$ BEGIN
        CREATE TYPE "Pathway" AS ENUM ('MAT', 'REFORMER', 'COMPREHENSIVE');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `,
  },
  {
    label: "User.pathway column",
    sql: `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pathway" "Pathway";`,
  },
  {
    label: "Section.unlockDates JSON column",
    sql: `ALTER TABLE "Section" ADD COLUMN IF NOT EXISTS "unlockDates" JSONB;`,
  },
  {
    label: "Section.visibleToMat column",
    sql: `ALTER TABLE "Section" ADD COLUMN IF NOT EXISTS "visibleToMat" BOOLEAN NOT NULL DEFAULT true;`,
  },
  {
    label: "Section.visibleToReformer column",
    sql: `ALTER TABLE "Section" ADD COLUMN IF NOT EXISTS "visibleToReformer" BOOLEAN NOT NULL DEFAULT true;`,
  },
  {
    label: "Section.prerequisiteId column",
    sql: `ALTER TABLE "Section" ADD COLUMN IF NOT EXISTS "prerequisiteId" TEXT;`,
  },
  {
    label: "Section.prerequisiteId → Section self-FK",
    sql: `
      DO $$ BEGIN
        ALTER TABLE "Section"
        ADD CONSTRAINT "Section_prerequisiteId_fkey"
        FOREIGN KEY ("prerequisiteId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `,
  },
  {
    label: "Section.prerequisiteId index",
    sql: `CREATE INDEX IF NOT EXISTS "Section_prerequisiteId_idx" ON "Section"("prerequisiteId");`,
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
  console.log("\nPathway schema applied.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
