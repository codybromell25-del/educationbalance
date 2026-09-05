/**
 * Safety catch for DESTRUCTIVE seed scripts.
 *
 * Several scripts in this folder call `deleteMany()` on live tables and
 * then recreate placeholder rows — they were written to bootstrap an
 * empty database. Run against production they would wipe every part
 * Catherine has authored in the targeted unit (and cascade through
 * quizzes, attempts and submissions).
 *
 * They now refuse to run unless the caller explicitly opts in:
 *
 *   ALLOW_DESTRUCTIVE_SEED=yes-wipe-content npx tsx prisma/seed-mat-parts.ts
 *
 * The opt-in value is deliberately ugly so it can't be set by accident.
 */
export function requireDestructiveSeedOptIn(scriptName: string): void {
  if (process.env.ALLOW_DESTRUCTIVE_SEED === "yes-wipe-content") return;

  let host = "unknown";
  try {
    host = new URL(process.env.DATABASE_URL ?? "").hostname || "unknown";
  } catch {
    // leave as "unknown"
  }

  console.error(
    [
      "",
      `✗ ${scriptName} is DESTRUCTIVE — it deletes existing rows — and has been blocked.`,
      `  Target database host: ${host}`,
      "",
      "  If you genuinely want to wipe and re-seed, run it with:",
      `    ALLOW_DESTRUCTIVE_SEED=yes-wipe-content npx tsx prisma/${scriptName}`,
      "",
    ].join("\n"),
  );
  process.exit(1);
}
