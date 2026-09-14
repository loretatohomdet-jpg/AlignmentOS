/** UTC calendar day YYYY-MM-DD */
function utcDay(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function lastNUtcDays(n) {
  const days = [];
  const today = utcDay(new Date());
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    days.push(utcDay(d));
  }
  return { today, days };
}

function streakEnding(completedDays, today) {
  const set = new Set(completedDays);
  const cursor = new Date(`${today}T00:00:00.000Z`);
  if (!set.has(today)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  let streak = 0;
  while (set.has(utcDay(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

function buildPrompt(habits) {
  if (!habits.length) {
    return {
      kind: 'empty',
      title: 'Your habits are prescribed from the diagnostic',
      body: 'Take the assessment so the engine can install three practices on your lowest domain.',
      habitId: null,
      habitTitle: null,
    };
  }

  const anyHistory = habits.some((h) => h.completedLast7 > 0 || h.streak > 0);
  if (!anyHistory) {
    const first = habits[0];
    return {
      kind: 'begin',
      title: `Begin with ${first.title}`,
      body: 'One practice today is enough. The engine learns from what you actually do — not what you intend.',
      habitId: first.id,
      habitTitle: first.title,
    };
  }

  const drifting = [...habits].sort((a, b) => a.completedLast7 - b.completedLast7 || a.title.localeCompare(b.title))[0];
  if (drifting && drifting.completedLast7 <= 2) {
    return {
      kind: 'adjust',
      title: `${drifting.title} needs a smaller hold`,
      body: `Held ${drifting.completedLast7} of the last 7 days. Keep the same practice, shorten the time, and protect the same hour tomorrow.`,
      habitId: drifting.id,
      habitTitle: drifting.title,
    };
  }

  const openToday = habits.filter((h) => !h.completedToday);
  if (openToday.length) {
    const next = [...openToday].sort((a, b) => a.completedLast7 - b.completedLast7)[0];
    return {
      kind: 'today',
      title: `Today still open: ${next.title}`,
      body: 'Protection, not performance. Mark it when it happens — even late.',
      habitId: next.id,
      habitTitle: next.title,
    };
  }

  return {
    kind: 'hold',
    title: 'These three are holding',
    body: 'No new habits this week. Keep the same structure. Adjustment comes from consistency, not addition.',
    habitId: null,
    habitTitle: null,
  };
}

/**
 * @param {Array<{ id: string, habit: { title: string, description: string|null, level: number, pillar: string }, assignedAt: Date, completions: { completedAt: Date }[] }>} active
 */
function summarizeActiveHabits(active) {
  const { today, days } = lastNUtcDays(7);
  const habits = active.map((row) => {
    const daySet = new Set(row.completions.map((c) => utcDay(c.completedAt)));
    const last7 = days.filter((d) => daySet.has(d));
    return {
      id: row.id,
      habitId: row.habitId,
      title: row.habit.title,
      description: row.habit.description,
      level: row.habit.level,
      pillar: row.habit.pillar,
      assignedAt: row.assignedAt,
      completedToday: daySet.has(today),
      completedLast7: last7.length,
      last7Days: days.map((d) => ({ date: d, done: daySet.has(d) })),
      streak: streakEnding([...daySet], today),
    };
  });

  return {
    today,
    last7Days: days,
    habits,
    prompt: buildPrompt(habits),
    totalCompletions: active.reduce((n, row) => n + row.completions.length, 0),
    totalDaysWithActivity: new Set(active.flatMap((row) => row.completions.map((c) => utcDay(c.completedAt)))).size,
    completedActiveHabitIdsToday: habits.filter((h) => h.completedToday).map((h) => h.id),
  };
}

module.exports = {
  utcDay,
  lastNUtcDays,
  summarizeActiveHabits,
  buildPrompt,
};
