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

async function habitsForPillar(pillar) {
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

  return habits.slice(0, 3);
}

function serializeActive(row) {
  return {
    id: row.id,
    habitId: row.habitId,
    title: row.habit.title,
    description: row.habit.description,
    level: row.habit.level,
    pillar: row.habit.pillar,
    assignedAt: row.assignedAt,
  };
}

async function loadCurrentActive(userId) {
  return prisma.activeHabit.findMany({
    where: { userId, endedAt: null },
    include: { habit: true },
    orderBy: { assignedAt: 'asc' },
  });
}

/**
 * Install or replace the current three practices from the profile’s primary domain.
 * Previous practices are ended (not deleted) so completion history is kept.
 */
async function syncActiveHabits(userId, profileId) {
  const profile = await prisma.alignmentProfile.findUnique({
    where: { id: profileId },
  });
  if (!profile || !profile.primaryDomain) return [];

  const desired = await habitsForPillar(profile.primaryDomain);
  if (!desired.length) {
    console.warn('Habit assignment produced no habits', {
      userId,
      pillar: profile.primaryDomain,
    });
    return [];
  }

  const desiredIds = desired.map((h) => h.id);
  const current = await prisma.activeHabit.findMany({
    where: { userId, endedAt: null },
  });
  const currentIds = current.map((row) => row.habitId);
  const sameSet =
    currentIds.length === desiredIds.length && desiredIds.every((id) => currentIds.includes(id));
  if (sameSet) {
    const rows = await loadCurrentActive(userId);
    return rows.map(serializeActive);
  }

  const now = new Date();
  await prisma.activeHabit.updateMany({
    where: {
      userId,
      endedAt: null,
      habitId: { notIn: desiredIds },
    },
    data: { endedAt: now },
  });

  for (const habit of desired) {
    const existing = await prisma.activeHabit.findUnique({
      where: { userId_habitId: { userId, habitId: habit.id } },
    });
    if (existing) {
      await prisma.activeHabit.update({
        where: { id: existing.id },
        data: {
          endedAt: null,
          profileId,
          ...(existing.endedAt ? { assignedAt: now } : {}),
        },
      });
    } else {
      await prisma.activeHabit.create({
        data: {
          userId,
          habitId: habit.id,
          profileId,
        },
      });
    }
  }

  const rows = await loadCurrentActive(userId);
  return rows.map(serializeActive);
}

/**
 * @param {string} profileId
 * @param {string} userId
 * @returns {Promise<Array<{ habitId: string, level: number, pillar: string, title: string }>>}
 */
async function assignHabits(profileId, userId) {
  return syncActiveHabits(userId, profileId);
}

/**
 * If this user already has a diagnostic profile but no current practices, install them.
 */
async function ensureActiveHabits(userId) {
  const existingCount = await prisma.activeHabit.count({
    where: { userId, endedAt: null },
  });
  if (existingCount > 0) {
    return { assigned: [], alreadyHad: true };
  }
  const profile = await prisma.alignmentProfile.findUnique({
    where: { userId },
  });
  if (!profile) {
    return { assigned: [], alreadyHad: false };
  }
  const assigned = await syncActiveHabits(userId, profile.id);
  return { assigned, alreadyHad: false };
}

module.exports = {
  assignHabits,
  syncActiveHabits,
  ensureActiveHabits,
  loadCurrentActive,
  HABIT_ORDER_BY_PILLAR,
  DIAGNOSTIC_TAG,
};
