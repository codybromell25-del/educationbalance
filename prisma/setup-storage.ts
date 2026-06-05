/**
 * One-time setup — creates the private "course-files" Supabase Storage
 * bucket if it doesn't already exist. Safe to re-run.
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.
 *
 * Run: npx tsx prisma/setup-storage.ts
 */
import { ensureBucket, STORAGE_BUCKET } from "../src/lib/storage";

async function main() {
  await ensureBucket();
  console.log(`✓ Bucket "${STORAGE_BUCKET}" exists (private).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
