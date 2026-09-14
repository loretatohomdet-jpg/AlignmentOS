const { prisma } = require('../prismaClient');
const { utcDay, summarizeActiveHabits } = require('../services/habitEngine');

async function loadActiveWithCompletions(userId) {
  return prisma.activeHabit.findMany({
    where: { userId },
    include: {
      habit: true,
      completions: { select: { completedAt: true } },
    },
    orderBy: { assignedAt: 'asc' },
  });
}

async function getActiveHabits(req, res, next) {
  try {
    const userId = req.user.sub;
    const active = await loadActiveWithCompletions(userId);
    const summary = summarizeActiveHabits(active);
    res.json(
      summary.habits.map((h) => ({
        id: h.id,
        habitId: h.habitId,
        title: h.title,
        description: h.description,
        level: h.level,
        pillar: h.pillar,
        assignedAt: h.assignedAt,
        completedToday: h.completedToday,
        completedLast7: h.completedLast7,
        last7Days: h.last7Days,
        streak: h.streak,
      }))
    );
  } catch (err) {
    next(err);
  }
}

async function completeHabit(req, res, next) {
  try {
    const userId = req.user.sub;
    const { activeHabitId } = req.body;
    if (!activeHabitId) {
      return res.status(400).json({ message: 'activeHabitId required' });
    }
    const active = await prisma.activeHabit.findFirst({
      where: { id: activeHabitId, userId },
    });
    if (!active) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const today = utcDay(new Date());
    const dayStart = new Date(`${today}T00:00:00.000Z`);
    const dayEnd = new Date(`${today}T23:59:59.999Z`);
    const existing = await prisma.habitCompletion.findFirst({
      where: {
        activeHabitId: active.id,
        completedAt: { gte: dayStart, lte: dayEnd },
      },
    });
    if (existing) {
      return res.json({ completedAt: existing.completedAt, alreadyCompleted: true });
    }

    const completion = await prisma.habitCompletion.create({
      data: { activeHabitId: active.id },
    });
    res.status(201).json({ completedAt: completion.completedAt, alreadyCompleted: false });
  } catch (err) {
    next(err);
  }
}

async function getCompletionStats(req, res, next) {
  try {
    const userId = req.user.sub;
    const active = await loadActiveWithCompletions(userId);
    const summary = summarizeActiveHabits(active);
    res.json({
      totalCompletions: summary.totalCompletions,
      totalDaysWithActivity: summary.totalDaysWithActivity,
      completedActiveHabitIdsToday: summary.completedActiveHabitIdsToday,
      today: summary.today,
      last7Days: summary.last7Days,
      habits: summary.habits,
      prompt: summary.prompt,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getActiveHabits, completeHabit, getCompletionStats };
