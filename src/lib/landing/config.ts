/**
 * Landing-page CMS configuration.
 *
 * Each editable section has:
 *   - A unique `section` key (matches LandingSection.section in DB)
 *   - A list of `templates` (LandingSection.template picks one;
 *     single-template sections just have one "default" entry)
 *   - A `defaultContent` object that's seeded into the DB on first
 *     admin-save and used as a fallback if no row exists yet
 *   - A list of `assetSlots` describing which images that section uses
 *
 * Image fallbacks are paths in /public; uploaded overrides are storage
 * paths (e.g. "landing/abc-uuid.jpg") that get signed URLs at render.
 */

export type AssetSlot = {
  key: string;
  label: string;
  fallback: string;
};

// ----- Content shapes (each section has its own) -----

export type HeroContent = {
  tagline: string;
  headlineLines: string[];
  description: string;
  ctaPrimaryLabel: string; // kept for back-compat; not rendered (Sign Up Now is hard-wired)
  ctaSecondaryLabel: string;
  cohortDates: string;
};

export type CoursePillarsContent = {
  eyebrow: string;
  headlineLines: string[]; // [line1, line2 (italic)]
  pillars: Array<{ slotKey: string; title: string; desc: string }>;
};

export type WhoForContent = {
  eyebrow: string;
  headlineLines: string[]; // [line1, line2 (italic)]
  bullets: string[];
};

export type WhatYouLearnContent = {
  eyebrow: string;
  title: string;
  bullets: string[];
};

export type WeekendsContent = {
  eyebrow: string;
  title: string;
  weekends: Array<{ n: number; title: string; body: string }>;
};

export type TutorsContent = {
  tutors: Array<{
    slotKey: string;
    name: string;
    role: string;
    bio: string;
  }>;
};

export type GalleryContent = {
  intro: string;
  slotKeys: string[];
};

export type WhatYouGetContent = {
  eyebrow: string;
  title: string;
  items: Array<{ icon: string; title: string; body: string }>;
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

export type TimelineContent = {
  eyebrow: string;
  title: string;
  items: Array<{ label: string; date: string }>;
  footnote: string;
};

export type WhyBalanceContent = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  stats: Array<{ value: string; label: string }>;
};

export type FaqsContent = {
  eyebrow: string;
  title: string;
  items: Array<{ q: string; a: string }>;
};

export type FinalCtaContent = {
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export type FooterContent = {
  tagline: string;
  contactEmail: string;
  instagramUrl: string;
  studioUrl: string;
};

// ----- Templates -----

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

export const SINGLE_TEMPLATE = [{ id: "default", label: "Default" }] as const;

// ----- Defaults -----

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
  ctaPrimaryLabel: "Sign Up Now",
  ctaSecondaryLabel: "Apply / join waitlist",
  cohortDates: "Cohort 1 · Starts Autumn 2026",
};

export const COURSE_PILLARS_DEFAULT_CONTENT: CoursePillarsContent = {
  eyebrow: "Why this course",
  headlineLines: [
    "Most Pilates courses teach you exercises.",
    "This one teaches you how to teach.",
  ],
  pillars: [
    {
      slotKey: "pillar-1",
      title: "Small cohort, real studio",
      desc: "Four weekends at the balance studio in Dublin. Tutor-led, equipment-on, repertoire learned on the same reformers you'll teach on.",
    },
    {
      slotKey: "pillar-2",
      title: "Theory meets practice",
      desc: "Online learning supports every weekend — manuals, video library, MCQ exams and your hour-log tracker live in your account.",
    },
    {
      slotKey: "pillar-3",
      title: "Pathway that fits you",
      desc: "Mat-only, reformer-only, or full comprehensive. Pick the depth and modality that fits where you're going.",
    },
  ],
};

export const WHO_FOR_DEFAULT_CONTENT: WhoForContent = {
  eyebrow: "Is this you?",
  headlineLines: ["Built for aspiring", "Pilates instructors"],
  bullets: [
    "You want to become a qualified Pilates instructor",
    "You're a regular Pilates client who's been told you should teach",
    "You're a yoga or fitness pro looking to add Pilates with real depth",
    "You learn best with a mix of hands-on, theory and self-practice",
    "You want a small cohort with real tutor time, not a 200-person Zoom course",
  ],
};

export const WHAT_YOU_LEARN_DEFAULT_CONTENT: WhatYouLearnContent = {
  eyebrow: "What you'll learn",
  title: "By the time you finish, you'll be able to —",
  bullets: [
    "Cue clients with clarity, calm and confidence",
    "Read a body across the room and adapt the session in real time",
    "Build safe, progressive class plans for mixed-ability rooms",
    "Use the reformer with intention — not just the workout, the why",
    "Modify for pregnancy, injury and special populations",
    "Run a sustainable teaching practice that suits your life",
  ],
};

export const WEEKENDS_DEFAULT_CONTENT: WeekendsContent = {
  eyebrow: "The four weekends",
  title: "A clear path through the course",
  weekends: [
    {
      n: 1,
      title: "Foundations & functional anatomy",
      body: "The Pilates method, the principles, and the anatomy you'll cue every day.",
    },
    {
      n: 2,
      title: "Mat — teaching the room",
      body: "The balance approach to mat teaching. Class structure, cueing, exercise library, modifications.",
    },
    {
      n: 3,
      title: "Reformer — equipment & exercises",
      body: "Springs, setup, safety. Reformer exercise library. Programming reformer classes for real clients.",
    },
    {
      n: 4,
      title: "Special populations & teaching practice",
      body: "Pregnancy, older adults, injury recovery. Inclusive classes. Practical assessments + sign-off.",
    },
  ],
};

export const TUTORS_DEFAULT_CONTENT: TutorsContent = {
  tutors: [
    {
      slotKey: "tutor-kelly",
      name: "Kelly",
      role: "Course director · balance studios founder",
      bio: "CONFIRM short bio — years teaching, training lineage, philosophy. 60–90 words.",
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

export const WHAT_YOU_GET_DEFAULT_CONTENT: WhatYouGetContent = {
  eyebrow: "What you get",
  title: "Everything in one package",
  items: [
    {
      icon: "📕",
      title: "Two printed booklets",
      body: "Anatomy & teaching manuals — yours to keep, scribble on, and refer back to for years.",
    },
    {
      icon: "💻",
      title: "Full LMS access",
      body: "Every weekend's content online: videos, written guides, downloadable workbooks, MCQ exams and your hour-log tracker.",
    },
    {
      icon: "🎥",
      title: "Exercise video library",
      body: "Filmed in the balance studio — every mat and reformer exercise with cueing, common faults and modifications.",
    },
    {
      icon: "🚪",
      title: "Three open studio days",
      body: "Drop-in days to teach under supervision, troubleshoot exercises and sign off your practical hours.",
    },
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
        "Yoga / fitness instructors adding Pilates mat to their offering, or anyone testing the water.",
    },
    {
      code: "C",
      title: "Reformer only",
      summary:
        "Reformer module + foundations. Requires an existing mat qualification.",
      duration: "Weekends 1 & 3 · reformer practical assessment",
      price: "CONFIRM pricing",
      bestFor:
        "Existing mat instructors specialising into reformer. Needs an STA / Polestar / equivalent mat qualification.",
    },
  ],
};

export const TIMELINE_DEFAULT_CONTENT: TimelineContent = {
  eyebrow: "The timeline",
  title: "Save the dates",
  items: [
    { label: "Applications open", date: "CONFIRM" },
    { label: "Weekend 1 — Foundations", date: "CONFIRM" },
    { label: "Weekend 2 — Mat", date: "CONFIRM" },
    { label: "Open studio day 1", date: "CONFIRM" },
    { label: "Weekend 3 — Reformer", date: "CONFIRM" },
    { label: "Open studio day 2", date: "CONFIRM" },
    { label: "Weekend 4 — Special populations + assessment", date: "CONFIRM" },
    { label: "Open studio day 3 / sign-off", date: "CONFIRM" },
  ],
  footnote: "Check against your diary before you apply. We don't run catch-up sessions.",
};

export const WHY_BALANCE_DEFAULT_CONTENT: WhyBalanceContent = {
  eyebrow: "Why balance",
  title: "Built on real studio experience",
  paragraphs: [
    "You're not learning in a hotel function room from a roving trainer. You're learning at a working studio with thousands of clients across Kildare and Wicklow, taught by people who run classes every week.",
    "Every section of the course has been shaped by what actually works on the studio floor — not just textbooks.",
  ],
  stats: [
    { value: "5", label: "Studios" },
    { value: "1000+", label: "Clients trained" },
    { value: "8+", label: "Years experience" },
  ],
};

export const FAQS_DEFAULT_CONTENT: FaqsContent = {
  eyebrow: "FAQs",
  title: "The questions everyone asks",
  items: [
    {
      q: "Do I need experience?",
      a: "You don't need any teaching experience, but you do need a regular Pilates practice. Pathway C (reformer only) requires an existing mat qualification.",
    },
    {
      q: "What insurance can I get when I finish?",
      a: "On successful completion you can apply for instructor insurance with the usual UK / Ireland providers. CONFIRM list of accredited insurers we recommend.",
    },
    {
      q: "Can I pay in instalments?",
      a: "Yes — payment plans are available on application. Get in touch and we'll work something out.",
    },
    {
      q: "What happens if I miss a weekend?",
      a: "The four weekends are designed to build on each other and we don't run catch-up sessions. If you miss one, you'll roll into the next cohort to make it up.",
    },
    {
      q: "Is there support between weekends?",
      a: "Yes. LMS access throughout, Q&A on every section, log feedback after each weekend, three open studio days under supervision.",
    },
  ],
};

export const FINAL_CTA_DEFAULT_CONTENT: FinalCtaContent = {
  title: "Your Pilates career starts here",
  description:
    "Join the next cohort of balance-trained instructors. Expert guidance, structured learning, real results.",
  primaryLabel: "Register Interest",
  secondaryLabel: "Apply for a pathway",
};

export const FOOTER_DEFAULT_CONTENT: FooterContent = {
  tagline: "Pilates instructor training, mat & reformer. Dublin.",
  contactEmail: "hello@balancestudios.ie",
  instagramUrl: "https://www.instagram.com/balancestudios",
  studioUrl: "https://balancestudios.ie",
};

// Default templates
export const HERO_DEFAULT_TEMPLATE = "full-bleed";
export const TUTORS_DEFAULT_TEMPLATE = "side-by-side";
export const GALLERY_DEFAULT_TEMPLATE = "mosaic";
export const PATHWAYS_DEFAULT_TEMPLATE = "cards";

// Asset slots
export const HERO_ASSET_SLOTS: AssetSlot[] = [
  { key: "hero-bg", label: "Hero background / side image", fallback: "/images/studio-bray-hero.jpg" },
];

export const COURSE_PILLARS_ASSET_SLOTS: AssetSlot[] = [
  { key: "pillar-1", label: "Pillar 1 image", fallback: "/images/studio-instructor.jpg" },
  { key: "pillar-2", label: "Pillar 2 image", fallback: "/images/reformer-stretch.jpg" },
  { key: "pillar-3", label: "Pillar 3 image", fallback: "/images/instructor-chat.jpg" },
];

export const WHO_FOR_ASSET_SLOTS: AssetSlot[] = [
  { key: "who-for", label: "Side image", fallback: "/images/instructor-helping.jpg" },
];

export const TUTORS_ASSET_SLOTS: AssetSlot[] = [
  { key: "tutor-kelly", label: "Kelly portrait", fallback: "/images/instructor-chat.jpg" },
  { key: "tutor-catherine", label: "Catherine portrait", fallback: "/images/instructor-helping.jpg" },
];

export const GALLERY_ASSET_SLOTS: AssetSlot[] = [
  { key: "gallery-1", label: "Gallery photo 1 (feature tile)", fallback: "/images/studio-reformers-row.jpg" },
  { key: "gallery-2", label: "Gallery photo 2", fallback: "/images/studio-wide.jpg" },
  { key: "gallery-3", label: "Gallery photo 3", fallback: "/images/studio-instructor.jpg" },
  { key: "gallery-4", label: "Gallery photo 4", fallback: "/images/reformer-class.jpg" },
  { key: "gallery-5", label: "Gallery photo 5", fallback: "/images/studio-mirror.jpg" },
  { key: "gallery-6", label: "Gallery photo 6", fallback: "/images/studio-equipment.jpg" },
];

export const IMAGE_BREAK_ASSET_SLOTS: AssetSlot[] = [
  { key: "image-break", label: "Atmospheric break image (full-width)", fallback: "/images/studio-ball-workout.jpg" },
];

export const WHY_BALANCE_ASSET_SLOTS: AssetSlot[] = [
  { key: "why-balance", label: "Side image", fallback: "/images/studio-welcome.jpg" },
];

export const FINAL_CTA_ASSET_SLOTS: AssetSlot[] = [
  { key: "final-cta-bg", label: "Background image", fallback: "/images/studio-mirror.jpg" },
];

// ----- Section registry -----

export type SectionKey =
  | "hero"
  | "course-pillars"
  | "who-for"
  | "what-you-learn"
  | "weekends"
  | "tutors"
  | "gallery"
  | "what-you-get"
  | "pathways"
  | "timeline"
  | "why-balance"
  | "faqs"
  | "final-cta"
  | "footer";

export const SECTION_REGISTRY = {
  hero: {
    label: "Hero",
    templates: HERO_TEMPLATES,
    defaultTemplate: HERO_DEFAULT_TEMPLATE,
    defaultContent: HERO_DEFAULT_CONTENT,
    assetSlots: HERO_ASSET_SLOTS,
  },
  "course-pillars": {
    label: "Course pillars (3 image cards)",
    templates: SINGLE_TEMPLATE,
    defaultTemplate: "default",
    defaultContent: COURSE_PILLARS_DEFAULT_CONTENT,
    assetSlots: COURSE_PILLARS_ASSET_SLOTS,
  },
  "who-for": {
    label: "Who is this for",
    templates: SINGLE_TEMPLATE,
    defaultTemplate: "default",
    defaultContent: WHO_FOR_DEFAULT_CONTENT,
    assetSlots: WHO_FOR_ASSET_SLOTS,
  },
  "what-you-learn": {
    label: "What you'll learn",
    templates: SINGLE_TEMPLATE,
    defaultTemplate: "default",
    defaultContent: WHAT_YOU_LEARN_DEFAULT_CONTENT,
    assetSlots: [],
  },
  weekends: {
    label: "The four weekends",
    templates: SINGLE_TEMPLATE,
    defaultTemplate: "default",
    defaultContent: WEEKENDS_DEFAULT_CONTENT,
    assetSlots: [],
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
    assetSlots: [...GALLERY_ASSET_SLOTS, ...IMAGE_BREAK_ASSET_SLOTS],
  },
  "what-you-get": {
    label: "What you get",
    templates: SINGLE_TEMPLATE,
    defaultTemplate: "default",
    defaultContent: WHAT_YOU_GET_DEFAULT_CONTENT,
    assetSlots: [],
  },
  pathways: {
    label: "Pathways",
    templates: PATHWAYS_TEMPLATES,
    defaultTemplate: PATHWAYS_DEFAULT_TEMPLATE,
    defaultContent: PATHWAYS_DEFAULT_CONTENT,
    assetSlots: [],
  },
  timeline: {
    label: "Timeline",
    templates: SINGLE_TEMPLATE,
    defaultTemplate: "default",
    defaultContent: TIMELINE_DEFAULT_CONTENT,
    assetSlots: [],
  },
  "why-balance": {
    label: "Why balance (stats)",
    templates: SINGLE_TEMPLATE,
    defaultTemplate: "default",
    defaultContent: WHY_BALANCE_DEFAULT_CONTENT,
    assetSlots: WHY_BALANCE_ASSET_SLOTS,
  },
  faqs: {
    label: "FAQs",
    templates: SINGLE_TEMPLATE,
    defaultTemplate: "default",
    defaultContent: FAQS_DEFAULT_CONTENT,
    assetSlots: [],
  },
  "final-cta": {
    label: "Final CTA",
    templates: SINGLE_TEMPLATE,
    defaultTemplate: "default",
    defaultContent: FINAL_CTA_DEFAULT_CONTENT,
    assetSlots: FINAL_CTA_ASSET_SLOTS,
  },
  footer: {
    label: "Footer",
    templates: SINGLE_TEMPLATE,
    defaultTemplate: "default",
    defaultContent: FOOTER_DEFAULT_CONTENT,
    assetSlots: [],
  },
} as const;

export const SECTION_KEYS: SectionKey[] = [
  "hero",
  "course-pillars",
  "who-for",
  "what-you-learn",
  "weekends",
  "tutors",
  "gallery",
  "what-you-get",
  "pathways",
  "timeline",
  "why-balance",
  "faqs",
  "final-cta",
  "footer",
];
