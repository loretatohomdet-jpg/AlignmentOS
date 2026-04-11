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
  Results: { path: '/results', visibility: visibility.auth, note: 'Post-assessment · logged in' },
  Diagnostic: { path: '/diagnostic', visibility: visibility.public, note: 'How it works; /assessment is the flow' },
  Platform: { path: '/platform', visibility: visibility.public, note: 'Human alignment software · marketing' },
  Pricing: { path: '/pricing', visibility: visibility.public, note: 'Tiers · Habit Engine · Journey' },
  Wholeness: { path: '/ethics', visibility: visibility.public, note: '/wholeness redirects here' },
  Framework: { path: '/framework', visibility: visibility.public, note: 'Six domains diagram + formation axis' },
  Becoming: { path: '/start', visibility: visibility.public, note: 'Email capture / landing' },
  Journey: { path: '/pricing#journey-tier', visibility: visibility.public, note: '/journey redirects here' },
  Leaders: { path: '/leaders', visibility: visibility.public, note: 'Placeholder → links to business & platform' },
  Organizations: { path: '/organizations', visibility: visibility.public, note: 'Placeholder → business & institutions' },
  AlignmentMap: { path: '/alignment-map', visibility: visibility.public, note: 'Placeholder → dashboard & diagnostic' },
  BusinessAlignment: { path: '/business', visibility: visibility.public, note: 'Team / org alignment overview' },
  Institutions: { path: '/institution', visibility: visibility.public, note: 'Formation programmes' },
  Cohorts: { path: 'mailto:organizations@alignmentos.com', visibility: visibility.public, note: 'Email' },
  Share: { path: '/share', visibility: visibility.auth, note: 'Auth share surface' },
  Success: { path: '/success', visibility: visibility.public, note: 'Post-signup' },
  NotFound: { path: '/404', visibility: visibility.public, note: 'Unknown URLs' },
};
