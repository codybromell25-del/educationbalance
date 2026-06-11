import Image from "next/image";
import type { HeroContent } from "@/lib/landing/config";

export default function HeroFullBleed({
  content,
  imageUrl,
}: {
  content: HeroContent;
  imageUrl: string;
}) {
  const [l1, l2, l3, l4] = content.headlineLines;
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt="balance studios"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/40 to-black/20" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 text-white py-20">
        <p className="text-brand-sage-light text-xs sm:text-sm tracking-[0.35em] uppercase mb-5">
          {content.tagline}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-[1.05] tracking-tight mb-8">
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
        <p className="text-white/85 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
          {content.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <a
            href="#apply"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-sage text-white text-xs tracking-[0.25em] uppercase rounded-full hover:bg-brand-sage-dark transition-colors"
          >
            {content.ctaPrimaryLabel}
          </a>
          <a
            href="#overview"
            className="inline-flex items-center justify-center px-8 py-3.5 text-xs tracking-[0.25em] uppercase rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors"
          >
            {content.ctaSecondaryLabel}
          </a>
        </div>
        <p className="mt-8 text-sm text-white/70">{content.cohortDates}</p>
      </div>
    </section>
  );
}
