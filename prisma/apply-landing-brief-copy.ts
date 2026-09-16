/**
 * Landing-page brief (Sept 2026) — write the approved copy into the
 * LandingSection rows that the live page reads from.
 *
 * The preview branch rendered this copy from config.ts defaults; on
 * production the loader reads the database, so the same copy has to be
 * written there once, at go-live. After this the admin editor at
 * /admin/landing edits the new copy as normal.
 *
 * Scope (deliberately narrow):
 *   replace : hero, course-pillars, what-you-learn, weekends,
 *             what-you-get, why-balance, faqs, final-cta
 *   merge   : pathways  → title only (prices, Stripe URLs, deposit
 *             banner, sold-out flags are admin-owned and left alone)
 *             gallery   → intro only (slot keys / address kept)
 *   skip    : tutors, timeline, footer, who-for
 *
 * Templates are not changed. Rows that don't exist are created.
 *
 * Usage:
 *   npx tsx prisma/apply-landing-brief-copy.ts            # dry run
 *   npx tsx prisma/apply-landing-brief-copy.ts --apply    # write
 */
import { PrismaClient } from "@prisma/client";
import {
  HERO_DEFAULT_CONTENT,
  COURSE_PILLARS_DEFAULT_CONTENT,
  WHAT_YOU_LEARN_DEFAULT_CONTENT,
  WEEKENDS_DEFAULT_CONTENT,
  WHAT_YOU_GET_DEFAULT_CONTENT,
  WHY_BALANCE_DEFAULT_CONTENT,
  FAQS_DEFAULT_CONTENT,
  FINAL_CTA_DEFAULT_CONTENT,
  PATHWAYS_DEFAULT_CONTENT,
  GALLERY_DEFAULT_CONTENT,
  HERO_DEFAULT_TEMPLATE,
  PATHWAYS_DEFAULT_TEMPLATE,
  GALLERY_DEFAULT_TEMPLATE,
} from "../src/lib/landing/config";

const APPLY = process.argv.includes("--apply");
const prisma = new PrismaClient();

type Plan = {
  section: string;
  mode: "replace" | "merge";
  defaultTemplate: string;
  next: (current: Record<string, unknown> | null) => Record<string, unknown>;
};

const asObj = (v: unknown) => (v ?? {}) as Record<string, unknown>;

const PLANS: Plan[] = [
  { section: "hero", mode: "replace", defaultTemplate: HERO_DEFAULT_TEMPLATE, next: () => asObj(HERO_DEFAULT_CONTENT) },
  { section: "course-pillars", mode: "replace", defaultTemplate: "default", next: () => asObj(COURSE_PILLARS_DEFAULT_CONTENT) },
  { section: "what-you-learn", mode: "replace", defaultTemplate: "default", next: () => asObj(WHAT_YOU_LEARN_DEFAULT_CONTENT) },
  { section: "weekends", mode: "replace", defaultTemplate: "default", next: () => asObj(WEEKENDS_DEFAULT_CONTENT) },
  { section: "what-you-get", mode: "replace", defaultTemplate: "default", next: () => asObj(WHAT_YOU_GET_DEFAULT_CONTENT) },
  { section: "why-balance", mode: "replace", defaultTemplate: "default", next: () => asObj(WHY_BALANCE_DEFAULT_CONTENT) },
  { section: "faqs", mode: "replace", defaultTemplate: "default", next: () => asObj(FAQS_DEFAULT_CONTENT) },
  { section: "final-cta", mode: "replace", defaultTemplate: "default", next: () => asObj(FINAL_CTA_DEFAULT_CONTENT) },
  {
    section: "pathways",
    mode: "merge",
    defaultTemplate: PATHWAYS_DEFAULT_TEMPLATE,
    // Marketing copy only — prices, Stripe URLs, deposit banner and
    // sold-out flags on the row are admin-owned and never touched here.
    next: (cur) => ({
      ...(cur ?? asObj(PATHWAYS_DEFAULT_CONTENT)),
      title: PATHWAYS_DEFAULT_CONTENT.title,
      description: PATHWAYS_DEFAULT_CONTENT.description,
      footnote: PATHWAYS_DEFAULT_CONTENT.footnote,
    }),
  },
  {
    section: "gallery",
    mode: "merge",
    defaultTemplate: GALLERY_DEFAULT_TEMPLATE,
    next: (cur) => ({ ...(cur ?? asObj(GALLERY_DEFAULT_CONTENT)), intro: GALLERY_DEFAULT_CONTENT.intro }),
  },
];

const headline = (c: Record<string, unknown> | null): string => {
  if (!c) return "(no row)";
  const t = (c.title ?? c.tagline ?? (Array.isArray(c.headlineLines) ? (c.headlineLines as string[]).join(" / ") : "")) as string;
  return String(t).slice(0, 70);
};

async function main() {
  console.log(APPLY ? "=== APPLYING landing brief copy ===" : "=== DRY RUN — nothing will be written (add --apply to write) ===");
  const rows = new Map((await prisma.landingSection.findMany()).map((r) => [r.section, r]));
  let changed = 0;
  for (const p of PLANS) {
    const row = rows.get(p.section);
    const current = row ? (row.content as Record<string, unknown>) : null;
    const next = p.next(current);
    const same = JSON.stringify(current) === JSON.stringify(next);
    console.log(`\n[${p.section}] ${p.mode}${row ? "" : " (row missing → will create)"}${same ? "  — already identical, skip" : ""}`);
    console.log(`   before: ${headline(current)}`);
    console.log(`   after : ${headline(next)}`);
    if (same) continue;
    changed++;
    if (!APPLY) continue;
    await prisma.landingSection.upsert({
      where: { section: p.section },
      update: { content: next as object },
      create: { section: p.section, template: p.defaultTemplate, content: next as object },
    });
    console.log("   ✓ written");
  }
  console.log(`\n${APPLY ? "Done." : "Dry run complete."} ${changed} section(s) ${APPLY ? "updated" : "would change"}. Untouched: tutors, timeline, footer, who-for.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
