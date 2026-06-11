import { prisma } from "@/lib/db";
import { resolveFileUrl } from "@/lib/storage";
import {
  SECTION_REGISTRY,
  type SectionKey,
  type HeroContent,
  type TutorsContent,
  type GalleryContent,
  type PathwaysContent,
} from "./config";

export type ResolvedSection = {
  template: string;
  content:
    | HeroContent
    | TutorsContent
    | GalleryContent
    | PathwaysContent;
};

export type LandingData = {
  sections: Record<SectionKey, ResolvedSection>;
  /** Map of slot key → resolved URL (signed if from Supabase, plain if a
   *  /public path). Slots with no upload fall back to the registered
   *  fallback path in /public. */
  imageUrls: Map<string, string>;
};

/**
 * Loads every editable section's template + content and every uploaded
 * landing image, with fallbacks pre-applied. Safe to call from any
 * server component.
 */
export async function loadLandingData(): Promise<LandingData> {
  const [sectionRows, assetRows] = await Promise.all([
    prisma.landingSection.findMany(),
    prisma.landingAsset.findMany(),
  ]);

  const sectionsByKey = new Map(sectionRows.map((s) => [s.section, s]));

  const sections = Object.fromEntries(
    (Object.keys(SECTION_REGISTRY) as SectionKey[]).map((key) => {
      const row = sectionsByKey.get(key);
      const cfg = SECTION_REGISTRY[key];
      return [
        key,
        {
          template: row?.template ?? cfg.defaultTemplate,
          content:
            (row?.content as
              | HeroContent
              | TutorsContent
              | GalleryContent
              | PathwaysContent
              | undefined) ?? cfg.defaultContent,
        },
      ];
    }),
  ) as Record<SectionKey, ResolvedSection>;

  // Collect every slot we know about + every uploaded slot
  const knownSlots = new Map<string, string>(); // slot → fallback
  for (const cfg of Object.values(SECTION_REGISTRY)) {
    for (const s of cfg.assetSlots) {
      knownSlots.set(s.key, s.fallback);
    }
  }

  const assetsBySlot = new Map(assetRows.map((a) => [a.slot, a.imagePath]));

  // Resolve each known slot → URL (uploaded signed URL or fallback)
  const imageUrls = new Map<string, string>();
  await Promise.all(
    [...knownSlots.entries()].map(async ([slot, fallback]) => {
      const path = assetsBySlot.get(slot);
      if (path) {
        const url = await resolveFileUrl(path);
        if (url) {
          imageUrls.set(slot, url);
          return;
        }
      }
      imageUrls.set(slot, fallback);
    }),
  );

  return { sections, imageUrls };
}
