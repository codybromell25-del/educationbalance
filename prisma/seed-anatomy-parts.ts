import { PrismaClient, PartType } from "@prisma/client";

const prisma = new PrismaClient();

const SECTION_SLUG = "functional-anatomy";

const parts: Array<{
  title: string;
  type: PartType;
  body?: string;
  videoUrl?: string;
  fileUrl?: string;
}> = [
  {
    title: "How to use anatomy as a Pilates instructor",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "Movement terminology",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
  },
  {
    title: "The skeletal system",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "Joints and how they move",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "The spine in detail",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "The muscular system",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "Key muscles: the core",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "Key muscles: the hip and pelvis",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "Key muscles: shoulder and upper body",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "Key muscles: lower leg and foot",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "The nervous system basics",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
  },
  {
    title: "Compensations and injury awareness",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
  },
  {
    title: "Additional reading — Unit 2 workbook",
    type: PartType.DOWNLOAD,
    fileUrl: null as unknown as string,
  },
  {
    title: "Unit 2 MCQ exam",
    type: PartType.QUIZ,
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
