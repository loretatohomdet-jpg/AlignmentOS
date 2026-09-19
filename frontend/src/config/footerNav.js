/**
 * Public footer — exact marketing destinations.
 * Product pages stay in the account menu, not the site footer.
 */

export const siteMarketingFooter = [
  { to: '/assessment', label: 'Assessment' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/platform', label: 'Platform' },
  { to: '/planner', label: 'Planner' },
  { to: '/about', label: 'About' },
  { to: '/login', label: 'Sign In' },
];

export const siteLegalLinks = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/contact', label: 'Contact' },
];

export const siteSecondaryFooter = [
  { to: '/', label: 'Home' },
  ...siteMarketingFooter,
  ...siteLegalLinks,
];

export const siteFooterTagline = 'Know what matters. Know what to do next.';
export const siteFooterCopyright = '© Alignment OS';
export const siteContactEmail = 'hello@alignmentos.co';
