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
      title: "Anatomy & Alignment",
      slug: "anatomy-and-alignment",
      description:
        "Key anatomical concepts and how proper alignment enhances your practice.",
      content: `<h2>Understanding Your Body</h2>
<p>A strong Pilates practice is built on understanding how your body moves. This section covers the essential anatomy you need to know.</p>
<h3>Key Areas of Focus</h3>
<p>We'll explore the spine, pelvis, shoulder girdle, and how they work together in movement. Understanding these relationships will transform how you cue and teach.</p>`,
      order: 2,
    },
    {
      title: "Core Activation & Breathing",
      slug: "core-activation-and-breathing",
      description:
        "Master the powerhouse — deep core engagement and lateral breathing techniques.",
      content: `<h2>The Powerhouse</h2>
<p>The core is the engine of every Pilates movement. In this section, we dive deep into how to properly activate and engage your deep stabilising muscles.</p>
<h3>Lateral Breathing</h3>
<p>Learn how to maintain core engagement while breathing fully. This is one of the most important skills you'll develop.</p>`,
      order: 3,
    },
    {
      title: "Mat Work Essentials",
      slug: "mat-work-essentials",
      description:
        "Essential mat exercises, modifications, and progressions for all levels.",
      content: `<h2>Building Your Mat Repertoire</h2>
<p>The mat is where it all begins. Master these fundamental exercises and their variations to build a strong teaching foundation.</p>`,
      order: 4,
    },
    {
      title: "Reformer Fundamentals",
      slug: "reformer-fundamentals",
      description:
        "Introduction to the reformer — setup, safety, and foundational exercises.",
      content: `<h2>Welcome to the Reformer</h2>
<p>The reformer is a versatile piece of equipment that adds resistance and support to your Pilates practice. Learn how to use it safely and effectively.</p>`,
      order: 5,
    },
    {
      title: "Programming & Sequencing",
      slug: "programming-and-sequencing",
      description:
        "How to design effective Pilates sessions that flow logically and safely.",
      content: `<h2>Designing Great Sessions</h2>
<p>Learn the art of programming — how to structure a class that warms up properly, builds progressively, and leaves clients feeling balanced and energised.</p>`,
      order: 6,
    },
    {
      title: "Cueing & Communication",
      slug: "cueing-and-communication",
      description:
        "The art of effective cueing — verbal, visual, and tactile communication.",
      content: `<h2>Finding Your Teaching Voice</h2>
<p>Great cueing is what separates good instructors from exceptional ones. This section covers how to communicate clearly and effectively with your clients.</p>`,
      order: 7,
    },
    {
      title: "Special Populations & Next Steps",
      slug: "special-populations-and-next-steps",
      description:
        "Working with different populations, contraindications, and continuing your journey.",
      content: `<h2>Expanding Your Practice</h2>
<p>Every client is different. Learn how to adapt your teaching for pre/postnatal clients, older adults, those with injuries, and more. Plus, explore what comes next in your Pilates career.</p>`,
      order: 8,
    },
  ];

  for (let i = 0; i < sections.length; i++) {
    const unlockDate = new Date(startDate);
    unlockDate.setDate(unlockDate.getDate() + i * 7);

    await prisma.section.upsert({
      where: { slug: sections[i].slug },
      update: {},
      create: {
        ...sections[i],
        unlockDate,
      },
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
