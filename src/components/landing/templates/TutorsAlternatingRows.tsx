import Image from "next/image";
import type { TutorsContent } from "@/lib/landing/config";

export default function TutorsAlternatingRows({
  content,
  imageUrls,
}: {
  content: TutorsContent;
  imageUrls: Map<string, string>;
}) {
  return (
    <section
      id="tutors"
      className="py-20 md:py-28 px-5 md:px-8 bg-white border-y border-brand-border"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-4">
            Meet the tutors
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-brand-primary leading-tight">
            Real teachers, real studio time
          </h2>
        </div>
        <div className="space-y-16 md:space-y-24">
          {content.tutors.map((t, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={t.name}
                className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
                  reverse ? "md:[direction:rtl]" : ""
                }`}
              >
                <div className="relative aspect-[4/3] md:aspect-[3/4] w-full rounded-2xl overflow-hidden bg-brand-surface md:[direction:ltr]">
                  <Image
                    src={imageUrls.get(t.slotKey) ?? "/images/balance-09.jpg"}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="md:[direction:ltr]">
                  {t.role && (
                    <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-3">
                      {t.role}
                    </p>
                  )}
                  <h3 className="text-3xl md:text-4xl font-light text-brand-primary mb-4">
                    {t.name}
                  </h3>
                  {t.bio && (
                    <p className="text-brand-primary/80 leading-relaxed">
                      {t.bio}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
