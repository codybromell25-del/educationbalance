import Image from "next/image";
import type { TutorsContent } from "@/lib/landing/config";

export default function TutorsSideBySide({
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
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-4">
            Meet the tutors
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-brand-primary leading-tight">
            Real teachers, real studio time
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {content.tutors.map((t) => (
            <div key={t.name} className="flex flex-col items-start">
              <div className="relative w-full aspect-[4/5] mb-5 rounded-2xl overflow-hidden bg-brand-surface">
                <Image
                  src={imageUrls.get(t.slotKey) ?? "/images/balance-09.jpg"}
                  alt={t.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-2">
                {t.role}
              </p>
              <h3 className="text-2xl font-light text-brand-primary mb-3">
                {t.name}
              </h3>
              <p className="text-sm text-brand-primary/80 leading-relaxed">
                {t.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
