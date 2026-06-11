import Image from "next/image";
import type { GalleryContent } from "@/lib/landing/config";

export default function GalleryEqualGrid({
  content,
  imageUrls,
}: {
  content: GalleryContent;
  imageUrls: Map<string, string>;
}) {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-sage mb-4">
            The studio
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-brand-primary leading-tight">
            Where you&rsquo;ll train
          </h2>
          <p className="text-brand-primary/70 max-w-2xl mx-auto mt-4">
            {content.intro}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {content.slotKeys.map((slot) => (
            <div
              key={slot}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src={imageUrls.get(slot) ?? "/images/studio-wide.jpg"}
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
