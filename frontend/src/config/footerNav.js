/**
 * Canonical footer + marketing links.
 * Leaders and Organizations use placeholder pages until dedicated routes ship.
 */

export const siteMarketingFooter = [
  { to: '/platform', label: 'Platform' },
  { to: '/ethics', label: 'Wholeness' },
  { to: '/framework', label: 'Framework' },
  { to: '/alignment-map', label: 'Alignment map' },
  { to: '/start', label: 'Becoming' },
  { to: '/leaders', label: 'Leaders' },
  { to: '/organizations', label: 'Organizations' },
  { to: '/institution', label: 'Institutions' },
  { href: 'mailto:organizations@alignmentos.com', label: 'Cohorts', external: true },
  { to: '/about', label: 'About' },
  { to: '/assessment', label: 'Begin free' },
];

export const siteLegalLinks = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
];

export const siteSecondaryFooter = [
  { to: '/', label: 'Home' },
  { to: '/platform', label: 'Platform' },
  { to: '/framework', label: 'Framework' },
  { to: '/about', label: 'About' },
  { to: '/ethics', label: 'Wholeness' },
  { to: '/organizations', label: 'Organizations' },
  { to: '/institution', label: 'Institutions' },
  ...siteLegalLinks,
];
