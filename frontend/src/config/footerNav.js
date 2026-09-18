/**
 * Public footer — same destinations as the marketing header, plus legal.
 * Product pages (map, archive) stay in the account menu, not the site footer.
 */

export const siteMarketingFooter = [
  { to: '/platform', label: 'Platform' },
  { to: '/about', label: 'About' },
  { to: '/assessment', label: 'Begin free' },
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
