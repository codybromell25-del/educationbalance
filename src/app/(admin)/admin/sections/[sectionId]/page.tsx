import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PartsManager from "@/components/admin/PartsManager";

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: {
      parts: {
        orderBy: { order: "asc" },
        include: {
          quiz: { select: { id: true, _count: { select: { questions: true } } } },
        },
      },
    },
  });

  if (!section) notFound();

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/admin/sections"
          className="text-sm text-brand-muted hover:text-brand-primary"
        >
          ← All sections
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-xs text-brand-sage tracking-[0.3em] uppercase mb-2">
          Section {section.order}
        </p>
        <h1 className="text-3xl font-light tracking-tight text-brand-primary">
          {section.title}
        </h1>
        <p className="text-brand-muted mt-2">{section.description}</p>
      </div>

      <PartsManager
        sectionId={section.id}
        initialParts={section.parts.map((p) => ({
          id: p.id,
          order: p.order,
          title: p.title,
          type: p.type,
          body: p.body,
          videoUrl: p.videoUrl,
          fileUrl: p.fileUrl,
          quizId: p.quiz?.id ?? null,
          quizQuestionCount: p.quiz?._count.questions ?? null,
        }))}
      />
    </div>
  );
}
