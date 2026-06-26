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
  eyebrow: string; // e.g. "OCTOBER 2026 COHORT"
  title: string;
  description: string;
  footnote: string;
  pathways: Array<{
    code: string;
    title: string;
    subtitle: string; // e.g. "Comprehensive Mat Pilates"
    priceOriginal: string; // strikethrough RRP, e.g. "€1,195"
    priceFull: string; // discounted full-pay price, e.g. "€1,095"
    saveLine: string; // e.g. "Save €100 when you pay in full"
    depositAmount: string; // e.g. "€500"
    installments: string; // e.g. "1 payment of €695" or "3 payments of €665"
    totalSplit: string; // e.g. "€1,195 total over 2 payments"
    popular: boolean; // shows the "MOST COMPLETE" badge
    payInFullUrl: string;
    payDepositUrl: string;
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
  tagline: "Pilates Instructor Training",
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
      desc: "Four weekends at the balance studio. Tutor-led, equipment-on, repertoire learned on the same reformers you'll teach on.",
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
    "A working studio — not a hotel function room. You learn on the equipment you'll teach on.",
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
  eyebrow: "OCTOBER 2026 COHORT",
  title: "Choose your certification & payment plan",
  description:
    "Pay in full and save, or spread the cost with a €500 deposit. Only 12 places per cohort — this is a launch price offer!",
  footnote:
    "A €500 deposit secures your place, with the remaining balance due ahead of your course start date. The pay-in-full saving applies to single payments only. Deposits are limited to the 12 places per cohort.",
  pathways: [
    {
      code: "MAT",
      title: "Mat Certification",
      subtitle: "Comprehensive Mat Pilates",
      priceOriginal: "€1,195",
      priceFull: "€1,095",
      saveLine: "Save €100 when you pay in full",
      depositAmount: "€500",
      installments: "1 payment of €695",
      totalSplit: "€1,195 total over 2 payments",
      popular: false,
      payInFullUrl: "https://book.stripe.com/28E00ka5B9mD9ZT6HKb7y05",
      payDepositUrl: "https://buy.stripe.com/00w6oI91xaqH3Bvc24b7y02",
    },
    {
      code: "COMP",
      title: "Comprehensive Certification",
      subtitle: "Mat & Reformer combined",
      priceOriginal: "€2,495",
      priceFull: "€2,345",
      saveLine: "Save €150 when you pay in full",
      depositAmount: "€500",
      installments: "3 payments of €665",
      totalSplit: "€2,495 total over 4 payments",
      popular: true,
      payInFullUrl: "https://buy.stripe.com/dRm14oa5BdCT6NH3vyb7y03",
      payDepositUrl: "https://book.stripe.com/6oUeVeb9FdCT7RL1nqb7y01",
    },
    {
      code: "REF",
      title: "Reformer Certification",
      subtitle: "Comprehensive Reformer Pilates",
      priceOriginal: "€1,595",
      priceFull: "€1,495",
      saveLine: "Save €100 when you pay in full",
      depositAmount: "€500",
      installments: "1 payment of €1,095",
      totalSplit: "€1,595 total over 2 payments",
      popular: false,
      payInFullUrl: "https://buy.stripe.com/8x28wQ1z50Q74Fzfegb7y04",
      payDepositUrl: "https://book.stripe.com/6oUeVeb9FdCT7RL1nqb7y01",
    },
  ],
};

export const TIMELINE_DEFAULT_CONTENT: TimelineContent = {
  eyebrow: "The timeline",
  title: "Save the dates",
  items: [
    { label: "Weekend 1", date: "9–11 Oct 2026" },
    { label: "Weekend 2", date: "6–8 Nov 2026" },
    { label: "Weekend 3", date: "4–6 Dec 2026" },
    { label: "Open Studio Day 1", date: "Sat 9 Jan 2027" },
    { label: "Weekend 4", date: "22–24 Jan 2027" },
    { label: "Assessment Day — Option A", date: "Sat 30 Jan 2027" },
    { label: "Open Studio Day 2", date: "Sat 6 Feb 2027" },
    { label: "Open Studio Day 3", date: "Sat 27 Feb 2027" },
    { label: "Assessment Day — Option B", date: "Sat 6 Mar 2027" },
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
  primaryLabel: "Book your space now",
  secondaryLabel: "Apply for a pathway",
};

export const FOOTER_DEFAULT_CONTENT: FooterContent = {
  tagline: "Pilates instructor training, mat & reformer.",
  contactEmail: "hello@balancestudios.ie",
  instagramUrl: "https://www.instagram.com/balancereformer/?hl=en",
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
  { key: "gallery-1", label: "Gallery photo 1 (feature tile)", fallback: "/images/studio-bray-hero.jpg" },
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
