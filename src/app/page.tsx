// Public landing page for balance studios — the blended version.
//
// Every section is editable from /admin/landing. Hard-wired bits that
// can't be moved or removed:
//   - Top nav Log In + Sign Up buttons (always go to /login + /signup)
//   - Hero Sign Up Now button (always goes to /signup)
//   - Final CTA primary button (always goes to /signup)
//
// Defaults for every section live in src/lib/landing/config.ts.
// Schema + loader / image-resolution in src/lib/landing/loader.ts.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ApplicationForm from "@/components/landing/ApplicationForm";
import HeroFullBleed from "@/components/landing/templates/HeroFullBleed";
import HeroSplitScreen from "@/components/landing/templates/HeroSplitScreen";
import TutorsSideBySide from "@/components/landing/templates/TutorsSideBySide";
import TutorsAlternatingRows from "@/components/landing/templates/TutorsAlternatingRows";
import TutorsFeaturedPlusRow from "@/components/landing/templates/TutorsFeaturedPlusRow";
import GalleryMosaic from "@/components/landing/templates/GalleryMosaic";
import GalleryEqualGrid from "@/components/landing/templates/GalleryEqualGrid";
import PathwaysCards from "@/components/landing/templates/PathwaysCards";
import PathwaysComparisonTable from "@/components/landing/templates/PathwaysComparisonTable";
import { loadLandingData } from "@/lib/landing/loader";
import type {
  HeroContent,
  CoursePillarsContent,
  WhoForContent,
  WhatYouLearnContent,
  WeekendsContent,
  TutorsContent,
  GalleryContent,
  WhatYouGetContent,
  PathwaysContent,
  TimelineContent,
  WhyBalanceContent,
  FaqsContent,
  FinalCtaContent,
  FooterContent,
} from "@/lib/landing/config";

export const metadata: Metadata = {
  title: "balance studios | Pilates Instructor Training",
  description:
    "A four-weekend Pilates instructor training course at balance studios. Three pathways: comprehensive, mat-only, reformer-only.",
};

export default async function HomePage() {
  const data = await loadLandingData();
  const hero = data.sections.hero.content as HeroContent;
  const coursePillars = data.sections["course-pillars"].content as CoursePillarsContent;
  const whoFor = data.sections["who-for"].content as WhoForContent;
  const whatLearn = data.sections["what-you-learn"].content as WhatYouLearnContent;
  const weekends = data.sections.weekends.content as WeekendsContent;
  const tutors = data.sections.tutors.content as TutorsContent;
  const gallery = data.sections.gallery.content as GalleryContent;
  const whatGet = data.sections["what-you-get"].content as WhatYouGetContent;
  const pathways = data.sections.pathways.content as PathwaysContent;
  const timeline = data.sections.timeline.content as TimelineContent;
  const whyBalance = data.sections["why-balance"].content as WhyBalanceContent;
  const faqs = data.sections.faqs.content as FaqsContent;
  const finalCta = data.sections["final-cta"].content as FinalCtaContent;
  const footer = data.sections.footer.content as FooterContent;
  const heroImageUrl = data.imageUrls.get("hero-bg") ?? "/images/studio-bray-hero.jpg";

  return (
    <div className="flex flex-col min-h-screen bg-background text-brand-primary">
      <Nav />

      {data.sections.hero.template === "split-screen" ? (
        <HeroSplitScreen content={hero} imageUrl={heroImageUrl} />
      ) : (
        <HeroFullBleed content={hero} imageUrl={heroImageUrl} />
      )}

      <BrandMoment />
      <CoursePillars content={coursePillars} imageUrls={data.imageUrls} />
      <WhoFor content={whoFor} imageUrls={data.imageUrls} />
      <WhatYouLearn content={whatLearn} />
      <FourWeekends content={weekends} />

      {data.sections.tutors.template === "alternating-rows" ? (
        <TutorsAlternatingRows content={tutors} imageUrls={data.imageUrls} />
      ) : data.sections.tutors.template === "side-by-side" ? (
        <TutorsSideBySide content={tutors} imageUrls={data.imageUrls} />
      ) : (
        <TutorsFeaturedPlusRow content={tutors} imageUrls={data.imageUrls} />
      )}

      <ImageBreak imageUrls={data.imageUrls} />

      {data.sections.gallery.template === "equal-grid" ? (
        <GalleryEqualGrid content={gallery} imageUrls={data.imageUrls} />
      ) : (
        <GalleryMosaic content={gallery} imageUrls={data.imageUrls} />
      )}

      <WhatYouGet content={whatGet} />

      {data.sections.pathways.template === "comparison-table" ? (
        <PathwaysComparisonTable content={pathways} />
      ) : (
        <PathwaysCards content={pathways} />
      )}

      <Timeline content={timeline} />
      <WhyBalance content={whyBalance} imageUrls={data.imageUrls} />
      <Faqs content={faqs} />
      <ApplicationSection />
      <FinalCta content={finalCta} imageUrls={data.imageUrls} />
      <Footer content={footer} />
    </div>
  );
}

// ------------------------------------------------------------------
// Nav — hard-wired Log In + Sign Up.
// ------------------------------------------------------------------
function Nav() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/balance-logo.jpg"
            alt="balance"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-lg sm:text-xl tracking-wide font-light">
            balance
          </span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/login"
            className="px-2.5 sm:px-4 py-2 text-sm text-brand-primary hover:text-brand-sage transition-colors"
          >
            Log In
          </Link>
          {/* Scrolls to the pricing section (#pathways) so users can pick
              a pathway + payment plan and go straight to Stripe checkout. */}
          <a
            href="#pathways"
            className="inline-flex items-center justify-center px-3.5 sm:px-6 h-9 sm:h-10 bg-brand-sage text-white text-[11px] sm:text-sm font-medium sm:font-normal tracking-wide sm:tracking-wider uppercase rounded-full hover:bg-brand-sage-dark transition-colors whitespace-nowrap"
          >
            <span className="sm:hidden">Book now</span>
            <span className="hidden sm:inline">Book your space now</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

// ------------------------------------------------------------------
// Brand moment — plays the first 4s of the logo render and loops
// continuously. Masked into a circle so the corners of the render are
// cropped off.
// ------------------------------------------------------------------
function BrandMoment() {
  return (
    <section className="pt-14 md:pt-20 pb-4 md:pb-6 bg-brand-surface">
      <div className="max-w-3xl mx-auto px-5 md:px-6 text-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden shadow-lg bg-brand-surface">
          <video
            src="/videos/balance-logo-spin.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover scale-125"
            aria-label="balance studios logo"
          />
        </div>
        <p className="mt-8 text-xs tracking-[0.4em] uppercase text-brand-sage">
          balance studios
        </p>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Course pillars — CMS-driven 3 image cards.
// ------------------------------------------------------------------
function CoursePillars({
  content,
  imageUrls,
}: {
  content: CoursePillarsContent;
  imageUrls: Map<string, string>;
}) {
  const [l1, l2] = content.headlineLines;
  const hasHeader = Boolean(content.eyebrow) || Boolean(l1) || Boolean(l2);

  return (
    <section
      id="about"
      className={`${
        hasHeader ? "pt-8 md:pt-12" : "pt-20 md:pt-28"
      } pb-20 md:pb-28 bg-brand-surface`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        {hasHeader && (
          <div className="text-center mb-14 md:mb-20">
            {content.eyebrow && (
              <p className="text-brand-sage text-sm md:text-base tracking-[0.35em] uppercase mb-5">
                {content.eyebrow}
              </p>
            )}
            {l1 && (
              <h2 className="text-2xl md:text-3xl font-light tracking-tight text-brand-primary leading-snug max-w-4xl mx-auto">
                {l1}
              </h2>
            )}
            {l2 && (
              <p className="mt-4 md:mt-5 text-lg md:text-2xl italic text-brand-primary leading-snug md:whitespace-nowrap">
                {l2}
              </p>
            )}
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          {content.pillars.map((p, i) => (
            <div key={i} className="group">
              <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden mb-6 bg-brand-primary">
                <Image
                  src={imageUrls.get(p.slotKey) ?? "/images/studio-wide.jpg"}
                  alt={p.title}
                  fill
                  className={`object-cover ${
                    i % 2 === 0 ? "animate-pan-lr" : "animate-pan-rl"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/70" />
              </div>
              <h3 className="text-lg font-medium text-brand-primary mb-3">{p.title}</h3>
              {p.breakdown && p.breakdown.length > 0 && (
                <ul className="mb-4 space-y-3">
                  {p.breakdown.map((row, ri) => (
                    <li key={ri}>
                      <p className="text-brand-sage text-[11px] tracking-[0.18em] uppercase font-medium mb-1">
                        {row.label}
                      </p>
                      <p className="text-brand-muted text-sm leading-relaxed">
                        {row.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              {p.desc && (
                <p className="text-brand-muted leading-relaxed">{p.desc}</p>
              )}
              {p.paragraphs && p.paragraphs.length > 0 && (
                <div className={`${p.desc ? "mt-4" : ""} space-y-4`}>
                  {p.paragraphs.map((para, pi) => (
                    <p
                      key={pi}
                      className="text-sm text-brand-muted leading-relaxed"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Who is this for — CMS-driven (split with side image).
// ------------------------------------------------------------------
function WhoFor({
  content,
  imageUrls,
}: {
  content: WhoForContent;
  imageUrls: Map<string, string>;
}) {
  const [l1, l2] = content.headlineLines;
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-brand-sage text-xs tracking-[0.3em] uppercase mb-4">
              {content.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-brand-primary mb-8">
              {l1}
              {l2 && (
                <>
                  <br />
                  <span className="italic">{l2}</span>
                </>
              )}
            </h2>
            <div className="space-y-5">
              {content.bullets.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-sage/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-brand-sage"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-brand-primary">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[500px] rounded-2xl overflow-hidden hidden md:block">
            <Image
              src={imageUrls.get("who-for") ?? "/images/instructor-helping.jpg"}
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
function WhatYouLearn({ content }: { content: WhatYouLearnContent }) {
  return (
    <section className="py-20 md:py-28 bg-brand-surface">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} />
        <ul className="mt-12 grid md:grid-cols-2 gap-x-10 gap-y-5">
          {content.bullets.map((item) => (
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
function FourWeekends({ content }: { content: WeekendsContent }) {
  return (
    <section id="curriculum" className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} />
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {content.weekends.map((w) => (
            <div
              key={w.n}
              className="rounded-2xl border border-brand-border bg-white p-7"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-3">
                Weekend {w.n}
              </p>
              <h3 className="text-xl font-medium text-brand-primary mb-3">{w.title}</h3>
              <p className="text-sm text-brand-primary/80 leading-relaxed">{w.body}</p>
              {w.bullets && w.bullets.length > 0 && (
                <>
                  <p className="mt-5 text-xs tracking-[0.2em] uppercase text-brand-muted">
                    What you&apos;ll cover
                  </p>
                  <ul className="mt-3 space-y-2">
                    {w.bullets.map((b, bi) => (
                      <li
                        key={bi}
                        className="flex items-start gap-2 text-sm text-brand-primary/85 leading-relaxed"
                      >
                        <span className="text-brand-sage shrink-0 mt-1">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
function ImageBreak({ imageUrls }: { imageUrls: Map<string, string> }) {
  return (
    <section className="relative h-[50vh] md:h-[60vh]">
      <Image
        src={imageUrls.get("image-break") ?? "/images/studio-ball-workout.jpg"}
        alt="balance studios"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

// ------------------------------------------------------------------
function WhatYouGet({ content }: { content: WhatYouGetContent }) {
  return (
    <section className="py-20 md:py-28 bg-brand-surface">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} />
        <div className="grid sm:grid-cols-2 gap-5 mt-12">
          {content.items.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-brand-border bg-white p-7"
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
function Timeline({ content }: { content: TimelineContent }) {
  return (
    <section className="py-20 md:py-28 bg-brand-surface">
      <div className="max-w-3xl mx-auto px-5 md:px-6">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} />
        <ul className="mt-12 space-y-2">
          {content.items.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border border-brand-border bg-white"
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
        {content.footnote && (
          <p className="mt-6 text-center text-xs text-brand-muted">{content.footnote}</p>
        )}
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
function WhyBalance({
  content,
  imageUrls,
}: {
  content: WhyBalanceContent;
  imageUrls: Map<string, string>;
}) {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="text-center mb-12">
          <p className="text-brand-sage text-xs tracking-[0.3em] uppercase mb-4">
            {content.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-brand-primary">
            {content.title}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden">
            <Image
              src={imageUrls.get("why-balance") ?? "/images/studio-welcome.jpg"}
              alt="balance studio"
              fill
              className="object-cover"
            />
          </div>
          <div>
            {content.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-brand-muted leading-relaxed mb-5 last:mb-8"
              >
                {p}
              </p>
            ))}
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              {content.stats.map((s, i) => (
                <div key={i}>
                  <p className="text-2xl sm:text-3xl font-light text-brand-primary">
                    {s.value}
                  </p>
                  <p className="text-xs text-brand-muted tracking-wider uppercase mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
function Faqs({ content }: { content: FaqsContent }) {
  return (
    <section className="py-20 md:py-28 bg-brand-surface">
      <div className="max-w-3xl mx-auto px-5 md:px-6">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} />
        <div className="mt-12 space-y-3">
          {content.items.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border border-brand-border bg-white p-5"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span className="font-medium text-brand-primary">{f.q}</span>
                <span className="text-brand-sage transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-brand-primary/80 leading-relaxed whitespace-pre-wrap">
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
function ApplicationSection() {
  return (
    <section id="apply" className="py-20 md:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-5 md:px-6">
        <SectionHeader
          eyebrow="Express interest"
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
function FinalCta({
  content,
  imageUrls,
}: {
  content: FinalCtaContent;
  imageUrls: Map<string, string>;
}) {
  return (
    <section className="relative py-28 md:py-36 text-center">
      <div className="absolute inset-0">
        <Image
          src={imageUrls.get("final-cta-bg") ?? "/images/studio-mirror.jpg"}
          alt="balance studio"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-primary/80" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-6 text-white">
        <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
          {content.title}
        </h2>
        <p className="text-white/75 text-lg mb-12 leading-relaxed">
          {content.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Primary scrolls to #pathways (pricing + Stripe). Secondary
              still scrolls to #apply for users who want to ask first. */}
          <a
            href="#pathways"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-sage text-white text-xs tracking-[0.25em] uppercase rounded-full hover:bg-brand-sage-dark transition-colors font-medium"
          >
            {content.primaryLabel}
          </a>
          <a
            href="#apply"
            className="inline-flex items-center justify-center px-10 py-4 text-xs tracking-[0.25em] uppercase rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors"
          >
            {content.secondaryLabel}
          </a>
        </div>
        {content.bookingLine && (
          <p className="mt-10 text-white/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {content.bookingLine}
          </p>
        )}
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
function Footer({ content }: { content: FooterContent }) {
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
              <span className="text-xl tracking-wide font-light">balance studios</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              {content.tagline}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-brand-sage-light mb-3">
              Contact
            </p>
            <p className="text-sm text-white/85">
              <a href={`mailto:${content.contactEmail}`} className="hover:text-brand-sage-light">
                {content.contactEmail}
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
                  href={content.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/85 hover:text-brand-sage-light"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={content.studioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/85 hover:text-brand-sage-light"
                >
                  balance studio site
                </a>
              </li>
              <li>
                <Link href="/login" className="text-white/85 hover:text-brand-sage-light">
                  Student log-in
                </Link>
              </li>
              <li>
                <a
                  href="#pathways"
                  className="text-white/85 hover:text-brand-sage-light"
                >
                  Book your space
                </a>
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
function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
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
