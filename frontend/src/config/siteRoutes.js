/**
 * Site route map — where each label lives and who can see it.
 * Use when adding nav links, footers, or emails.
 */

export const visibility = {
  public: 'public',
  auth: 'auth',
  hidden: 'hidden',
};

/** Human labels → canonical path */
export const routeMap = {
  Results: { path: '/results', visibility: visibility.auth, note: 'Full report · logged in' },
  Snapshot: { path: '/snapshot', visibility: visibility.auth, note: 'Post-assessment transition · logged in' },
  Diagnostic: { path: '/diagnostic', visibility: visibility.public, note: 'How it works; /assessment is the flow' },
  Platform: { path: '/platform', visibility: visibility.public, note: 'Human alignment software · marketing' },
  Pricing: { path: '/pricing', visibility: visibility.hidden, note: 'Unlisted until stage 2 · keep route for later' },
  Shop: { path: '/shop', visibility: visibility.public, note: 'Tools: Reset, Clarity, Quarterly Review, Planner' },
  Planner: { path: '/planner', visibility: visibility.public, note: 'Life of Purpose Planner' },
  Reset: { path: '/reset', visibility: visibility.public, note: 'Free companion' },
  AlignmentClarity: { path: '/shop/alignment-clarity', visibility: visibility.public, note: 'Clarity companion $27' },
  QuarterlyReview: { path: '/shop/quarterly-review', visibility: visibility.public, note: 'Quarterly Review companion $27' },
  Wholeness: { path: '/ethics', visibility: visibility.public, note: '/wholeness redirects here' },
  Framework: { path: '/framework', visibility: visibility.public, note: 'Six domains diagram + formation axis' },
  Becoming: { path: '/start', visibility: visibility.public, note: 'Email capture / landing' },
  Journey: { path: '/journey', visibility: visibility.auth, note: 'Habit Engine record · signed in' },
  Leaders: { path: '/leaders', visibility: visibility.public, note: 'Placeholder → links to business & platform' },
  Organizations: { path: '/organizations', visibility: visibility.public, note: 'Placeholder → business & institutions' },
  AlignmentMap: { path: '/alignment-map', visibility: visibility.public, note: 'Six-domain hex · personal scores when signed in' },
  Admin: { path: '/admin', visibility: visibility.hidden, note: 'Operators only · ADMIN role' },
  BusinessAlignment: { path: '/business', visibility: visibility.public, note: 'Team / org alignment overview' },
  Institutions: { path: '/institution', visibility: visibility.public, note: 'Formation programmes' },
  Cohorts: { path: '/cohort', visibility: visibility.public, note: 'Charter cohort · six weeks' },
  Share: { path: '/share', visibility: visibility.auth, note: 'Auth share surface' },
  Success: { path: '/success', visibility: visibility.public, note: 'Post-signup' },
  NotFound: { path: '/404', visibility: visibility.public, note: 'Unknown URLs' },
};
