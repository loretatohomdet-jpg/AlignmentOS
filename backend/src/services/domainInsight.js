/**
 * What the assessment should hand the person: the thin place, why it matters,
 * and the one practice already chosen for that domain.
 */

const DOMAIN_INSIGHTS = {
  IDENTITY: {
    label: 'Identity',
    thin: 'Identity is the thin place. The day is being lived from a role, before who you are becoming has been named.',
    why: 'When identity stays unnamed, effort goes into the role. This practice names who you are becoming before the day fills in.',
    practiceTitle: 'Morning Identity Anchor',
    practiceDescription: 'Spend 2 minutes with your identity statement. Who are you becoming today?',
  },
  PURPOSE: {
    label: 'Purpose',
    thin: 'Purpose is the thin place. The days are full, and this season has not been named.',
    why: 'Without a sentence for the season, every task can look urgent. This practice asks what the season is for before the work starts.',
    practiceTitle: 'Seasonal Direction Check',
    practiceDescription: 'One sentence each morning: what is this season of life for?',
  },
  MINDSET: {
    label: 'Mindset',
    thin: 'Mindset is the thin place. A thought is steering decisions before it has been checked.',
    why: 'An unexamined thought becomes the plan. This practice names the thought and asks whether it was chosen.',
    practiceTitle: 'Belief Audit',
    practiceDescription: 'Notice one limiting thought. Name it. Ask: is this true? Is it chosen?',
  },
  HABITS: {
    label: 'Habits',
    thin: 'Habits are the thin place. The shape of the day is not yet serving what matters.',
    why: 'Intention fades when the morning has no held rhythm. This practice puts one action under the morning before the day fills itself.',
    practiceTitle: 'Morning Structure Anchor',
    practiceDescription: 'One non-negotiable action every morning — the same one, before the noise.',
  },
  ENVIRONMENT: {
    label: 'Environment',
    thin: 'Environment is the thin place. Inputs, people, or the workspace are taking the day before you do.',
    why: 'The conditions of the day decide more than the intention. This practice protects the first minutes.',
    practiceTitle: 'Morning Input Boundary',
    practiceDescription: 'No phone for the first 20 minutes. Protect the first thought.',
  },
  EXECUTION: {
    label: 'Execution',
    thin: 'Execution is the thin place. What matters is known, and it is not what gets finished.',
    why: 'A long list hides the one action that would move the week. This practice names that action and starts there.',
    practiceTitle: 'Weekly Intentional Planning',
    practiceDescription: 'Every Sunday: three high-priority actions for the coming week.',
  },
};

function buildDomainInsight(domain, practice) {
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
  };
}

function applyDomainInsight(payload, practice) {
  const insight = buildDomainInsight(payload?.primaryDomain, practice);
  if (!insight) return payload;
  return {
    ...payload,
    primaryStrainDescription: insight.thin,
    insight,
  };
}

module.exports = {
  DOMAIN_INSIGHTS,
  buildDomainInsight,
  applyDomainInsight,
};
