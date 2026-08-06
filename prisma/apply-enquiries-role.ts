/**
 * Adds an ENQUIRIES value to the existing Role enum, then flips
 * Aoife's user row to that role.
 *
 * The enum ADD VALUE cannot run inside a Postgres transaction, and
 * $executeRawUnsafe implicitly wraps in one — hence the pool
 * connection approach used here instead of the usual DDL loop.
 *
 * Idempotent — enum ADD VALUE IF NOT EXISTS handles re-runs, and the
 * user update is a straight overwrite.
 *
 * Run: node --env-file=.env --import tsx prisma/apply-enquiries-role.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Add the enum value (needs to be its own statement, no transaction).
  await prisma.$executeRawUnsafe(
    `ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'ENQUIRIES';`,
  );
  console.log("✓ Role enum: ENQUIRIES value added (or already present)");

  // Set Aoife to the new role. Using raw SQL so we don't need the
  // regenerated Prisma client to know about ENQUIRIES yet.
  const rowsUpdated = await prisma.$executeRawUnsafe(
    `UPDATE "User" SET "role" = 'ENQUIRIES' WHERE "email" = 'aoife@balancestudios.ie';`,
  );
  console.log(`✓ Aoife's role → ENQUIRIES (${rowsUpdated} row updated)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
