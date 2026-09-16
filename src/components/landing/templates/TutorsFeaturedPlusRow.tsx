import type { TutorsContent } from "@/lib/landing/config";

/**
 * "Meet the instructors" — text-only, per Kelly's mockup (Sept 2026):
 *
 *   THE TEAM (pill)
 *   Meet the instructors.
 *   Kelly O'Neill
 *   COURSE DIRECTOR · BALANCE STUDIOS FOUNDER
 *   ───────
 *   3 × 2 grid of the other educators — italic serif name, tracked
 *   uppercase role — no photos, so the team reads as a team rather
 *   than a photo of the director plus a list.
 *
 * `imageUrls` is still accepted (the page passes it to every tutors
 * template) but deliberately unused here.
 */
export default function TutorsFeaturedPlusRow({
  content,
}: {
  content: TutorsContent;
  imageUrls?: Map<string, string>;
}) {
  const [featured, ...rest] = content.tutors;
  if (!featured) return null;

  return (
    <section
      id="tutors"
      className="py-20 md:py-28 px-5 md:px-8 bg-white border-y border-brand-border"
    >
      <div className="max-w-6xl mx-auto text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-xs tracking-[0.3em] uppercase mb-6">
          The team
        </span>
        <h2 className="font-heading italic text-4xl md:text-5xl text-brand-primary mb-4 leading-tight">
          Meet the instructors.
        </h2>
        <p className="text-lg md:text-xl text-brand-primary mb-3">
          Learn from educators who actually teach.
        </p>
        <p className="text-brand-muted max-w-2xl mx-auto mb-14 md:mb-16 leading-relaxed">
          Our education team works with clients and classes in real studio
          environments, bringing current teaching experience directly into the
          course.
        </p>

        {/* Featured — course director, name + role only */}
        <div className="flex flex-col items-center">
          <h3 className="text-3xl md:text-4xl font-heading italic text-brand-primary leading-tight">
            {featured.name}
          </h3>
          {featured.role && (
            <p className="mt-3 text-xs md:text-sm tracking-[0.3em] uppercase text-brand-muted max-w-xl">
              {featured.role}
            </p>
          )}
        </div>

        <div className="mx-auto my-12 md:my-14 h-px w-56 bg-brand-border" aria-hidden />

        {/* The rest — even 3-up grid, no photos */}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 md:gap-y-14 max-w-4xl mx-auto">
            {rest.map((t) => (
              <div key={t.name} className="flex flex-col items-center">
                <h3 className="text-xl md:text-2xl font-heading italic text-brand-primary leading-tight">
                  {t.name}
                </h3>
                {t.role && (
                  <p className="mt-2 text-[11px] md:text-xs tracking-[0.25em] uppercase text-brand-muted leading-relaxed max-w-[12rem]">
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
