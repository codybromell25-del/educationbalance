import { PrismaClient, PartType } from "@prisma/client";

const prisma = new PrismaClient();

const SECTION_SLUG = "teaching-practice";

const parts: Array<{
  title: string;
  type: PartType;
  body?: string;
  videoUrl?: string;
  fileUrl?: string;
}> = [
  {
    title: "Teaching practice — the three tiers explained",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "Observation hours — how to make the most of them",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
  },
  {
    title: "Self-practice guidance",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
  },
  {
    title: "Download all log templates",
    type: PartType.DOWNLOAD,
    fileUrl: null as unknown as string,
  },
  {
    title: "Upload observation log portfolio",
    type: PartType.SUBMIT,
    body: "<p><em>Upload your completed observation log portfolio here. Instructions coming soon.</em></p>",
  },
  {
    title: "Upload teaching practice log portfolio",
    type: PartType.SUBMIT,
    body: "<p><em>Upload your completed teaching practice log portfolio here. Instructions coming soon.</em></p>",
  },
  {
    title: "Upload self-practice log portfolio",
    type: PartType.SUBMIT,
    body: "<p><em>Upload your completed self-practice log portfolio here. Instructions coming soon.</em></p>",
  },
  {
    title: "Certification hours summary",
    type: PartType.SUBMIT,
    body: "<p><em>Summarise your total certification hours. Instructions coming soon.</em></p>",
  },
];

async function main() {
  const section = await prisma.section.findUnique({
    where: { slug: SECTION_SLUG },
  });
  if (!section) {
    throw new Error(`Section not found: ${SECTION_SLUG}`);
  }

  await prisma.part.deleteMany({ where: { sectionId: section.id } });

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const created = await prisma.part.create({
      data: {
        sectionId: section.id,
        order: i + 1,
        title: p.title,
        type: p.type,
        body: p.body ?? null,
        videoUrl: p.videoUrl ?? null,
        fileUrl: p.fileUrl ?? null,
      },
    });

    if (p.type === PartType.QUIZ) {
      await prisma.quiz.create({
        data: { partId: created.id, passingScore: 70 },
      });
    }
  }

  console.log(`Seeded ${parts.length} parts for ${SECTION_SLUG}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
