/**
 * Phase 7 schema — landing-page CMS. Adds LandingSection (template +
 * JSON content) and LandingAsset (slot → storage path). Same runtime-
 * client DDL pattern as earlier phases. Idempotent.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statements: { label: string; sql: string }[] = [
  {
    label: "Create LandingSection table",
    sql: `
      CREATE TABLE IF NOT EXISTS "LandingSection" (
        "id" TEXT NOT NULL,
        "section" TEXT NOT NULL,
        "template" TEXT NOT NULL,
        "content" JSONB NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "LandingSection_pkey" PRIMARY KEY ("id")
      );
    `,
  },
  {
    label: "LandingSection.section unique",
    sql: `CREATE UNIQUE INDEX IF NOT EXISTS "LandingSection_section_key" ON "LandingSection"("section");`,
  },
  {
    label: "Create LandingAsset table",
    sql: `
      CREATE TABLE IF NOT EXISTS "LandingAsset" (
        "id" TEXT NOT NULL,
        "slot" TEXT NOT NULL,
        "imagePath" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "LandingAsset_pkey" PRIMARY KEY ("id")
      );
    `,
  },
  {
    label: "LandingAsset.slot unique",
    sql: `CREATE UNIQUE INDEX IF NOT EXISTS "LandingAsset_slot_key" ON "LandingAsset"("slot");`,
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
  console.log("\nPhase 7 schema changes applied.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
