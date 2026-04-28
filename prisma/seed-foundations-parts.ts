import { PrismaClient, PartType } from "@prisma/client";

const prisma = new PrismaClient();

const FOUNDATIONS_SLUG = "foundations-of-pilates";

const parts: Array<{
  title: string;
  type: PartType;
  body?: string;
  videoUrl?: string;
  fileUrl?: string;
}> = [
  {
    title: "The story of Pilates",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
  },
  {
    title: "The principles — foundation",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
  },
  {
    title: "Neutral spine and pelvic positioning",
    type: PartType.VIDEO,
    videoUrl: null as unknown as string,
  },
  {
    title: "Ribcage mechanics and lateral breathing",
    type: PartType.VIDEO,
    videoUrl: null as unknown as string,
  },
  {
    title: "Core anatomy basics",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
  },
  {
    title: "Safety, contraindications and scope of practice",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
  },
  {
    title: "Ethics, professionalism and boundaries",
    type: PartType.TEXT,
    body: "<p><em>Content coming soon.</em></p>",
  },
  {
    title: "Additional reading — Unit 1 workbook",
    type: PartType.DOWNLOAD,
    fileUrl: null as unknown as string,
  },
  {
    title: "Unit 1 MCQ exam",
    type: PartType.QUIZ,
  },
  {
    title: "Ethics reflective response",
    type: PartType.SUBMIT,
    body: "<p>Reflect on the ethical principles covered in this unit and how you'll apply them in your practice. Minimum 200 words.</p>",
  },
];

async function main() {
  const section = await prisma.section.findUnique({
    where: { slug: FOUNDATIONS_SLUG },
  });
  if (!section) {
    throw new Error(`Section not found: ${FOUNDATIONS_SLUG}`);
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

  console.log(`Seeded ${parts.length} parts for ${FOUNDATIONS_SLUG}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
