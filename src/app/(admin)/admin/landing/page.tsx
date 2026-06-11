import { prisma } from "@/lib/db";
import { loadLandingData } from "@/lib/landing/loader";
import {
  SECTION_REGISTRY,
  type SectionKey,
  type HeroContent,
  type CoursePillarsContent,
  type WhoForContent,
  type WhatYouLearnContent,
  type WeekendsContent,
  type TutorsContent,
  type GalleryContent,
  type WhatYouGetContent,
  type PathwaysContent,
  type TimelineContent,
  type WhyBalanceContent,
  type FaqsContent,
  type FinalCtaContent,
  type FooterContent,
  type AssetSlot,
} from "@/lib/landing/config";
import HeroEditor from "@/components/admin/landing/HeroEditor";
import CoursePillarsEditor from "@/components/admin/landing/CoursePillarsEditor";
import WhoForEditor from "@/components/admin/landing/WhoForEditor";
import WhatYouLearnEditor from "@/components/admin/landing/WhatYouLearnEditor";
import WeekendsEditor from "@/components/admin/landing/WeekendsEditor";
import TutorsEditor from "@/components/admin/landing/TutorsEditor";
import GalleryEditor from "@/components/admin/landing/GalleryEditor";
import WhatYouGetEditor from "@/components/admin/landing/WhatYouGetEditor";
import PathwaysEditor from "@/components/admin/landing/PathwaysEditor";
import TimelineEditor from "@/components/admin/landing/TimelineEditor";
import WhyBalanceEditor from "@/components/admin/landing/WhyBalanceEditor";
import FaqsEditor from "@/components/admin/landing/FaqsEditor";
import FinalCtaEditor from "@/components/admin/landing/FinalCtaEditor";
import FooterEditor from "@/components/admin/landing/FooterEditor";
import ImageSlotEditor from "@/components/admin/landing/ImageSlotEditor";

export default async function AdminLandingPage() {
  const data = await loadLandingData();
  const customAssets = new Set(
    (await prisma.landingAsset.findMany({ select: { slot: true } })).map(
      (a) => a.slot,
    ),
  );

  function slotsFor(sectionKey: SectionKey) {
    const cfg = SECTION_REGISTRY[sectionKey];
    return cfg.assetSlots.map((s: AssetSlot) => ({
      key: s.key,
      label: s.label,
      currentUrl: data.imageUrls.get(s.key) ?? s.fallback,
      hasCustom: customAssets.has(s.key),
    }));
  }

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          Landing page editor
        </h1>
        <p className="text-brand-muted mt-2">
          Every section of the public landing page is editable here. Saves
          appear on <code>/</code> immediately.
        </p>
      </div>

      <SectionWrapper title={SECTION_REGISTRY.hero.label}>
        <HeroEditor
          initialTemplate={data.sections.hero.template}
          initialContent={data.sections.hero.content as HeroContent}
        />
        <SlotsBlock slots={slotsFor("hero")} />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY["course-pillars"].label}>
        <CoursePillarsEditor
          initialContent={data.sections["course-pillars"].content as CoursePillarsContent}
        />
        <SlotsBlock slots={slotsFor("course-pillars")} />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY["who-for"].label}>
        <WhoForEditor
          initialContent={data.sections["who-for"].content as WhoForContent}
        />
        <SlotsBlock slots={slotsFor("who-for")} />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY["what-you-learn"].label}>
        <WhatYouLearnEditor
          initialContent={data.sections["what-you-learn"].content as WhatYouLearnContent}
        />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY.weekends.label}>
        <WeekendsEditor
          initialContent={data.sections.weekends.content as WeekendsContent}
        />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY.tutors.label}>
        <TutorsEditor
          initialTemplate={data.sections.tutors.template}
          initialContent={data.sections.tutors.content as TutorsContent}
        />
        <SlotsBlock slots={slotsFor("tutors")} />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY.gallery.label}>
        <GalleryEditor
          initialTemplate={data.sections.gallery.template}
          initialContent={data.sections.gallery.content as GalleryContent}
        />
        <SlotsBlock slots={slotsFor("gallery")} />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY["what-you-get"].label}>
        <WhatYouGetEditor
          initialContent={data.sections["what-you-get"].content as WhatYouGetContent}
        />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY.pathways.label}>
        <PathwaysEditor
          initialTemplate={data.sections.pathways.template}
          initialContent={data.sections.pathways.content as PathwaysContent}
        />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY.timeline.label}>
        <TimelineEditor
          initialContent={data.sections.timeline.content as TimelineContent}
        />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY["why-balance"].label}>
        <WhyBalanceEditor
          initialContent={data.sections["why-balance"].content as WhyBalanceContent}
        />
        <SlotsBlock slots={slotsFor("why-balance")} />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY.faqs.label}>
        <FaqsEditor
          initialContent={data.sections.faqs.content as FaqsContent}
        />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY["final-cta"].label}>
        <FinalCtaEditor
          initialContent={data.sections["final-cta"].content as FinalCtaContent}
        />
        <SlotsBlock slots={slotsFor("final-cta")} />
      </SectionWrapper>

      <SectionWrapper title={SECTION_REGISTRY.footer.label}>
        <FooterEditor
          initialContent={data.sections.footer.content as FooterContent}
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
