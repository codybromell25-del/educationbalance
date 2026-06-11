import { prisma } from "@/lib/db";
import { loadLandingData } from "@/lib/landing/loader";
import {
  SECTION_REGISTRY,
  type HeroContent,
  type TutorsContent,
  type GalleryContent,
  type PathwaysContent,
} from "@/lib/landing/config";
import HeroEditor from "@/components/admin/landing/HeroEditor";
import TutorsEditor from "@/components/admin/landing/TutorsEditor";
import GalleryEditor from "@/components/admin/landing/GalleryEditor";
import PathwaysEditor from "@/components/admin/landing/PathwaysEditor";
import ImageSlotEditor from "@/components/admin/landing/ImageSlotEditor";

export default async function AdminLandingPage() {
  const data = await loadLandingData();
  // Which slots currently have a custom upload (so we know whether to
  // show a "Reset to default" button)
  const customAssets = new Set(
    (await prisma.landingAsset.findMany({ select: { slot: true } })).map(
      (a) => a.slot,
    ),
  );

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          Landing page editor
        </h1>
        <p className="text-brand-muted mt-2">
          Pick a template for each section and edit its content + images. Saves
          appear on the public site immediately.
        </p>
      </div>

      {/* HERO */}
      <SectionWrapper title={SECTION_REGISTRY.hero.label}>
        <HeroEditor
          initialTemplate={data.sections.hero.template}
          initialContent={data.sections.hero.content as HeroContent}
        />
        <SlotsBlock
          slots={SECTION_REGISTRY.hero.assetSlots.map((s) => ({
            key: s.key,
            label: s.label,
            currentUrl: data.imageUrls.get(s.key) ?? s.fallback,
            hasCustom: customAssets.has(s.key),
          }))}
        />
      </SectionWrapper>

      {/* TUTORS */}
      <SectionWrapper title={SECTION_REGISTRY.tutors.label}>
        <TutorsEditor
          initialTemplate={data.sections.tutors.template}
          initialContent={data.sections.tutors.content as TutorsContent}
        />
        <SlotsBlock
          slots={SECTION_REGISTRY.tutors.assetSlots.map((s) => ({
            key: s.key,
            label: s.label,
            currentUrl: data.imageUrls.get(s.key) ?? s.fallback,
            hasCustom: customAssets.has(s.key),
          }))}
        />
      </SectionWrapper>

      {/* GALLERY */}
      <SectionWrapper title={SECTION_REGISTRY.gallery.label}>
        <GalleryEditor
          initialTemplate={data.sections.gallery.template}
          initialContent={data.sections.gallery.content as GalleryContent}
        />
        <SlotsBlock
          slots={SECTION_REGISTRY.gallery.assetSlots.map((s) => ({
            key: s.key,
            label: s.label,
            currentUrl: data.imageUrls.get(s.key) ?? s.fallback,
            hasCustom: customAssets.has(s.key),
          }))}
        />
      </SectionWrapper>

      {/* PATHWAYS */}
      <SectionWrapper title={SECTION_REGISTRY.pathways.label}>
        <PathwaysEditor
          initialTemplate={data.sections.pathways.template}
          initialContent={data.sections.pathways.content as PathwaysContent}
        />
      </SectionWrapper>
    </div>
  );
}

function SectionWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm tracking-[0.3em] uppercase text-brand-sage">
          {title}
        </h2>
      </div>
      <div className="bg-white rounded-2xl border border-brand-border p-5 md:p-7 space-y-6">
        {children}
      </div>
    </section>
  );
}

function SlotsBlock({
  slots,
}: {
  slots: Array<{
    key: string;
    label: string;
    currentUrl: string;
    hasCustom: boolean;
  }>;
}) {
  if (slots.length === 0) return null;
  return (
    <div className="pt-5 border-t border-brand-border">
      <p className="text-xs tracking-wider uppercase text-brand-muted mb-3">
        Images
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {slots.map((s) => (
          <ImageSlotEditor
            key={s.key}
            slot={s.key}
            label={s.label}
            currentUrl={s.currentUrl}
            hasCustom={s.hasCustom}
          />
        ))}
      </div>
    </div>
  );
}
