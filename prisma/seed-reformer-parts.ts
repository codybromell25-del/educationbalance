import { PrismaClient, PartType } from "@prisma/client";

const prisma = new PrismaClient();

const SECTION_SLUG = "reformer-certification";

const parts: Array<{
  title: string;
  type: PartType;
  body?: string;
  videoUrl?: string;
  fileUrl?: string;
}> = [
  {
    title: "Understanding the reformer",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "Springs — resistance, load and leverage",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "Equipment setup and safety",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "Reformer exercise demonstrations",
    type: PartType.VIDEO,
    body: "<p><em>Written content coming soon.</em></p>",
    videoUrl: null as unknown as string,
  },
  {
    title: "Programming reformer classes",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
  },
  {
    title: "Units 3 and 4 MCQ exam",
    type: PartType.QUIZ,
  },
  {
    title: "Video teaching submission",
    type: PartType.SUBMIT,
    body: "<p><em>Submission instructions coming soon.</em></p>",
  },
  {
    title: "Additional reading — Unit 4 workbook",
    type: PartType.DOWNLOAD,
    fileUrl: null as unknown as string,
  },
  {
    title: "Reformer practical assessment information",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
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
