import Image from "next/image";
import type { TutorsContent } from "@/lib/landing/config";

/**
 * "Meet the instructors" — course director featured on top, a row of
 * smaller circular avatars for the rest. Matches the sage-pill /
 * italic-serif look from the Riverflow Soft Studio reference.
 *
 * Tutors with no uploaded photo render as a diagonal-striped placeholder
 * so unfilled slots read clearly as "joining soon" rather than blank.
 */
export default function TutorsFeaturedPlusRow({
  content,
  imageUrls,
}: {
  content: TutorsContent;
  imageUrls: Map<string, string>;
}) {
  const [featured, ...rest] = content.tutors;
  if (!featured) return null;

  const featuredImg = imageUrls.get(featured.slotKey);

  return (
    <section
      id="tutors"
      className="py-20 md:py-28 px-5 md:px-8 bg-white border-y border-brand-border"
    >
      <div className="max-w-6xl mx-auto text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-xs tracking-[0.3em] uppercase mb-6">
          The team
        </span>
        <h2 className="font-heading italic text-4xl md:text-5xl text-brand-primary mb-14 md:mb-16 leading-tight">
          Meet the instructors.
        </h2>

        {/* Featured — Kelly on top over everyone else */}
        <div className="flex flex-col items-center mb-14 md:mb-16">
          <Avatar src={featuredImg} label={featured.name} large />
          <p className="mt-6 text-2xl md:text-3xl font-heading italic text-brand-primary">
            {featured.name}
          </p>
          {featured.role && (
            <p className="mt-2 text-sm text-brand-muted max-w-md">
              {featured.role}
            </p>
          )}
        </div>

        {/* Row of the other instructors */}
        {rest.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 md:gap-x-10">
            {rest.map((t) => (
              <div
                key={t.name}
                className="flex flex-col items-center w-[150px] md:w-[170px]"
              >
                <Avatar src={imageUrls.get(t.slotKey)} label={t.name} />
                <p className="mt-4 text-lg md:text-xl font-heading italic text-brand-primary leading-tight">
                  {t.name}
                </p>
                {t.role && (
                  <p className="mt-1 text-xs text-brand-muted leading-snug">
                    {t.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Avatar({
  src,
  label,
  large = false,
}: {
  src: string | undefined;
  label: string;
  large?: boolean;
}) {
  const dims = large
    ? "w-52 h-52 md:w-64 md:h-64"
    : "w-32 h-32 md:w-40 md:h-40";

  if (src) {
    return (
      <div
        className={`relative rounded-full overflow-hidden bg-brand-surface ${dims}`}
      >
        <Image
          src={src}
          alt={label}
          fill
          className="object-cover"
          sizes={large ? "256px" : "160px"}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full flex items-center justify-center overflow-hidden ${dims}`}
      style={{
        background:
          "repeating-linear-gradient(45deg, var(--brand-surface) 0 10px, var(--brand-surface-hover) 10px 20px)",
      }}
    >
      <span className="text-[10px] tracking-[0.25em] uppercase text-brand-muted bg-white/75 px-2.5 py-1 rounded">
        instructor
      </span>
    </div>
  );
}
