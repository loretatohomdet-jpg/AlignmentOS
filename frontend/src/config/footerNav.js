/**
 * Public footer — same destinations as the marketing header, plus legal.
 * Product pages (map, archive) stay in the account menu, not the site footer.
 */

export const siteMarketingFooter = [
  { to: '/assessment', label: 'Assessment' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/platform', label: 'Platform' },
  { to: '/planner', label: 'Planner' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
];

export const siteLegalLinks = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
];

export const siteSecondaryFooter = [
  { to: '/', label: 'Home' },
  ...siteMarketingFooter,
  ...siteLegalLinks,
];
