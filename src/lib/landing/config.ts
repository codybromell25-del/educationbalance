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
  pillars: Array<{
    slotKey: string;
    title: string;
    desc: string;
    // Optional structured hour/detail rows rendered between title and desc.
    // Used by the "Course Details" pillar to show the per-pathway breakdown.
    breakdown?: Array<{ label: string; detail: string }>;
    // Optional long-form paragraphs rendered under the pillar's desc.
    // Holds the extended narrative belonging to *this* pillar so each
    // theme's copy lives with its own tile instead of stacking under
    // one section-wide block.
    paragraphs?: string[];
  }>;
  // Deprecated section-level narrative — kept for backwards compat but
  // no longer rendered. Extended copy now lives on each pillar.
  narrative?: string[];
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
  weekends: Array<{
    n: number;
    title: string;
    body: string;
    // Optional "What you'll cover:" checklist rendered under the body.
    bullets?: string[];
  }>;
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
  // Optional studio address rendered under the intro paragraph.
  address?: string;
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
  // Small deadline line rendered inside each pricing card, just above
  // the CTA buttons. One string here means all three cards stay in sync.
  bookingDeadline?: string;
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
    // When true the card greys out, shows a "SOLD OUT" badge, drops
    // the booking deadline and replaces both Stripe CTAs with a
    // single "Register interest for next cohort" button that scrolls
    // to the #apply application form.
    soldOut?: boolean;
    // Optional scarcity strap ("Only 5 spots remain", "Last 2 spots!")
    // rendered as a gold badge in the same top-centre slot the
    // MOST COMPLETE / SOLD OUT badges use. Ignored on sold-out cards.
    remainingLabel?: string;
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
  // Small line under the CTA buttons. Used for "want to speak to us
  // first? email X" style pre-booking prompts.
  bookingLine?: string;
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
  { id: "featured-plus-row", label: "Featured director + row of instructors" },
  { id: "side-by-side", label: "Side by side" },
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
  tagline: "IICT ACCREDITED · 230 HOURS",
  headlineLines: [
    "Trained",
    "to teach.",
    "Accredited to",
    "practise.",
  ],
  description:
    "Seventy two hours in person, twenty eight online, fifty hours of self practice, sixty hours of supervised teaching and twenty hours of structured observation, supported by senior balance instructors throughout. Grounded in biomechanics, rooted in classic Pilates principles with a contemporary, modern element, so graduates leave IICT accredited and ready to apply for insurance and teach.",
  ctaPrimaryLabel: "Sign Up Now",
  ctaSecondaryLabel: "Express interest",
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
      title: "An accredited qualification, not a weekend course",
      desc: "Choose Mat, Reformer, or Comprehensive. Each pathway is IICT accredited, meeting the standard required to apply for insurance and teach professionally.",
      paragraphs: [
        "The balance teacher training course respects the changes taking place in the industry and makes room for modern thinking and updated ideas, while staying firmly rooted in the classical foundations of Pilates. You will leave understanding Pilates, the body, why the industry has changed, and how to manage that change as a confident, capable instructor.",
        "Pilates is more than repertoire. It is an understanding and respect for how the body responds, and why. From there, we build toward becoming a competent and capable instructor. Understanding and instructing are two different skill sets, and this course teaches both.",
      ],
    },
    {
      slotKey: "pillar-2",
      title: "Science based.",
      desc: "Every exercise is taught alongside the anatomy behind it: the muscles, the joints, the pattern of movement. You will learn to read a body in real time and adapt exercises accordingly.",
      paragraphs: [
        "With so many trends in Pilates, balance Education is focused on physiology and science, giving you a foundation of understanding that cannot be disputed. The Pilates world is an exciting and wonderful industry to be part of, and we will support you in becoming a valuable part of it, helping you support clients safely and effectively. Becoming part of this community brings real satisfaction, and balance Education is proud to educate and support you on that journey.",
      ],
    },
    {
      slotKey: "pillar-3",
      title: "Course Details",
      desc: "",
      breakdown: [
        {
          label: "Comprehensive",
          detail:
            "4 in-studio weekends, online learning, and 3 open studio days for reformer self practice, supervised by balance instructors.",
        },
        {
          label: "Mat",
          detail:
            "2 in-studio weekends, 19 hours of online learning, self practice, and structured observation.",
        },
        {
          label: "Reformer",
          detail:
            "2 in-studio weekends, 3 open studio days, and 30 hours of online learning, plus self practice and structured observation. Prerequisite: a valid Mat qualification.",
        },
      ],
      paragraphs: [
        "Your training doesn't end when the course does. balance is here to support your career on an ongoing basis, in whatever way we can.",
        "Our aim is to produce competent and confident instructors who respect and understand Pilates in all its forms.",
      ],
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
    "You want a qualification that's accredited and insurance ready from day one",
  ],
};

export const WHAT_YOU_LEARN_DEFAULT_CONTENT: WhatYouLearnContent = {
  eyebrow: "What you'll learn",
  title: "By the time you finish, you'll be able to —",
  bullets: [
    "Graduate IICT accredited, recognised for insurance in over thirty countries",
    "Run a sustainable teaching practice that suits your life",
    "Cue clients with clarity, calm and confidence",
    "Read a body across the room and adapt the session in real time",
    "Build safe, progressive class plans for mixed-ability rooms",
    "Use the reformer with intention — not just the workout, the why",
    "Modify for pregnancy, injury and special populations",
  ],
};

export const WEEKENDS_DEFAULT_CONTENT: WeekendsContent = {
  eyebrow: "The four weekends",
  title: "A clear path through the course",
  weekends: [
    {
      n: 1,
      title: "Foundations & functional anatomy",
      body: "The starting point for everything that follows. You will learn the Pilates method and its core principles, then build the functional anatomy that sits behind every cue you give, so you understand not just what to teach but why it works.",
      bullets: [
        "The history and philosophy of the Pilates method",
        "The core principles: breath, centering, control, precision, concentration and flow",
        "Functional anatomy: the skeleton, key muscle groups and how the body moves",
        "Planes of movement and how anatomy shapes your cueing",
      ],
    },
    {
      n: 2,
      title: "Mat & Assessment preparation",
      body: "The balance approach to mat teaching, from your first cue to a full class. You will work through the mat repertoire in detail and learn how to structure, sequence and adapt a class for real clients, while preparing for your mat assessment.",
      bullets: [
        "The full mat exercise library, with technique and teaching points",
        "Class structure, sequencing and flow",
        "Cueing frameworks that work for mixed ability rooms",
        "Modifications, progressions and regressions",
        "How to prepare and film your mat assessment",
      ],
    },
    {
      n: 3,
      title: "Reformer Foundations",
      body: "Everything you need to teach reformer with confidence and safety. You will get comfortable with the machine itself, learn the foundational repertoire, and start programming beginner classes for real clients.",
      bullets: [
        "Reformer setup, springs, resistance and safety",
        "The foundational reformer exercise library",
        "Smooth transitions and class flow on the machine",
        "Programming beginner reformer classes",
      ],
    },
    {
      n: 4,
      title: "Advanced reformer, S&C & professional practice",
      body: "The final weekend brings it all together. You will expand into advanced repertoire and strength and conditioning, learn to teach special populations and inclusive classes, and cover the professional side of working as an instructor, before your practical assessment and sign off.",
      bullets: [
        "Advanced reformer repertoire",
        "Strength and conditioning principles within Pilates",
        "Teaching special populations and inclusive classes",
        "Professional practice: insurance, ethics and business basics",
        "Practical assessment and sign off",
      ],
    },
  ],
};

export const TUTORS_DEFAULT_CONTENT: TutorsContent = {
  tutors: [
    {
      slotKey: "tutor-kelly",
      name: "Kelly O'Neill",
      role: "Course director · balance studios founder",
      bio: "CONFIRM short bio — years teaching, training lineage, philosophy. 60–90 words.",
    },
    {
      slotKey: "tutor-catherine",
      name: "Catherine Keon",
      role: "Lead Educator & Instructor",
      bio: "",
    },
    {
      slotKey: "tutor-ciara",
      name: "Ciara Whelan",
      role: "Educator & Instructor",
      bio: "",
    },
    {
      slotKey: "tutor-cathy",
      name: "Cathy O'Grady",
      role: "Educator & Instructor",
      bio: "",
    },
    {
      slotKey: "tutor-sarah",
      name: "Sarah McCormack",
      role: "Educator & Instructor",
      bio: "",
    },
    {
      slotKey: "tutor-sorcha",
      name: "Sorcha Hayward",
      role: "Educator & Instructor",
      bio: "",
    },
  ],
};

export const GALLERY_DEFAULT_CONTENT: GalleryContent = {
  intro:
    "A working studio — not a hotel function room. You learn on the equipment you'll teach on.",
  address: "Bray, Co Wicklow, A98 T276",
  slotKeys: [
    "gallery-1",
    "gallery-2",
    "gallery-3",
    "gallery-4",
    "gallery-5",
    "gallery-6",
    "gallery-7",
  ],
};

export const WHAT_YOU_GET_DEFAULT_CONTENT: WhatYouGetContent = {
  eyebrow: "What you get",
  title: "Everything in one package",
  items: [
    {
      icon: "",
      title: "Two printed booklets",
      body: "Anatomy & teaching manuals — yours to keep, scribble on, and refer back to for years.",
    },
    {
      icon: "",
      title: "Full LMS access",
      body: "Every weekend's content online: videos, written guides, downloadable workbooks, MCQ exams and your hour-log tracker.",
    },
    {
      icon: "",
      title: "Exercise video library",
      body: "Filmed in the balance studio — every mat and reformer exercise with cueing, common faults and modifications.",
    },
    {
      icon: "",
      title: "In house studios days",
      body: "As well as the 4 in-studio weekends, you'll have 3 drop-in days in our studio to use the reformer as you wish. These are supervised and designed to give you hands-on practice as part of your reformer training.",
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
  bookingDeadline: "Booking closes on 18th September",
  pathways: [
    {
      code: "MAT",
      title: "Mat Certification",
      subtitle: "Comprehensive Mat Pilates",
      priceOriginal: "€1,195",
      priceFull: "€1,095",
      saveLine: "Save €100 when you pay in full",
      depositAmount: "€500",
      installments: "2 instalments of €347.50",
      totalSplit: "Due 1st October and November",
      popular: false,
      soldOut: true,
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
      installments: "4 instalments of €498.75",
      totalSplit: "Due 1st October, November, December and January",
      popular: true,
      soldOut: true,
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
      installments: "3 instalments of €365",
      totalSplit: "Due 1st November, December and January",
      popular: false,
      soldOut: true,
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
    "You're learning at a working studio with thousands of clients across Kildare and Wicklow, taught by people who run classes every week. This certification is designed to create great instructors, not just qualified ones. Learn how to understand the body, connect with people, and teach with confidence.",
    "Every section of the course has been shaped by what actually works on the studio floor, not just textbooks.",
  ],
  stats: [
    { value: "6", label: "Studios" },
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
      q: "Do I need to attend each in-studio weekend?",
      a: "Yes — attendance is non-negotiable. Each weekend is designed to build on the last, so missing one means missing training you can't get back elsewhere. Please plan your time off early to make sure you can attend every day.",
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
  bookingLine:
    "Would you like to speak to us about this course before you book? Email us to arrange a phone call at education@balancestudios.ie.",
};

export const FOOTER_DEFAULT_CONTENT: FooterContent = {
  tagline: "Pilates instructor training, mat & reformer.",
  contactEmail: "hello@balancestudios.ie",
  instagramUrl: "https://www.instagram.com/balancereformer/?hl=en",
  studioUrl: "https://balancestudios.ie",
};

// Default templates
export const HERO_DEFAULT_TEMPLATE = "full-bleed";
export const TUTORS_DEFAULT_TEMPLATE = "featured-plus-row";
export const GALLERY_DEFAULT_TEMPLATE = "mosaic";
export const PATHWAYS_DEFAULT_TEMPLATE = "cards";

// Asset slots
export const HERO_ASSET_SLOTS: AssetSlot[] = [
  { key: "hero-bg", label: "Hero background / side image", fallback: "/images/interior-1.jpg" },
];

export const COURSE_PILLARS_ASSET_SLOTS: AssetSlot[] = [
  { key: "pillar-1", label: "Pillar 1 image", fallback: "/images/pillar-1.jpg" },
  { key: "pillar-2", label: "Pillar 2 image", fallback: "/images/pillar-2.jpg" },
  { key: "pillar-3", label: "Pillar 3 image", fallback: "/images/pillar-3-attic.jpg" },
];

export const WHO_FOR_ASSET_SLOTS: AssetSlot[] = [
  { key: "who-for", label: "Side image", fallback: "/images/instructor-helping.jpg" },
];

export const TUTORS_ASSET_SLOTS: AssetSlot[] = [
  { key: "tutor-kelly", label: "Kelly O'Neill portrait", fallback: "/images/tutor-kelly.jpg" },
  { key: "tutor-catherine", label: "Catherine Keon portrait", fallback: "" },
  { key: "tutor-ciara", label: "Ciara Whelan portrait", fallback: "" },
  { key: "tutor-cathy", label: "Cathy O'Grady portrait", fallback: "" },
  { key: "tutor-sarah", label: "Sarah McCormack portrait", fallback: "" },
  { key: "tutor-sorcha", label: "Sorcha Hayward portrait", fallback: "" },
];

export const GALLERY_ASSET_SLOTS: AssetSlot[] = [
  { key: "gallery-1", label: "Gallery photo 1 (feature tile)", fallback: "/images/gallery-3.jpg" },
  { key: "gallery-2", label: "Gallery photo 2", fallback: "/images/gallery-4.jpg" },
  { key: "gallery-3", label: "Gallery photo 3", fallback: "/images/gallery-2.jpg" },
  { key: "gallery-4", label: "Gallery photo 4", fallback: "/images/gallery-6.jpg" },
  { key: "gallery-5", label: "Gallery photo 5", fallback: "/images/gallery-1.jpg" },
  { key: "gallery-6", label: "Gallery photo 6", fallback: "/images/gallery-5.jpg" },
  { key: "gallery-7", label: "Gallery photo 7", fallback: "/images/gallery-7.jpg" },
];

export const IMAGE_BREAK_ASSET_SLOTS: AssetSlot[] = [
  { key: "image-break", label: "Atmospheric break image (full-width)", fallback: "/images/image-break.jpg" },
];

export const WHY_BALANCE_ASSET_SLOTS: AssetSlot[] = [
  { key: "why-balance", label: "Side image", fallback: "/images/why-balance-hallway.jpg" },
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
