const { prisma } = require('../prismaClient');

async function getActiveHabits(req, res, next) {
  try {
    const userId = req.user.sub;
    const active = await prisma.activeHabit.findMany({
      where: { userId },
      include: {
        habit: true,
      },
      orderBy: { assignedAt: 'desc' },
    });
    res.json(active.map((a) => ({
      id: a.id,
      habitId: a.habitId,
      title: a.habit.title,
      description: a.habit.description,
      level: a.habit.level,
      pillar: a.habit.pillar,
      assignedAt: a.assignedAt,
    })));
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
    const completion = await prisma.habitCompletion.create({
      data: { activeHabitId: active.id },
    });
    res.status(201).json({ completedAt: completion.completedAt });
  } catch (err) {
    next(err);
  }
}

async function getCompletionStats(req, res, next) {
  try {
    const userId = req.user.sub;
    const active = await prisma.activeHabit.findMany({
      where: { userId },
      select: { id: true },
    });
    const ids = active.map((a) => a.id);
    const completions = await prisma.habitCompletion.findMany({
      where: { activeHabitId: { in: ids } },
      select: { completedAt: true, activeHabitId: true },
    });
    const byDay = {};
    const todayUtc = new Date().toISOString().slice(0, 10);
    const completedActiveHabitIdsToday = new Set();
    for (const c of completions) {
      const day = c.completedAt.toISOString().slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
      if (day === todayUtc) completedActiveHabitIdsToday.add(c.activeHabitId);
    }
    const totalDays = Object.keys(byDay).length;
    res.json({
      totalCompletions: completions.length,
      totalDaysWithActivity: totalDays,
      completedActiveHabitIdsToday: [...completedActiveHabitIdsToday],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getActiveHabits, completeHabit, getCompletionStats };
