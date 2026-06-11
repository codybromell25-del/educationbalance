// Public landing page for the balance studios Pilates instructor course.
//
// NOTE: copy below uses sensible defaults / placeholders. Anywhere you
// see the literal string "CONFIRM" in text, that's a spot Kelly needs
// to fill in (dates, pricing, tutor bios). Search for "CONFIRM" to
// find them all quickly.
//
// The previous hero-style landing page is preserved at
// src/app/_legacy/page-original.tsx if anyone wants to roll back.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ApplicationForm from "@/components/landing/ApplicationForm";

export const metadata: Metadata = {
  title:
    "balance studios | Pilates Instructor Training — Dublin",
  description:
    "A four-weekend Pilates instructor training course at balance studios, Dublin. Three pathways: comprehensive, mat-only, reformer-only. Applications open.",
};

// ----- Quick-edit content blocks -----

const COURSE_TAGLINE = "Pilates Instructor Training — Dublin";
const HEADLINE_LINE_1 = "Most Pilates courses";
const HEADLINE_LINE_2 = "teach you exercises.";
const HEADLINE_LINE_3 = "This one teaches you";
const HEADLINE_LINE_4_ITALIC = "how to teach.";

// CONFIRM: replace with actual cohort dates once Kelly signs them off
const COHORT_DATES_TAGLINE = "Cohort 1 · Starts Spring 2026";

const HOOK = {
  short:
    "Most Pilates courses send you home with a checklist of exercises. balance studios sends you home with the eye, the language and the confidence to teach.",
  long: "Four weekends at our Dublin studio with Catherine and Kelly. Three pathways depending on what you want to teach. Everything you need — printed manuals, video library, open studio days — included.",
};

const WHAT_YOU_WILL_LEARN = [
  "Cue clients with clarity, calm and confidence",
  "Read a body across the room and adapt the session in real time",
  "Build safe, progressive class plans for mixed-ability rooms",
  "Use the reformer with intention — not just the workout, the why",
  "Modify for pregnancy, injury and special populations",
  "Run a sustainable teaching practice that suits your life",
];

const WEEKENDS = [
  {
    n: 1,
    title: "Foundations & functional anatomy",
    body: "The Pilates method, the principles, and the anatomy you'll cue every day. Neutral spine, the powerhouse, lateral breath, joints, muscles, compensations.",
  },
  {
    n: 2,
    title: "Mat — teaching the room",
    body: "The balance approach to mat teaching. Class structure, cueing on the floor, the exercise library, common modifications.",
  },
  {
    n: 3,
    title: "Reformer — equipment & exercises",
    body: "Springs, setup, safety. The exercise library on the reformer. Programming reformer classes for real clients.",
  },
  {
    n: 4,
    title: "Special populations & teaching practice",
    body: "Adapting for pregnancy, older adults, injury recovery. Building inclusive classes. Practical assessments, sign-off, and next steps.",
  },
];

const FOR_YOU_IF = [
  "You're a regular Pilates client who's been told you should teach",
  "You're a yoga / fitness pro looking to add Pilates with depth",
  "You want a small cohort with real tutor time, not a 200-person Zoom course",
  "You can commit to four weekends in Dublin plus self-practice between",
];

const NOT_FOR_YOU_IF = [
  "You've never done a Pilates session in your life — try ten classes first",
  "You're looking for a one-weekend 'mat certificate' to put on Instagram",
  "You can't make the four weekend dates (we don't catch up online)",
];

const TUTORS = [
  {
    name: "Kelly",
    role: "Course director · balance studios founder",
    bio: "CONFIRM short bio — years teaching, training lineage, philosophy, anything memorable about how she runs the studio. 60–90 words is plenty.",
    // CONFIRM: drop Kelly's portrait into public/images/tutor-kelly.jpg
    image: "/images/instructor-chat.jpg",
  },
  {
    name: "Catherine",
    role: "Lead tutor",
    bio: "CONFIRM short bio — Catherine's background, training, and what she's known for in the studio.",
    // CONFIRM: drop Catherine's portrait into public/images/tutor-catherine.jpg
    image: "/images/instructor-helping.jpg",
  },
];

const PACKAGE_ITEMS = [
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
];

const PATHWAYS = [
  {
    code: "A",
    title: "Full comprehensive",
    summary: "Mat + reformer + special populations. The complete instructor pathway.",
    duration: "Four weekends · open studio days · practical assessment",
    price: "CONFIRM pricing",
    bestFor: "Aspiring full-time instructors who want both modalities and the broadest career options.",
  },
  {
    code: "B",
    title: "Mat only",
    summary: "Mat module + foundations. Shortest pathway to teaching mat classes.",
    duration: "Weekends 1 & 2 · mat practical assessment",
    price: "CONFIRM pricing",
    bestFor: "Yoga / fitness instructors adding Pilates mat to their offering, or anyone testing the water before going comprehensive.",
  },
  {
    code: "C",
    title: "Reformer only",
    summary: "Reformer module + foundations. Requires an existing mat qualification.",
    duration: "Weekends 1 & 3 · reformer practical assessment",
    price: "CONFIRM pricing",
    bestFor: "Existing mat instructors specialising into reformer. Prerequisite: an STA / Polestar / equivalent mat qualification.",
  },
];

const FAQS = [
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
    a: "The four weekends are designed to build on each other and we don't run catch-up sessions. If you miss one, you'll roll into the next cohort to make it up. Talk to us if life happens.",
  },
  {
    q: "Is there support between weekends?",
    a: "Yes. You'll have LMS access throughout, Q&A on every section, log feedback after each weekend, and three open studio days to teach under supervision.",
  },
];

// ----- Page -----

export default function HomePage() {
  return (
    <div className="bg-brand-surface text-brand-primary">
      <Nav />

      <Hero />
      <Hook />
      <CourseOverview />
      <WhatYouWillLearn />
      <FourWeekends />
      <WhoItsFor />
      <Tutors />
      <Studio />
      <WhatYouGet />
      <Pathways />
      <Faqs />
      <SocialProof />
      <Timeline />
      <ApplicationSection />
      <InstagramEmbed />
      <Footer />
    </div>
  );
}

// ------------------------------------------------------------------
// Nav
// ------------------------------------------------------------------
function Nav() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="#top" className="flex items-center gap-2">
          <Image
            src="/images/balance-logo.jpg"
            alt="balance"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-xl tracking-wide font-light">balance</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm">
          <a href="#overview" className="text-brand-primary/80 hover:text-brand-sage transition-colors">Overview</a>
          <a href="#pathways" className="text-brand-primary/80 hover:text-brand-sage transition-colors">Pathways</a>
          <a href="#tutors" className="text-brand-primary/80 hover:text-brand-sage transition-colors">Tutors</a>
          <a href="#faqs" className="text-brand-primary/80 hover:text-brand-sage transition-colors">FAQs</a>
          <Link href="/login" className="text-brand-primary/80 hover:text-brand-sage transition-colors">Log in</Link>
        </div>
        <a
          href="#apply"
          className="px-5 py-2 text-xs tracking-wider uppercase bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-colors"
        >
          Apply
        </a>
      </div>
    </nav>
  );
}

// ------------------------------------------------------------------
// Hero (above the fold)
// ------------------------------------------------------------------
function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0">
        <Image
          src="/images/studio-reformers-row.jpg"
          alt="balance studios reformer line"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/40 to-black/20" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 text-white py-20">
        <p className="text-brand-sage-light text-xs sm:text-sm tracking-[0.35em] uppercase mb-5">
          {COURSE_TAGLINE}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-[1.05] tracking-tight mb-8">
          {HEADLINE_LINE_1}
          <br />
          {HEADLINE_LINE_2}
          <br />
          {HEADLINE_LINE_3}{" "}
          <span className="italic">{HEADLINE_LINE_4_ITALIC}</span>
        </h1>
        <p className="text-white/85 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
          {HOOK.short}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <a
            href="#apply"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-sage text-white text-xs tracking-[0.25em] uppercase rounded-full hover:bg-brand-sage-dark transition-colors"
          >
            Apply / join waitlist
          </a>
          <a
            href="#overview"
            className="inline-flex items-center justify-center px-8 py-3.5 text-xs tracking-[0.25em] uppercase rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors"
          >
            See the course
          </a>
        </div>
        <p className="mt-8 text-sm text-white/70">{COHORT_DATES_TAGLINE}</p>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------
function Hook() {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-5">
          Why this course
        </p>
        <p className="text-2xl md:text-3xl font-light leading-snug text-brand-primary">
          {HOOK.long}
        </p>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Course overview
// ------------------------------------------------------------------
function CourseOverview() {
  return (
    <section id="overview" className="py-20 md:py-28 px-5 md:px-8 bg-white border-y border-brand-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader eyebrow="Course overview" title="What it is, how long, how it works" />
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <OverviewCard
            title="Three pathways"
            body="Comprehensive (mat + reformer), mat only, or reformer only. Pick the depth and modality that fits where you're going."
          />
          <OverviewCard
            title="Four in-person weekends"
            body="At the balance studio in Dublin. Small cohort, real tutor time, repertoire on the equipment — not Zoom theory."
          />
          <OverviewCard
            title="Online learning support"
            body="LMS access throughout: video library, written guides, MCQ exams, hour-log tracker. You'll never lose your notes."
          />
        </div>
        <div className="mt-10 text-center text-sm text-brand-muted">
          CONFIRM: total hours · format · location address · prerequisites
        </div>
      </div>
    </section>
  );
}

function OverviewCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-brand-surface rounded-2xl border border-brand-border p-7">
      <h3 className="text-lg font-medium text-brand-primary mb-2">{title}</h3>
      <p className="text-sm text-brand-primary/80 leading-relaxed">{body}</p>
    </div>
  );
}

// ------------------------------------------------------------------
// What you will learn
// ------------------------------------------------------------------
function WhatYouWillLearn() {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader eyebrow="What you'll learn" title="By the time you finish, you'll be able to —" />
        <ul className="mt-12 grid md:grid-cols-2 gap-x-10 gap-y-5">
          {WHAT_YOU_WILL_LEARN.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-brand-primary text-base md:text-lg"
            >
              <span className="text-brand-sage shrink-0 mt-1">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Four weekends
// ------------------------------------------------------------------
function FourWeekends() {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8 bg-white border-y border-brand-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader eyebrow="The four weekends" title="A clear path through the course" />
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {WEEKENDS.map((w) => (
            <div key={w.n} className="rounded-2xl border border-brand-border bg-brand-surface p-7">
              <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-3">
                Weekend {w.n}
              </p>
              <h3 className="text-xl font-medium text-brand-primary mb-3">{w.title}</h3>
              <p className="text-sm text-brand-primary/80 leading-relaxed">{w.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Who it's for
// ------------------------------------------------------------------
function WhoItsFor() {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-4">For you if</p>
          <ul className="space-y-3">
            {FOR_YOU_IF.map((item) => (
              <li key={item} className="flex items-start gap-3 text-brand-primary">
                <span className="text-brand-sage shrink-0 mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-brand-muted mb-4">Not for you if</p>
          <ul className="space-y-3">
            {NOT_FOR_YOU_IF.map((item) => (
              <li key={item} className="flex items-start gap-3 text-brand-primary/70">
                <span className="text-brand-muted shrink-0 mt-1">×</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Tutors
// ------------------------------------------------------------------
function Tutors() {
  return (
    <section id="tutors" className="py-20 md:py-28 px-5 md:px-8 bg-white border-y border-brand-border">
      <div className="max-w-5xl mx-auto">
        <SectionHeader eyebrow="Meet the tutors" title="Real teachers, real studio time" />
        <div className="grid md:grid-cols-2 gap-10 mt-12">
          {TUTORS.map((t) => (
            <div key={t.name} className="flex flex-col items-start">
              <div className="relative w-full aspect-[4/5] mb-5 rounded-2xl overflow-hidden bg-brand-surface">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-2">{t.role}</p>
              <h3 className="text-2xl font-light text-brand-primary mb-3">{t.name}</h3>
              <p className="text-sm text-brand-primary/80 leading-relaxed">{t.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Studio gallery
// ------------------------------------------------------------------
function Studio() {
  const photos = [
    "/images/studio-reformers-row.jpg",
    "/images/studio-wide.jpg",
    "/images/studio-instructor.jpg",
    "/images/reformer-class.jpg",
    "/images/studio-mirror.jpg",
    "/images/studio-equipment.jpg",
  ];
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader eyebrow="The studio" title="Where you'll train" />
        <p className="text-center text-brand-primary/70 max-w-2xl mx-auto mt-4">
          A working studio in Dublin — not a hotel function room. You learn on the equipment you&rsquo;ll teach on.
        </p>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {photos.map((src, i) => (
            <div
              key={src}
              className={`relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
            >
              <Image
                src={src}
                alt="balance studio"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// What you get
// ------------------------------------------------------------------
function WhatYouGet() {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8 bg-white border-y border-brand-border">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="What you get"
          title="Everything in one package"
        />
        <div className="grid sm:grid-cols-2 gap-5 mt-12">
          {PACKAGE_ITEMS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-brand-border bg-brand-surface p-7"
            >
              <p className="text-3xl mb-3">{p.icon}</p>
              <h3 className="font-medium text-brand-primary mb-2">{p.title}</h3>
              <p className="text-sm text-brand-primary/80 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Pathways
// ------------------------------------------------------------------
function Pathways() {
  return (
    <section id="pathways" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Three pathways"
          title="Pick the route that fits where you're going"
        />
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {PATHWAYS.map((p) => (
            <div
              key={p.code}
              className="rounded-2xl border border-brand-border bg-white p-7 flex flex-col"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-3">Pathway {p.code}</p>
              <h3 className="text-xl font-medium text-brand-primary mb-3">{p.title}</h3>
              <p className="text-sm text-brand-primary/80 mb-4">{p.summary}</p>
              <p className="text-xs text-brand-muted mb-1">Format</p>
              <p className="text-sm text-brand-primary/90 mb-4">{p.duration}</p>
              <p className="text-xs text-brand-muted mb-1">Best for</p>
              <p className="text-sm text-brand-primary/90 mb-6">{p.bestFor}</p>
              <div className="mt-auto pt-4 border-t border-brand-border flex items-center justify-between">
                <p className="text-lg font-light text-brand-primary">{p.price}</p>
                <a
                  href="#apply"
                  className="text-xs tracking-wider uppercase text-brand-sage hover:text-brand-sage-dark"
                >
                  Apply →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// FAQs
// ------------------------------------------------------------------
function Faqs() {
  return (
    <section id="faqs" className="py-20 md:py-28 px-5 md:px-8 bg-white border-y border-brand-border">
      <div className="max-w-3xl mx-auto">
        <SectionHeader eyebrow="FAQs" title="The questions everyone asks" />
        <div className="mt-12 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-brand-border bg-brand-surface p-5"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span className="font-medium text-brand-primary">{f.q}</span>
                <span className="text-brand-sage transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-brand-primary/80 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Social proof
// ------------------------------------------------------------------
function SocialProof() {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-5">
          Trusted by Dublin clients
        </p>
        <h2 className="text-3xl md:text-4xl font-light text-brand-primary leading-snug max-w-3xl mx-auto">
          You&rsquo;re learning from a working studio &mdash; not just a course.
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-14 max-w-3xl mx-auto">
          {/* CONFIRM stats once Kelly signs off the exact numbers */}
          <Stat value="10+" label="Years in business" />
          <Stat value="40+" label="Classes per week" />
          <Stat value="5★" label="Client reviews" />
        </div>
        <p className="mt-10 text-sm text-brand-muted max-w-xl mx-auto">
          When the first cohort graduates we&rsquo;ll add their stories here. For now, the
          balance studio&rsquo;s ten-year reputation does the talking.
        </p>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border p-7">
      <p className="text-4xl font-light text-brand-primary">{value}</p>
      <p className="text-xs tracking-wider uppercase text-brand-muted mt-2">{label}</p>
    </div>
  );
}

// ------------------------------------------------------------------
// Timeline
// ------------------------------------------------------------------
function Timeline() {
  // CONFIRM all dates with Kelly before launch
  const items = [
    { label: "Applications open", date: "CONFIRM" },
    { label: "Weekend 1 — Foundations", date: "CONFIRM weekend date" },
    { label: "Weekend 2 — Mat", date: "CONFIRM weekend date" },
    { label: "Open studio day 1", date: "CONFIRM date" },
    { label: "Weekend 3 — Reformer", date: "CONFIRM weekend date" },
    { label: "Open studio day 2", date: "CONFIRM date" },
    { label: "Weekend 4 — Special populations + assessment", date: "CONFIRM weekend date" },
    { label: "Open studio day 3 / sign-off", date: "CONFIRM date" },
  ];
  return (
    <section className="py-20 md:py-28 px-5 md:px-8 bg-white border-y border-brand-border">
      <div className="max-w-3xl mx-auto">
        <SectionHeader eyebrow="The timeline" title="Save the dates" />
        <ul className="mt-12 space-y-2">
          {items.map((item, i) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border border-brand-border bg-brand-surface"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-7 h-7 rounded-full bg-brand-sage/10 text-brand-sage border border-brand-sage/30 flex items-center justify-center shrink-0 text-xs font-medium">
                  {i + 1}
                </div>
                <span className="text-brand-primary font-medium truncate">{item.label}</span>
              </div>
              <span className="text-sm text-brand-muted shrink-0">{item.date}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs text-brand-muted">
          Check against your diary before you apply. We don&rsquo;t run catch-up sessions.
        </p>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Application form
// ------------------------------------------------------------------
function ApplicationSection() {
  return (
    <section id="apply" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          eyebrow="Apply or join the waitlist"
          title="A short form. We'll get back to you within a week."
        />
        <div className="mt-12 bg-white rounded-2xl border border-brand-border p-7 md:p-10">
          <ApplicationForm />
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Instagram embed
// ------------------------------------------------------------------
function InstagramEmbed() {
  // CONFIRM Instagram handle. Embed shown as a simple CTA card for now
  // because the official Instagram embed iframe needs a per-post URL.
  return (
    <section className="py-20 md:py-28 px-5 md:px-8 bg-white border-y border-brand-border">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeader eyebrow="Instagram" title="What life at the studio looks like" />
        <a
          href="https://www.instagram.com/balancestudios"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-10 px-8 py-3.5 bg-brand-primary text-white text-xs tracking-[0.25em] uppercase rounded-full hover:bg-brand-primary/90 transition-colors"
        >
          @balancestudios on Instagram
        </a>
        <p className="text-xs text-brand-muted mt-6">
          CONFIRM Instagram handle. Swap this CTA for an embedded grid (LightWidget / Instagram embed iframe) once the handle is confirmed.
        </p>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Footer
// ------------------------------------------------------------------
function Footer() {
  return (
    <footer className="px-5 md:px-8 pt-16 pb-10 bg-brand-primary text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/images/balance-logo.jpg" alt="balance" width={32} height={32} className="rounded-full" />
              <span className="text-xl tracking-wide font-light">balance studios</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Pilates instructor training, mat &amp; reformer. Dublin.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-brand-sage-light mb-3">Contact</p>
            <p className="text-sm text-white/85">
              {/* CONFIRM email + phone */}
              <a href="mailto:hello@balancestudios.ie" className="hover:text-brand-sage-light">hello@balancestudios.ie</a>
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-brand-sage-light mb-3">Links</p>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.instagram.com/balancestudios" target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-brand-sage-light">Instagram</a></li>
              <li><a href="https://balancestudios.ie" target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-brand-sage-light">balance studio site</a></li>
              <li><Link href="/login" className="text-white/85 hover:text-brand-sage-light">Student log-in</Link></li>
              <li><a href="#" className="text-white/85 hover:text-brand-sage-light">Privacy policy</a></li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-white/40 border-t border-white/10 pt-6">
          © {new Date().getFullYear()} balance studios. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ------------------------------------------------------------------
// Shared
// ------------------------------------------------------------------
function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-4">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl font-light text-brand-primary leading-tight max-w-3xl mx-auto">
        {title}
      </h2>
    </div>
  );
}
