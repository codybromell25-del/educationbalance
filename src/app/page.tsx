// Public landing page for balance studios.
//
// This is the blended version — visual style from the original
// "Master the art of movement" page, structural content from Kelly's
// instructor-course spec.
//
// Editable from /admin/landing (via the templated sections below):
//   - Hero (image, headline, secondary CTA, cohort dates)
//   - Tutors (images, bios, layout)
//   - Studio gallery (images, intro, layout)
//   - Pathways (text, layout)
//
// Static sections (edit page.tsx directly to change copy):
//   - Hook · Who-is-this-for · Course pillars · Curriculum strip
//   - Four weekends · What you get · Why balance (stats) · Timeline
//   - FAQs · Application form · Final CTA · Footer
//
// The Log In + Sign Up buttons in the top nav and the Sign Up Now
// button in the hero are hard-wired — they always link to /login and
// /signup respectively.
//
// Previous versions preserved for rollback:
//   - src/app/_legacy/page-original.tsx  (the "Master the art" page)
//   - src/app/_legacy/page-templated.tsx (Phase 7 fully-templated)
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ApplicationForm from "@/components/landing/ApplicationForm";
import HeroFullBleed from "@/components/landing/templates/HeroFullBleed";
import HeroSplitScreen from "@/components/landing/templates/HeroSplitScreen";
import TutorsSideBySide from "@/components/landing/templates/TutorsSideBySide";
import TutorsAlternatingRows from "@/components/landing/templates/TutorsAlternatingRows";
import GalleryMosaic from "@/components/landing/templates/GalleryMosaic";
import GalleryEqualGrid from "@/components/landing/templates/GalleryEqualGrid";
import PathwaysCards from "@/components/landing/templates/PathwaysCards";
import PathwaysComparisonTable from "@/components/landing/templates/PathwaysComparisonTable";
import { loadLandingData } from "@/lib/landing/loader";
import type {
  HeroContent,
  TutorsContent,
  GalleryContent,
  PathwaysContent,
} from "@/lib/landing/config";

export const metadata: Metadata = {
  title: "balance studios | Pilates Instructor Training — Dublin",
  description:
    "A four-weekend Pilates instructor training course at balance studios, Dublin. Three pathways: comprehensive, mat-only, reformer-only.",
};

// ----- Static content blocks (search "CONFIRM" for spots Kelly needs to fill in) -----

const WHO_THIS_IS_FOR = [
  "You want to become a qualified Pilates instructor",
  "You&rsquo;re a regular Pilates client who&rsquo;s been told you should teach",
  "You&rsquo;re a yoga or fitness pro looking to add Pilates with real depth",
  "You learn best with a mix of hands-on, theory and self-practice",
  "You want a small cohort with real tutor time, not a 200-person Zoom course",
];

const COURSE_PILLARS = [
  {
    title: "Small cohort, real studio",
    desc: "Four weekends at the balance studio in Dublin. Tutor-led, equipment-on, repertoire learned on the same reformers you'll teach on.",
    image: "/images/studio-instructor.jpg",
  },
  {
    title: "Theory meets practice",
    desc: "Online learning supports every weekend — manuals, video library, MCQ exams and your hour-log tracker live in your account.",
    image: "/images/reformer-stretch.jpg",
  },
  {
    title: "Pathway that fits you",
    desc: "Mat-only, reformer-only, or full comprehensive. Pick the depth and modality that fits where you're going.",
    image: "/images/instructor-chat.jpg",
  },
];

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

const TIMELINE = [
  { label: "Applications open", date: "CONFIRM" },
  { label: "Weekend 1 — Foundations", date: "CONFIRM" },
  { label: "Weekend 2 — Mat", date: "CONFIRM" },
  { label: "Open studio day 1", date: "CONFIRM" },
  { label: "Weekend 3 — Reformer", date: "CONFIRM" },
  { label: "Open studio day 2", date: "CONFIRM" },
  { label: "Weekend 4 — Special populations + assessment", date: "CONFIRM" },
  { label: "Open studio day 3 / sign-off", date: "CONFIRM" },
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

export default async function HomePage() {
  const data = await loadLandingData();
  const heroContent = data.sections.hero.content as HeroContent;
  const tutorsContent = data.sections.tutors.content as TutorsContent;
  const galleryContent = data.sections.gallery.content as GalleryContent;
  const pathwaysContent = data.sections.pathways.content as PathwaysContent;
  const heroImageUrl =
    data.imageUrls.get("hero-bg") ?? "/images/studio-reformers-row.jpg";

  return (
    <div className="flex flex-col min-h-screen bg-background text-brand-primary">
      <Nav />

      {/* Editable hero (template-driven). Sign Up Now button inside is
          hard-wired. Apply button (label editable) scrolls to #apply. */}
      {data.sections.hero.template === "split-screen" ? (
        <HeroSplitScreen content={heroContent} imageUrl={heroImageUrl} />
      ) : (
        <HeroFullBleed content={heroContent} imageUrl={heroImageUrl} />
      )}

      <CoursePillars />
      <WhoThisIsFor />
      <WhatYouLearn />
      <FourWeekends />

      {/* Editable tutors */}
      {data.sections.tutors.template === "alternating-rows" ? (
        <TutorsAlternatingRows
          content={tutorsContent}
          imageUrls={data.imageUrls}
        />
      ) : (
        <TutorsSideBySide
          content={tutorsContent}
          imageUrls={data.imageUrls}
        />
      )}

      <ImageBreak />

      {/* Editable studio gallery */}
      {data.sections.gallery.template === "equal-grid" ? (
        <GalleryEqualGrid content={galleryContent} imageUrls={data.imageUrls} />
      ) : (
        <GalleryMosaic content={galleryContent} imageUrls={data.imageUrls} />
      )}

      <WhatYouGet />

      {/* Editable pathways */}
      {data.sections.pathways.template === "comparison-table" ? (
        <PathwaysComparisonTable content={pathwaysContent} />
      ) : (
        <PathwaysCards content={pathwaysContent} />
      )}

      <Timeline />
      <WhyBalance />
      <Faqs />
      <ApplicationSection />
      <FinalCta />
      <Footer />
    </div>
  );
}

// ------------------------------------------------------------------
// Nav — Log In + Sign Up always visible. Required.
// ------------------------------------------------------------------
function Nav() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/balance-logo.jpg"
            alt="balance"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-xl tracking-wide font-light">balance</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 sm:px-5 py-2 text-sm text-brand-primary hover:text-brand-sage transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 sm:px-6 py-2 bg-brand-sage text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-sage-dark transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ------------------------------------------------------------------
// Course pillars (3 image cards) — visual style from the original
// "About the Course" section.
// ------------------------------------------------------------------
function CoursePillars() {
  return (
    <section id="about" className="py-20 md:py-28 bg-brand-surface">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-brand-sage text-xs tracking-[0.3em] uppercase mb-4">
            Why this course
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary leading-tight max-w-3xl mx-auto">
            Most Pilates courses teach you exercises.
            <br />
            <span className="italic">This one teaches you how to teach.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {COURSE_PILLARS.map((p) => (
            <div key={p.title} className="group">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-lg font-medium text-brand-primary mb-3">
                {p.title}
              </h3>
              <p className="text-brand-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Who is this for — split-with-image (original style).
// ------------------------------------------------------------------
function WhoThisIsFor() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-brand-sage text-xs tracking-[0.3em] uppercase mb-4">
              Is this you?
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-brand-primary mb-8">
              Built for aspiring
              <br />
              <span className="italic">Pilates instructors</span>
            </h2>
            <div className="space-y-5">
              {WHO_THIS_IS_FOR.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-sage/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-brand-sage"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p
                    className="text-brand-primary"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[500px] rounded-2xl overflow-hidden hidden md:block">
            <Image
              src="/images/instructor-helping.jpg"
              alt="Instructor guiding a student"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// What you'll learn — outcome bullets (Kelly's content).
// ------------------------------------------------------------------
function WhatYouLearn() {
  return (
    <section className="py-20 md:py-28 bg-brand-surface">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <SectionHeader
          eyebrow="What you'll learn"
          title="By the time you finish, you'll be able to —"
        />
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
    <section id="curriculum" className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <SectionHeader
          eyebrow="The four weekends"
          title="A clear path through the course"
        />
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {WEEKENDS.map((w) => (
            <div
              key={w.n}
              className="rounded-2xl border border-brand-border bg-white p-7"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-3">
                Weekend {w.n}
              </p>
              <h3 className="text-xl font-medium text-brand-primary mb-3">
                {w.title}
              </h3>
              <p className="text-sm text-brand-primary/80 leading-relaxed">
                {w.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Full-width image break (original style, nice atmosphere).
// ------------------------------------------------------------------
function ImageBreak() {
  return (
    <section className="relative h-[50vh] md:h-[60vh]">
      <Image
        src="/images/studio-ball-workout.jpg"
        alt="Group Pilates class at balance studios"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

// ------------------------------------------------------------------
// What you get
// ------------------------------------------------------------------
function WhatYouGet() {
  return (
    <section className="py-20 md:py-28 bg-brand-surface">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <SectionHeader
          eyebrow="What you get"
          title="Everything in one package"
        />
        <div className="grid sm:grid-cols-2 gap-5 mt-12">
          {PACKAGE_ITEMS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-brand-border bg-white p-7"
            >
              <p className="text-3xl mb-3">{p.icon}</p>
              <h3 className="font-medium text-brand-primary mb-2">{p.title}</h3>
              <p className="text-sm text-brand-primary/80 leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Timeline
// ------------------------------------------------------------------
function Timeline() {
  return (
    <section className="py-20 md:py-28 bg-brand-surface">
      <div className="max-w-3xl mx-auto px-5 md:px-6">
        <SectionHeader eyebrow="The timeline" title="Save the dates" />
        <ul className="mt-12 space-y-2">
          {TIMELINE.map((item, i) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border border-brand-border bg-white"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-7 h-7 rounded-full bg-brand-sage/10 text-brand-sage border border-brand-sage/30 flex items-center justify-center shrink-0 text-xs font-medium">
                  {i + 1}
                </div>
                <span className="text-brand-primary font-medium truncate">
                  {item.label}
                </span>
              </div>
              <span className="text-sm text-brand-muted shrink-0">
                {item.date}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs text-brand-muted">
          Check against your diary before you apply. We don&rsquo;t run
          catch-up sessions.
        </p>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Why balance — stats and credibility (original section style).
// ------------------------------------------------------------------
function WhyBalance() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="text-center mb-12">
          <p className="text-brand-sage text-xs tracking-[0.3em] uppercase mb-4">
            Why balance
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary">
            Built on real studio experience
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden">
            <Image
              src="/images/studio-welcome.jpg"
              alt="balance studio"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-brand-muted leading-relaxed mb-5">
              You&rsquo;re not learning in a hotel function room from a
              roving trainer. You&rsquo;re learning at a working studio with
              thousands of clients across Kildare and Wicklow, taught by
              people who run classes every week.
            </p>
            <p className="text-brand-muted leading-relaxed mb-8">
              Every section of the course has been shaped by what actually
              works on the studio floor — not just textbooks.
            </p>
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              <Stat value="5" label="Studios" />
              <Stat value="1000+" label="Clients trained" />
              <Stat value="8+" label="Years experience" />
            </div>
            <p className="text-xs text-brand-muted mt-6">
              CONFIRM stats with Kelly before launch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl sm:text-3xl font-light text-brand-primary">
        {value}
      </p>
      <p className="text-xs text-brand-muted tracking-wider uppercase mt-1">
        {label}
      </p>
    </div>
  );
}

// ------------------------------------------------------------------
// FAQs
// ------------------------------------------------------------------
function Faqs() {
  return (
    <section className="py-20 md:py-28 bg-brand-surface">
      <div className="max-w-3xl mx-auto px-5 md:px-6">
        <SectionHeader
          eyebrow="FAQs"
          title="The questions everyone asks"
        />
        <div className="mt-12 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-brand-border bg-white p-5"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span className="font-medium text-brand-primary">{f.q}</span>
                <span className="text-brand-sage transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-brand-primary/80 leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Application form
// ------------------------------------------------------------------
function ApplicationSection() {
  return (
    <section id="apply" className="py-20 md:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-5 md:px-6">
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
// Final CTA — original style (full-width photo + Sign Up button).
// ------------------------------------------------------------------
function FinalCta() {
  return (
    <section className="relative py-28 md:py-36 text-center">
      <div className="absolute inset-0">
        <Image
          src="/images/studio-mirror.jpg"
          alt="balance studio"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-primary/80" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-6 text-white">
        <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
          Your Pilates career starts here
        </h2>
        <p className="text-white/75 text-lg mb-12 leading-relaxed">
          Join the next cohort of balance-trained instructors. Expert
          guidance, structured learning, real results.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-sage text-white text-xs tracking-[0.25em] uppercase rounded-full hover:bg-brand-sage-dark transition-colors font-medium"
          >
            Sign Up Now
          </Link>
          <a
            href="#apply"
            className="inline-flex items-center justify-center px-10 py-4 text-xs tracking-[0.25em] uppercase rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors"
          >
            Apply for a pathway
          </a>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Footer
// ------------------------------------------------------------------
function Footer() {
  return (
    <footer className="px-5 md:px-8 pt-14 pb-10 bg-brand-primary text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/images/balance-logo.jpg"
                alt="balance"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-xl tracking-wide font-light">
                balance studios
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Pilates instructor training, mat &amp; reformer. Dublin.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-brand-sage-light mb-3">
              Contact
            </p>
            <p className="text-sm text-white/85">
              {/* CONFIRM email */}
              <a
                href="mailto:hello@balancestudios.ie"
                className="hover:text-brand-sage-light"
              >
                hello@balancestudios.ie
              </a>
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-brand-sage-light mb-3">
              Links
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/balancestudios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/85 hover:text-brand-sage-light"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://balancestudios.ie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/85 hover:text-brand-sage-light"
                >
                  balance studio site
                </a>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-white/85 hover:text-brand-sage-light"
                >
                  Student log-in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-white/85 hover:text-brand-sage-light"
                >
                  Sign up
                </Link>
              </li>
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
function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-4">
        {eyebrow}
      </p>
      <h2 className="text-3xl md:text-4xl font-light text-brand-primary leading-tight max-w-3xl mx-auto">
        {title}
      </h2>
    </div>
  );
}
