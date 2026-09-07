/**
 * IICT terminology — one-off content fix for the LIVE landing page.
 *
 * balance Education is an IICT Pioneer Training Provider, approved by
 * IICT to teach Pilates; the course is "IICT approved". The live copy
 * (LandingSection rows, which override config.ts defaults) said
 * "IICT accredited" / "accredited" in seven places. Signed off by Cody
 * on 2026-09-07 with this exact before/after list.
 *
 * Safe by construction: each change only applies where the "from"
 * text is still present (exact or substring match as specified), so it
 * can't overwrite copy that's been edited since; nothing else in the
 * JSON is touched; re-running is a no-op. Same targeted-update pattern
 * as the other prisma/apply-*.ts scripts.
 *
 * Run: npx tsx prisma/apply-iict-wording.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Change = {
  section: string;
  from: string;
  to: string;
  /** "exact": the whole string must equal `from`. "contains": replace `from` within a longer string. */
  mode: "exact" | "contains";
};

const CHANGES: Change[] = [
  { section: "hero", mode: "exact", from: "IICT ACCREDITED · 230 HOURS", to: "IICT APPROVED · 230 HOURS" },
  { section: "hero", mode: "exact", from: "Accredited to", to: "Qualified to" },
  { section: "hero", mode: "exact", from: "practice.", to: "practise." },
  {
    section: "hero",
    mode: "contains",
    from: "so graduates leave IICT accredited and ready to apply for insurance and teach.",
    to: "so graduates leave with an IICT approved qualification, ready to apply for insurance and teach.",
  },
  {
    section: "course-pillars",
    mode: "exact",
    from: "An accredited qualification, not a weekend course",
    to: "An IICT approved qualification, not a weekend course",
  },
  {
    section: "course-pillars",
    mode: "contains",
    from: "Each pathway is IICT accredited, meeting the standard",
    to: "Each pathway is IICT approved, meeting the standard",
  },
  {
    section: "who-for",
    mode: "exact",
    from: "You want a qualification that's accredited and insurance ready from day one",
    to: "You want a qualification that's IICT approved and insurance ready from day one",
  },
  {
    section: "what-you-learn",
    mode: "exact",
    from: "Graduate IICT accredited, recognised for insurance in over thirty countries",
    to: "Graduate with an IICT approved qualification, recognised for insurance in over thirty countries",
  },
];

function applyChange(node: unknown, ch: Change, hits: string[]): unknown {
  if (typeof node === "string") {
    const matches = ch.mode === "exact" ? node === ch.from : node.includes(ch.from);
    if (!matches) return node;
    const next = ch.mode === "exact" ? ch.to : node.split(ch.from).join(ch.to);
    hits.push(`  ✓ "${ch.from.slice(0, 58)}${ch.from.length > 58 ? "…" : ""}"\n    → "${ch.to.slice(0, 58)}${ch.to.length > 58 ? "…" : ""}"`);
    return next;
  }
  if (Array.isArray(node)) return node.map((n) => applyChange(n, ch, hits));
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = applyChange(v, ch, hits);
    return out;
  }
  return node;
}

async function main() {
  const sections = [...new Set(CHANGES.map((c) => c.section))];
  let totalApplied = 0;
  let totalSkipped = 0;

  for (const section of sections) {
    const row = await prisma.landingSection.findUnique({ where: { section } });
    if (!row) {
      console.log(`[${section}] no DB row — nothing to change (defaults in config.ts apply)`);
      continue;
    }
    let content: unknown = row.content;
    const hits: string[] = [];
    for (const ch of CHANGES.filter((c) => c.section === section)) {
      const before = hits.length;
      content = applyChange(content, ch, hits);
      if (hits.length === before) {
        totalSkipped++;
        console.log(`[${section}]   – not found (already changed or edited): "${ch.from.slice(0, 50)}…"`);
      }
    }
    if (hits.length > 0) {
      await prisma.landingSection.update({
        where: { section },
        data: { content: content as object },
      });
      totalApplied += hits.length;
      console.log(`[${section}] ${hits.length} change(s) written:\n${hits.join("\n")}`);
    }
  }
  console.log(`\nDone. ${totalApplied} field(s) updated, ${totalSkipped} skipped.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
