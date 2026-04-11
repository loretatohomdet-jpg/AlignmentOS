/**
 * Placeholder pages for footer nav items that will get dedicated routes later.
 * Keeps copy honest and points to what exists today.
 */

export const comingSoonVariants = {
  leaders: {
    kicker: 'Leaders',
    title: 'Alignment for teams & leadership',
    body:
      'A dedicated Leaders hub is on the way — cohort views, team language, and facilitation notes built around the same six-domain diagnostic. Until then, everything you need to explore team alignment lives in one place.',
    links: [
      { to: '/business', label: 'Team & organization alignment', note: 'Overview for companies and teams' },
      { to: '/platform', label: 'The platform', note: 'How Alignment OS works' },
      { to: '/assessment', label: 'Take the diagnostic', note: 'Individual · free' },
    ],
  },
  organizations: {
    kicker: 'Organizations',
    title: 'Structure for mission-driven orgs',
    body:
      'We’re expanding how organizations roll out the diagnostic, habits, and reviews at scale. For now, use the pages below — including institutions and business alignment — to see how formation can extend beyond the individual.',
    links: [
      { to: '/business', label: 'Business & team alignment', note: 'Companies and founder-led teams' },
      { to: '/institution', label: 'Institutions', note: 'Formation programmes & cohorts' },
      { to: '/pricing', label: 'Pricing', note: 'Habit Engine & Journey' },
    ],
  },
  'alignment-map': {
    kicker: 'Alignment map',
    title: 'Your formation trajectory — full map',
    body:
      'The standalone Alignment Map page (score history across domains, export, and share) is in development. Today, your trajectory appears on the Dashboard after you sign in, and the diagnostic overview explains how the six domains combine into your score.',
    links: [
      { to: '/dashboard', label: 'Open Dashboard', note: 'Requires sign-in · score history & habits' },
      { to: '/diagnostic', label: 'How the diagnostic works', note: 'Six domains & scoring' },
      { to: '/assessment', label: 'Take or retake the diagnostic', note: '12 minutes · free' },
    ],
  },
};
