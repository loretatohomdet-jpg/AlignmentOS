const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { getQuestionsForSeed } = require('../src/data/assessmentQuestions');
const { DIAGNOSTIC_TAG } = require('../src/services/habitAssignment');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Demo user only in non-production (skip in production for security)
  if (process.env.NODE_ENV !== 'production') {
    const demoEmail = 'demo@alignment.local';
    const demoPassword = 'password123';
    const passwordHash = await bcrypt.hash(demoPassword, 10);
    await prisma.user.upsert({
      where: { email: demoEmail },
      update: { password: passwordHash, name: 'Demo User' },
      create: {
        email: demoEmail,
        name: 'Demo User',
        password: passwordHash,
      },
    });
    console.log('Demo user:', { email: demoEmail, password: demoPassword });

    const adminEmail = 'admin@alignment.local';
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password: passwordHash, name: 'Admin', role: 'ADMIN' },
      create: {
        email: adminEmail,
        name: 'Admin',
        password: passwordHash,
        role: 'ADMIN',
      },
    });
    console.log('Admin user:', { email: adminEmail, password: demoPassword });
  } else {
    console.log('Skipping demo user (NODE_ENV=production).');
  }

  // Create baseline assessment
  const assessment = await prisma.assessment.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Baseline Alignment Assessment',
      description:
        'Twenty-four questions (1–5 scale) across six domains: Identity, Purpose, Mindset, Habits, Environment, and Execution.',
      isActive: true,
    },
  });

  console.log('Assessment:', assessment.title);

  const ensureOnly = process.argv.includes('--ensure');

  if (!ensureOnly) {
    await prisma.question.deleteMany({
      where: { assessmentId: assessment.id },
    });

    const questionRows = getQuestionsForSeed(assessment.id);
    await prisma.question.createMany({ data: questionRows });
    console.log(`Created ${questionRows.length} questions.`);
  } else {
    const qCount = await prisma.question.count({ where: { assessmentId: assessment.id } });
    if (qCount === 0) {
      const questionRows = getQuestionsForSeed(assessment.id);
      await prisma.question.createMany({ data: questionRows });
      console.log(`Ensure: created ${questionRows.length} questions.`);
    } else {
      console.log(`Ensure: leaving ${qCount} questions in place.`);
    }
  }

  // Diagnostic v1.0 — exactly three habits per domain (Primary Gap library)
  const diagnosticHabits = [
    {
      title: 'Morning Identity Anchor',
      description: 'Spend 2 minutes with your identity statement. Who are you becoming today?',
      level: 1,
      pillar: 'IDENTITY',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Evening Character Review',
      description: 'Name one virtue you expressed today and one you missed.',
      level: 2,
      pillar: 'IDENTITY',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Weekly Values Audit',
      description: 'Did three decisions this week reflect your core values?',
      level: 3,
      pillar: 'IDENTITY',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Seasonal Direction Check',
      description: 'One sentence each morning: what is this season of life for?',
      level: 1,
      pillar: 'PURPOSE',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Priority Alignment',
      description: 'Before starting work: does today serve what matters most?',
      level: 2,
      pillar: 'PURPOSE',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Long-Term Goal Reading',
      description: '10 minutes weekly reviewing your long-term goals. Are they still true?',
      level: 3,
      pillar: 'PURPOSE',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Belief Audit',
      description: 'Notice one limiting thought. Name it. Ask: is this true? Is it chosen?',
      level: 1,
      pillar: 'MINDSET',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Formation Reading',
      description: '10 pages daily from something that challenges how you think.',
      level: 2,
      pillar: 'MINDSET',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Confidence Anchor',
      description: 'Name three things working in your favour. Build from evidence.',
      level: 3,
      pillar: 'MINDSET',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Morning Structure Anchor',
      description:
        'One non-negotiable action every morning — the same one, before the noise.',
      level: 1,
      pillar: 'HABITS',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Habit-Intention Check',
      description: 'Did my actions today reflect who I said I was becoming?',
      level: 2,
      pillar: 'HABITS',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Weekly Habit Audit',
      description: 'Which habits held? Which drifted? Remove one default, install one chosen.',
      level: 3,
      pillar: 'HABITS',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Morning Input Boundary',
      description: 'No phone for the first 20 minutes. Protect the first thought.',
      level: 1,
      pillar: 'ENVIRONMENT',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Relationship Energy Check',
      description: 'Name one relationship that builds you. One that drains you.',
      level: 2,
      pillar: 'ENVIRONMENT',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Workspace Intention Reset',
      description: 'Before deep work: clear your desk. Set one clear intention.',
      level: 3,
      pillar: 'ENVIRONMENT',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Weekly Intentional Planning',
      description: 'Every Sunday: three high-priority actions for the coming week.',
      level: 1,
      pillar: 'EXECUTION',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Single Most Important Task',
      description: 'What is the one task that matters most today? Start there.',
      level: 2,
      pillar: 'EXECUTION',
      tags: [DIAGNOSTIC_TAG],
    },
    {
      title: 'Daily Completion Review',
      description: 'What did I complete? What did I carry forward unnecessarily?',
      level: 3,
      pillar: 'EXECUTION',
      tags: [DIAGNOSTIC_TAG],
    },
  ];

  if (ensureOnly) {
    let created = 0;
    for (const habit of diagnosticHabits) {
      const existing = await prisma.habit.findFirst({
        where: { title: habit.title, pillar: habit.pillar },
      });
      if (existing) continue;
      await prisma.habit.create({ data: habit });
      created += 1;
    }
    const total = await prisma.habit.count();
    console.log(`Ensure catalog: created ${created}, total ${total}.`);
  } else {
    await prisma.habit.deleteMany({
      where: { tags: { has: DIAGNOSTIC_TAG } },
    });
    await prisma.habit.createMany({ data: diagnosticHabits });
    console.log(`Seeded ${diagnosticHabits.length} diagnostic v1 habits.`);
  }

  const promoteEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (promoteEmail) {
    const promoted = await prisma.user.updateMany({
      where: { email: promoteEmail },
      data: { role: 'ADMIN' },
    });
    if (promoted.count > 0) {
      console.log(`Promoted ${promoteEmail} to ADMIN.`);
    } else {
      console.log(`ADMIN_EMAIL=${promoteEmail} — no matching user yet. Create the account, then re-seed.`);
    }
  }
}

main()
  .then(async () => {
    console.log('Seed complete.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
