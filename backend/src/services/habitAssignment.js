/**
 * Assign three daily habits from the Primary Gap domain (diagnostic v1.0 habit library).
 */

const { prisma } = require('../prismaClient');

const DIAGNOSTIC_TAG = 'diagnostic_v1';

/** Canonical order per pillar — titles must match seeded `Habit.title` */
const HABIT_ORDER_BY_PILLAR = {
  IDENTITY: [
    'Morning Identity Anchor',
    'Evening Character Review',
    'Weekly Values Audit',
  ],
  PURPOSE: [
    'Seasonal Direction Check',
    'Priority Alignment',
    'Long-Term Goal Reading',
  ],
  MINDSET: ['Belief Audit', 'Formation Reading', 'Confidence Anchor'],
  HABITS: [
    'Morning Structure Anchor',
    'Habit-Intention Check',
    'Weekly Habit Audit',
  ],
  ENVIRONMENT: [
    'Morning Input Boundary',
    'Relationship Energy Check',
    'Workspace Intention Reset',
  ],
  EXECUTION: [
    'Weekly Intentional Planning',
    'Single Most Important Task',
    'Daily Completion Review',
  ],
};

/**
 * @param {string} profileId - AlignmentProfile id
 * @param {string} userId - User id
 * @param {string[]} [_segmentTags] - reserved for future segmentation (v1 library is domain-only)
 * @returns {Promise<Array<{ habitId: string, level: number, pillar: string, title: string }>>}
 */
async function assignHabits(profileId, userId, _segmentTags = []) {
  const profile = await prisma.alignmentProfile.findUnique({
    where: { id: profileId },
  });
  if (!profile || !profile.primaryDomain) return [];

  const pillar = profile.primaryDomain;

  const titleOrder = HABIT_ORDER_BY_PILLAR[pillar];
  let habits = [];

  if (titleOrder?.length === 3) {
    const byTitle = await prisma.habit.findMany({
      where: {
        pillar,
        title: { in: titleOrder },
      },
    });
    habits = titleOrder.map((t) => byTitle.find((h) => h.title === t)).filter(Boolean);
  }

  if (habits.length < 3) {
    habits = await prisma.habit.findMany({
      where: {
        pillar,
        tags: { has: DIAGNOSTIC_TAG },
      },
      orderBy: [{ level: 'asc' }, { createdAt: 'asc' }],
      take: 3,
    });
  }

  const created = [];
  for (const habit of habits.slice(0, 3)) {
    try {
      const existing = await prisma.activeHabit.findUnique({
        where: { userId_habitId: { userId, habitId: habit.id } },
      });
      if (existing) {
        continue;
      }
      await prisma.activeHabit.create({
        data: {
          userId,
          habitId: habit.id,
          profileId,
        },
      });
      created.push({
        habitId: habit.id,
        level: habit.level,
        pillar: habit.pillar,
        title: habit.title,
      });
    } catch (e) {
      // skip if already assigned
    }
  }
  return created;
}

module.exports = { assignHabits, HABIT_ORDER_BY_PILLAR, DIAGNOSTIC_TAG };
