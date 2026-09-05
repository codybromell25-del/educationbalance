/**
 * One-time setup — creates the PUBLIC "course-media" Supabase Storage
 * bucket (media library for unit-content images) if it doesn't already
 * exist, with JPG/PNG/WebP/GIF + 20 MB limits baked in at bucket level.
 * Additive and idempotent. Safe to re-run.
 *
 * The app also calls ensureMediaBucket() lazily on first use, so running
 * this is optional — it just lets you verify storage is wired up without
 * opening the admin.
 *
 * Run: npx tsx prisma/setup-media-bucket.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env without a dependency. Never overrides vars already set.
try {
  for (const line of readFileSync(resolve(process.cwd(), ".env"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const v = m[2].replace(/^(['"])(.*)\1$/, "$2");
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
} catch {
  /* no .env — rely on the environment */
}

async function main() {
  const { ensureMediaBucket, listMedia, mediaPublicUrl, MEDIA_BUCKET } =
    await import("../src/lib/storage");
  await ensureMediaBucket();
  const items = await listMedia();
  const sample = mediaPublicUrl("example.jpg");
  console.log(`✓ Bucket "${MEDIA_BUCKET}" exists (public).`);
  console.log(`✓ list() OK — ${items.length} object(s) currently.`);
  console.log(`✓ public URL shape: …${sample.slice(sample.indexOf("/storage/"))}`);
}

main().catch((e) => {
  console.error("✗", e instanceof Error ? e.message : e);
  process.exit(1);
});
