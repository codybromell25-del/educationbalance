import Image from "next/image";
import type { GalleryContent } from "@/lib/landing/config";

export default function GalleryMosaic({
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
          {content.address && (
            <p className="mt-3 text-xs tracking-[0.2em] uppercase text-brand-muted">
              {content.address}
            </p>
          )}
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {content.slotKeys.map((slot, i) => (
            <div
              key={slot}
              className={`relative overflow-hidden rounded-2xl ${
                i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
              }`}
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
