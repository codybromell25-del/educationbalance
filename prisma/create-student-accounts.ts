/**
 * Bulk-create student accounts from a JSON list with random temporary
 * passwords. Generic and PII-free so it can live in the repo and be reused
 * for later cohorts.
 *
 * Usage:
 *   npx tsx prisma/create-student-accounts.ts <students.json> <cohort-slug> <out.json>
 *
 * students.json : [{ "name", "email", "pathway": "MAT|REFORMER|COMPREHENSIVE" }]
 * out.json      : same rows + { status: "created"|"exists"|"error", password?, error? }
 *
 * Behaviour
 * - Emails are NFKC-normalised (undoes PDF ligatures like "ﬀ"), trimmed and
 *   lowercased — login is exact-match, so the stored form must be canonical.
 * - Existing accounts are NEVER modified; reported as "exists" with no password.
 * - Passwords: 10 chars, letters + digits, no look-alikes (0/O/1/l/I), at
 *   least one of each class; bcrypt cost 12 to match src/lib/auth.ts.
 * - Sends NO welcome emails — the caller distributes credentials.
 * - Passwords are written only to out.json, never printed. Keep both JSON
 *   files outside the repo and delete out.json once it's been used.
 */
import { PrismaClient, Pathway } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { randomInt } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const [, , inputPath, cohortSlug, outputPath] = process.argv;
if (!inputPath || !cohortSlug || !outputPath) {
  console.error("usage: npx tsx prisma/create-student-accounts.ts <students.json> <cohort-slug> <out.json>");
  process.exit(1);
}

const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generatePassword(len = 10): string {
  for (;;) {
    let s = "";
    for (let i = 0; i < len; i++) s += ALPHABET[randomInt(ALPHABET.length)];
    if (/[a-zA-Z]/.test(s) && /[0-9]/.test(s)) return s;
  }
}
const normEmail = (e: string) => e.normalize("NFKC").trim().toLowerCase();
const normName = (n: string) => n.normalize("NFKC").replace(/[‘’]/g, "'").trim();

type In = { name: string; email: string; pathway: string; selfPaced?: boolean };
type Out = In & { status: "created" | "exists" | "error"; password?: string; error?: string };

const prisma = new PrismaClient();

async function main() {
  const students: In[] = JSON.parse(readFileSync(inputPath, "utf8"));
  const cohort = await prisma.cohort.findUnique({ where: { slug: cohortSlug } });
  if (!cohort) throw new Error(`Cohort "${cohortSlug}" not found — create it in /admin/cohorts first`);
  console.log(`Cohort: ${cohort.name}\nStudents in list: ${students.length}\n`);

  const VALID = new Set<string>(Object.values(Pathway));
  const results: Out[] = [];
  for (const s of students) {
    const name = normName(s.name);
    const email = normEmail(s.email);
    const pathway = String(s.pathway).toUpperCase();
    try {
      if (!VALID.has(pathway)) throw new Error(`invalid pathway "${s.pathway}"`);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error(`invalid email "${email}"`);
      const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
      if (existing) {
        results.push({ name, email, pathway, status: "exists" });
        console.log(`  – exists   ${name} <${email}>  (left untouched)`);
        continue;
      }
      const password = generatePassword();
      const passwordHash = await bcryptjs.hash(password, 12);
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "USER",
          pathway: pathway as Pathway,
          cohortId: cohort.id,
          selfPaced: s.selfPaced === true, // optional per row; ignores unlock dates
        },
      });
      results.push({ name, email, pathway, status: "created", password });
      console.log(`  ✓ created  ${name} <${email}>  ${pathway}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      results.push({ name, email, pathway, status: "error", error: msg });
      console.log(`  ✗ error    ${name} <${email}>: ${msg}`);
    }
  }

  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  const count = (st: Out["status"]) => results.filter((r) => r.status === st).length;
  console.log(`\nDone: ${count("created")} created, ${count("exists")} already existed (untouched), ${count("error")} error(s).`);
  console.log(`Credentials written to out.json only — not printed.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
