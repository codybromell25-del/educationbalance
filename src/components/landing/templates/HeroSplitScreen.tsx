import Image from "next/image";
import type { HeroContent } from "@/lib/landing/config";

export default function HeroSplitScreen({
  content,
  imageUrl,
}: {
  content: HeroContent;
  imageUrl: string;
}) {
  const [l1, l2, l3, l4] = content.headlineLines;
  return (
    <section
      id="top"
      className="relative min-h-screen pt-16 grid md:grid-cols-2 bg-brand-surface"
    >
      {/* Text side */}
      <div className="flex items-center px-5 md:px-12 py-16">
        <div className="max-w-xl">
          <p className="text-brand-sage text-xs sm:text-sm tracking-[0.35em] uppercase mb-5">
            {content.tagline}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light leading-[1.05] tracking-tight text-brand-primary mb-8">
            {l1}
            {l2 && (
              <>
                <br />
                {l2}
              </>
            )}
            {l3 && (
              <>
                <br />
                {l3}{" "}
              </>
            )}
            {l4 && <span className="italic">{l4}</span>}
          </h1>
          <p className="text-brand-primary/80 text-base sm:text-lg mb-10 leading-relaxed">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <a
              href="#apply"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-primary text-white text-xs tracking-[0.25em] uppercase rounded-full hover:bg-brand-primary/90 transition-colors"
            >
              {content.ctaPrimaryLabel}
            </a>
            <a
              href="#overview"
              className="inline-flex items-center justify-center px-8 py-3.5 text-xs tracking-[0.25em] uppercase rounded-full border border-brand-border text-brand-primary hover:bg-white transition-colors"
            >
              {content.ctaSecondaryLabel}
            </a>
          </div>
          <p className="mt-8 text-sm text-brand-muted">{content.cohortDates}</p>
        </div>
      </div>
      {/* Image side */}
      <div className="relative min-h-[400px] md:min-h-full">
        <Image
          src={imageUrl}
          alt="balance studios"
          fill
          priority
          className="object-cover"
        />
      </div>
    </section>
  );
}
