/**
 * Landing-page CMS configuration.
 *
 * Each editable section has:
 *   - A unique `section` key (matches LandingSection.section in DB)
 *   - A list of `templates` (LandingSection.template picks one)
 *   - A `defaultContent` object that's seeded into the DB on first
 *     admin-save and used as a fallback if no row exists yet
 *   - A list of `assetSlots` describing which images that section uses
 *     (used by the admin editor to render upload widgets)
 *
 * Image fallbacks are paths in /public; uploaded overrides are storage
 * paths (e.g. "landing/abc-uuid.jpg") that get signed URLs at render.
 */

export type AssetSlot = {
  key: string;
  label: string;
  fallback: string; // path under /public
};

// ----- Content shapes (each section has its own) -----

export type HeroContent = {
  tagline: string;
  /** Headline split into lines for typographic control; the last line
   *  is rendered italic to match the original design. */
  headlineLines: string[];
  description: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  cohortDates: string;
};

export type TutorsContent = {
  tutors: Array<{
    slotKey: string; // e.g. "tutor-kelly"
    name: string;
    role: string;
    bio: string;
  }>;
};

export type GalleryContent = {
  intro: string;
  /** Six photo slots; templates may render them differently. */
  slotKeys: string[];
};

export type PathwaysContent = {
  pathways: Array<{
    code: string;
    title: string;
    summary: string;
    duration: string;
    price: string;
    bestFor: string;
  }>;
};

// ----- Section registry -----

export const HERO_TEMPLATES = [
  { id: "full-bleed", label: "Full-bleed background (current)" },
  { id: "split-screen", label: "Split-screen (image right, text left)" },
] as const;

export const TUTORS_TEMPLATES = [
  { id: "side-by-side", label: "Side by side (current)" },
  { id: "alternating-rows", label: "Alternating rows (1 tutor per row)" },
] as const;

export const GALLERY_TEMPLATES = [
  { id: "mosaic", label: "Mosaic (first photo large)" },
  { id: "equal-grid", label: "Equal-size grid" },
] as const;

export const PATHWAYS_TEMPLATES = [
  { id: "cards", label: "Three cards (current)" },
  { id: "comparison-table", label: "Comparison table" },
] as const;

export const HERO_DEFAULT_CONTENT: HeroContent = {
  tagline: "Pilates Instructor Training — Dublin",
  headlineLines: [
    "Most Pilates courses",
    "teach you exercises.",
    "This one teaches you",
    "how to teach.",
  ],
  description:
    "Most Pilates courses send you home with a checklist of exercises. balance studios sends you home with the eye, the language and the confidence to teach.",
  ctaPrimaryLabel: "Apply / join waitlist",
  ctaSecondaryLabel: "See the course",
  cohortDates: "Cohort 1 · Starts Spring 2026",
};

export const TUTORS_DEFAULT_CONTENT: TutorsContent = {
  tutors: [
    {
      slotKey: "tutor-kelly",
      name: "Kelly",
      role: "Course director · balance studios founder",
      bio: "CONFIRM short bio — years teaching, training lineage, philosophy, anything memorable about how she runs the studio. 60–90 words is plenty.",
    },
    {
      slotKey: "tutor-catherine",
      name: "Catherine",
      role: "Lead tutor",
      bio: "CONFIRM short bio — Catherine's background, training, and what she's known for in the studio.",
    },
  ],
};

export const GALLERY_DEFAULT_CONTENT: GalleryContent = {
  intro:
    "A working studio in Dublin — not a hotel function room. You learn on the equipment you'll teach on.",
  slotKeys: [
    "gallery-1",
    "gallery-2",
    "gallery-3",
    "gallery-4",
    "gallery-5",
    "gallery-6",
  ],
};

export const PATHWAYS_DEFAULT_CONTENT: PathwaysContent = {
  pathways: [
    {
      code: "A",
      title: "Full comprehensive",
      summary:
        "Mat + reformer + special populations. The complete instructor pathway.",
      duration: "Four weekends · open studio days · practical assessment",
      price: "CONFIRM pricing",
      bestFor:
        "Aspiring full-time instructors who want both modalities and the broadest career options.",
    },
    {
      code: "B",
      title: "Mat only",
      summary:
        "Mat module + foundations. Shortest pathway to teaching mat classes.",
      duration: "Weekends 1 & 2 · mat practical assessment",
      price: "CONFIRM pricing",
      bestFor:
        "Yoga / fitness instructors adding Pilates mat to their offering, or anyone testing the water before going comprehensive.",
    },
    {
      code: "C",
      title: "Reformer only",
      summary:
        "Reformer module + foundations. Requires an existing mat qualification.",
      duration: "Weekends 1 & 3 · reformer practical assessment",
      price: "CONFIRM pricing",
      bestFor:
        "Existing mat instructors specialising into reformer. Prerequisite: an STA / Polestar / equivalent mat qualification.",
    },
  ],
};

// Default selected template for each section (matches the look of the
// current landing page).
export const HERO_DEFAULT_TEMPLATE = "full-bleed";
export const TUTORS_DEFAULT_TEMPLATE = "side-by-side";
export const GALLERY_DEFAULT_TEMPLATE = "mosaic";
export const PATHWAYS_DEFAULT_TEMPLATE = "cards";

export const HERO_ASSET_SLOTS: AssetSlot[] = [
  {
    key: "hero-bg",
    label: "Hero background / side image",
    fallback: "/images/studio-reformers-row.jpg",
  },
];

export const TUTORS_ASSET_SLOTS: AssetSlot[] = [
  {
    key: "tutor-kelly",
    label: "Kelly portrait",
    fallback: "/images/instructor-chat.jpg",
  },
  {
    key: "tutor-catherine",
    label: "Catherine portrait",
    fallback: "/images/instructor-helping.jpg",
  },
];

export const GALLERY_ASSET_SLOTS: AssetSlot[] = [
  { key: "gallery-1", label: "Gallery photo 1 (feature tile)", fallback: "/images/studio-reformers-row.jpg" },
  { key: "gallery-2", label: "Gallery photo 2", fallback: "/images/studio-wide.jpg" },
  { key: "gallery-3", label: "Gallery photo 3", fallback: "/images/studio-instructor.jpg" },
  { key: "gallery-4", label: "Gallery photo 4", fallback: "/images/reformer-class.jpg" },
  { key: "gallery-5", label: "Gallery photo 5", fallback: "/images/studio-mirror.jpg" },
  { key: "gallery-6", label: "Gallery photo 6", fallback: "/images/studio-equipment.jpg" },
];

export const PATHWAYS_ASSET_SLOTS: AssetSlot[] = [];

// ----- Section registry (one entry per editable section) -----

export type SectionKey = "hero" | "tutors" | "gallery" | "pathways";

export const SECTION_REGISTRY = {
  hero: {
    label: "Hero",
    templates: HERO_TEMPLATES,
    defaultTemplate: HERO_DEFAULT_TEMPLATE,
    defaultContent: HERO_DEFAULT_CONTENT,
    assetSlots: HERO_ASSET_SLOTS,
  },
  tutors: {
    label: "Tutors",
    templates: TUTORS_TEMPLATES,
    defaultTemplate: TUTORS_DEFAULT_TEMPLATE,
    defaultContent: TUTORS_DEFAULT_CONTENT,
    assetSlots: TUTORS_ASSET_SLOTS,
  },
  gallery: {
    label: "Studio gallery",
    templates: GALLERY_TEMPLATES,
    defaultTemplate: GALLERY_DEFAULT_TEMPLATE,
    defaultContent: GALLERY_DEFAULT_CONTENT,
    assetSlots: GALLERY_ASSET_SLOTS,
  },
  pathways: {
    label: "Pathways",
    templates: PATHWAYS_TEMPLATES,
    defaultTemplate: PATHWAYS_DEFAULT_TEMPLATE,
    defaultContent: PATHWAYS_DEFAULT_CONTENT,
    assetSlots: PATHWAYS_ASSET_SLOTS,
  },
} as const;

export const SECTION_KEYS: SectionKey[] = [
  "hero",
  "tutors",
  "gallery",
  "pathways",
];
