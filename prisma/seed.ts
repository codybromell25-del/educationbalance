import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcryptjs.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@balancestudios.ie" },
    update: {},
    create: {
      name: "balance Admin",
      email: "admin@balancestudios.ie",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  // Create a demo user
  const userPassword = await bcryptjs.hash("user123", 12);
  await prisma.user.upsert({
    where: { email: "demo@balancestudios.ie" },
    update: {},
    create: {
      name: "Sarah Mitchell",
      email: "demo@balancestudios.ie",
      passwordHash: userPassword,
      role: "USER",
    },
  });

  // Create 8 course sections (unlocking weekly from today)
  const startDate = new Date();
  const sections = [
    {
      title: "Foundations of Pilates",
      slug: "foundations-of-pilates",
      description:
        "Understanding the core principles, history, and philosophy behind the Pilates method.",
      content: `<h2>Welcome to Your Pilates Journey</h2>
<p>In this opening section, we explore the foundational principles that Joseph Pilates established. These principles will guide everything you learn throughout this course.</p>
<h3>The Six Principles</h3>
<ul>
<li><strong>Concentration</strong> — Focus your mind on the movement</li>
<li><strong>Control</strong> — Every movement is deliberate</li>
<li><strong>Centering</strong> — All movement radiates from your centre</li>
<li><strong>Flow</strong> — Smooth, continuous movement</li>
<li><strong>Precision</strong> — Quality over quantity</li>
<li><strong>Breathing</strong> — Breath guides movement</li>
</ul>
<p>Take time this week to observe how these principles show up in your in-person sessions.</p>`,
      order: 1,
    },
    {
      title: "Functional Anatomy",
      slug: "functional-anatomy",
      description:
        "Anatomy through the lens of a Pilates instructor — the systems, structures, and muscles you'll cue, mobilise, and strengthen.",
      content: `<p><em>Section overview coming soon.</em></p>`,
      order: 2,
    },
    {
      title: "Mat Certification",
      slug: "mat-certification",
      description:
        "The balance approach to mat teaching — class structure, cueing, exercise library, and your practical assessment.",
      content: `<p><em>Section overview coming soon.</em></p>`,
      order: 3,
    },
    {
      title: "Reformer Certification",
      slug: "reformer-certification",
      description:
        "Understanding the reformer — springs, setup, safety, exercise library, programming, and your practical assessment.",
      content: `<p><em>Section overview coming soon.</em></p>`,
      order: 4,
    },
    {
      title: "Special Populations and Modifications",
      slug: "special-populations",
      description:
        "Principles of adaptation, working with special populations, and building an inclusive class.",
      content: `<p><em>Section overview coming soon.</em></p>`,
      order: 5,
    },
    {
      title: "Teaching Practice and Assessment",
      slug: "teaching-practice",
      description:
        "Observation, teaching practice, and self-practice hours — plus how to track and submit your certification log portfolios.",
      content: `<p><em>Section overview coming soon.</em></p>`,
      order: 6,
    },
  ];

  for (let i = 0; i < sections.length; i++) {
    const unlockDate = new Date(startDate);
    unlockDate.setDate(unlockDate.getDate() + i * 7);

    const data = { ...sections[i], unlockDate };
    await prisma.section.upsert({
      where: { slug: sections[i].slug },
      update: data,
      create: data,
    });
  }

  console.log("Seed complete!");
  console.log("Admin: admin@balancestudios.ie / admin123");
  console.log("Demo user: demo@balancestudios.ie / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
