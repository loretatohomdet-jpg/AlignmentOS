/**
 * Assessment handoff: thin place, why it matters, one practice, and My Plan copy.
 */

export const DOMAIN_INSIGHTS = {
  IDENTITY: {
    label: 'Identity',
    thin: 'Identity is the thin place. The day is being lived from a role, before who you are becoming has been named.',
    why: 'When identity stays unnamed, effort goes into the role. This practice names who you are becoming before the day fills in.',
    practiceTitle: 'Morning Identity Anchor',
    practiceDescription: 'Spend 2 minutes with your identity statement. Who are you becoming today?',
    focusTitle: 'Name who you are becoming.',
    focusBody: 'More clarity about the self beneath the roles, and days that match that sentence.',
    priorities: [
      { title: 'Morning identity statement', cadence: 'Daily · 2 minutes' },
      { title: 'One true word in conversation', cadence: 'Be present' },
      { title: 'Evening character review', cadence: '3–4x per week' },
    ],
    whatCanWait:
      'Not everything needs to happen now. You can pause proving yourself through more roles, and let the identity statement hold first.',
  },
  PURPOSE: {
    label: 'Purpose',
    thin: 'Purpose is the thin place. The days are full, and this season has not been named.',
    why: 'Without a sentence for the season, every task can look urgent. This practice asks what the season is for before the work starts.',
    practiceTitle: 'Seasonal Direction Check',
    practiceDescription: 'One sentence each morning: what is this season of life for?',
    focusTitle: 'Name what this season is for.',
    focusBody: 'A clearer path for the weeks ahead — fewer urgent tasks that do not serve the season.',
    priorities: [
      { title: 'Seasonal direction sentence', cadence: 'Daily · morning' },
      { title: 'One meaningful task first', cadence: 'Be present' },
      { title: 'Long-term goal reading', cadence: 'Weekly' },
    ],
    whatCanWait:
      'Not everything needs to happen now. You can say no to work that does not belong to this season.',
  },
  MINDSET: {
    label: 'Mindset',
    thin: 'Mindset is the thin place. A thought is steering decisions before it has been checked.',
    why: 'An unexamined thought becomes the plan. This practice names the thought and asks whether it was chosen.',
    practiceTitle: 'Belief Audit',
    practiceDescription: 'Notice one limiting thought. Name it. Ask: is this true? Is it chosen?',
    focusTitle: 'Protect the inner dialogue.',
    focusBody: 'A calmer mind, and decisions that come from chosen thoughts rather than default ones.',
    priorities: [
      { title: 'Belief audit', cadence: 'Daily · 5 minutes' },
      { title: 'Formation reading', cadence: '10 pages' },
      { title: 'Confidence from evidence', cadence: 'Be present' },
    ],
    whatCanWait:
      'Not everything needs to happen now. You can pause the spiral of more information and sit with one thought.',
  },
  HABITS: {
    label: 'Habits',
    thin: 'Habits are the thin place. The shape of the day is not yet serving what matters.',
    why: 'Intention fades when the morning has no held rhythm. This practice puts one action under the morning before the day fills itself.',
    practiceTitle: 'Morning Structure Anchor',
    practiceDescription: 'One non-negotiable action every morning — the same one, before the noise.',
    focusTitle: 'Build a healthy, sustainable routine.',
    focusBody: 'More energy, a calmer mind, and steady progress from one held rhythm.',
    priorities: [
      { title: 'Morning structure anchor', cadence: 'Daily · before the noise' },
      { title: 'Habit-intention check', cadence: 'Evening' },
      { title: 'Weekly habit audit', cadence: '1 focused block' },
    ],
    whatCanWait:
      'Not everything needs to happen now. You can pause perfection, say no to non-essentials, and trust the right time will come.',
  },
  ENVIRONMENT: {
    label: 'Environment',
    thin: 'Environment is the thin place. Inputs, people, or the workspace are taking the day before you do.',
    why: 'The conditions of the day decide more than the intention. This practice protects the first minutes.',
    practiceTitle: 'Morning Input Boundary',
    practiceDescription: 'No phone for the first 20 minutes. Protect the first thought.',
    focusTitle: 'Shape the conditions of the day.',
    focusBody: 'More presence, quieter inputs, and a workspace that supports what matters.',
    priorities: [
      { title: 'Phone outside the morning', cadence: 'Daily · first 20 minutes' },
      { title: 'Relationship energy check', cadence: 'Be present' },
      { title: 'Workspace intention reset', cadence: 'Before deep work' },
    ],
    whatCanWait:
      'Not everything needs to happen now. You can pause constant availability and protect the first thought.',
  },
  EXECUTION: {
    label: 'Execution',
    thin: 'Execution is the thin place. What matters is known, and it is not what gets finished.',
    why: 'A long list hides the one action that would move the week. This practice names that action and starts there.',
    practiceTitle: 'Weekly Intentional Planning',
    practiceDescription: 'Every Sunday: three high-priority actions for the coming week.',
    focusTitle: 'Finish what matters most.',
    focusBody: 'Clearer follow-through — one important task before the noise of the list.',
    priorities: [
      { title: 'Weekly intentional planning', cadence: 'Sunday' },
      { title: 'Single most important task', cadence: 'Daily' },
      { title: 'Daily completion review', cadence: 'Evening' },
    ],
    whatCanWait:
      'Not everything needs to happen now. You can leave the long list and protect the one task that moves the week.',
  },
};

export function buildDomainInsight(domain, practice) {
  const copy = DOMAIN_INSIGHTS[domain];
  if (!copy) return null;
  return {
    domain,
    label: copy.label,
    thin: copy.thin,
    why: copy.why,
    practice: {
      id: practice?.id || null,
      title: practice?.title || copy.practiceTitle,
      description: practice?.description || copy.practiceDescription,
    },
    plan: {
      focusTitle: copy.focusTitle,
      focusBody: copy.focusBody,
      priorities: copy.priorities,
      whatCanWait: copy.whatCanWait,
    },
  };
}

export function insightFromResult(result, practice) {
  const domain = result?.primaryDomain || result?.insight?.domain;
  const built = buildDomainInsight(domain, practice || result?.insight?.practice);
  if (!built) return result?.insight || null;
  const fromApi = result?.insight;
  return {
    ...built,
    ...(fromApi?.thin ? { thin: fromApi.thin, why: fromApi.why || built.why } : {}),
    practice: {
      id: practice?.id || fromApi?.practice?.id || built.practice.id,
      title: practice?.title || fromApi?.practice?.title || built.practice.title,
      description:
        practice?.description || fromApi?.practice?.description || built.practice.description,
    },
    plan: built.plan,
  };
}

export function planFromInsight(insight, habits = []) {
  if (!insight?.plan) return null;
  const fromHabits = (habits || []).slice(0, 3).map((h) => ({
    id: h.id,
    title: h.title,
    cadence: h.description || 'This week',
    completedToday: Boolean(h.completedToday),
  }));
  return {
    label: insight.label,
    domain: insight.domain,
    focusTitle: insight.plan.focusTitle,
    focusBody: insight.plan.focusBody,
    why: insight.why,
    whatCanWait: insight.plan.whatCanWait,
    priorities: fromHabits.length
      ? fromHabits
      : insight.plan.priorities.map((p, i) => ({ id: `static-${i}`, ...p, completedToday: false })),
    practice: insight.practice,
  };
}
