/**
 * Phase 6 schema — adds the Application table for course-application
 * form submissions. Same runtime-client DDL pattern as the earlier
 * apply-*-schema scripts (Supavisor pooler rejects the Prisma schema
 * engine). Idempotent.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statements: { label: string; sql: string }[] = [
  {
    label: "Create Application table",
    sql: `
      CREATE TABLE IF NOT EXISTS "Application" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "pathway" TEXT NOT NULL,
        "notes" TEXT,
        "contacted" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
      );
    `,
  },
  {
    label: "Application createdAt index",
    sql: `CREATE INDEX IF NOT EXISTS "Application_createdAt_idx" ON "Application"("createdAt");`,
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
  console.log("\nPhase 6 schema changes applied.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
