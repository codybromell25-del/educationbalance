/**
 * Discussion board schema — adds DiscussionPost table.
 *
 * Same runtime-client DDL pattern as apply-phase3/6/7-schema.ts.
 * Idempotent so it's safe to re-run.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statements: { label: string; sql: string }[] = [
  {
    label: "Create DiscussionPost table",
    sql: `
      CREATE TABLE IF NOT EXISTS "DiscussionPost" (
        "id" TEXT NOT NULL,
        "authorId" TEXT NOT NULL,
        "parentId" TEXT,
        "body" TEXT NOT NULL,
        "deletedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "DiscussionPost_pkey" PRIMARY KEY ("id")
      );
    `,
  },
  {
    label: "DiscussionPost parentId index",
    sql: `CREATE INDEX IF NOT EXISTS "DiscussionPost_parentId_idx" ON "DiscussionPost"("parentId");`,
  },
  {
    label: "DiscussionPost createdAt index",
    sql: `CREATE INDEX IF NOT EXISTS "DiscussionPost_createdAt_idx" ON "DiscussionPost"("createdAt");`,
  },
  {
    label: "DiscussionPost.authorId foreign key",
    sql: `
      DO $$ BEGIN
        ALTER TABLE "DiscussionPost"
        ADD CONSTRAINT "DiscussionPost_authorId_fkey"
        FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `,
  },
  {
    label: "DiscussionPost.parentId foreign key (self-ref)",
    sql: `
      DO $$ BEGIN
        ALTER TABLE "DiscussionPost"
        ADD CONSTRAINT "DiscussionPost_parentId_fkey"
        FOREIGN KEY ("parentId") REFERENCES "DiscussionPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
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
  console.log("\nDiscussion schema applied.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
