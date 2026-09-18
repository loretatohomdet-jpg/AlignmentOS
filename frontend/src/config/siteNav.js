/**
 * Primary header navigation — same labels and order as the home page.
 */
export const siteNavMainLinks = [
  { to: '/assessment', label: 'Assessment' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/platform', label: 'Platform' },
  { to: '/planner', label: 'Planner' },
  { to: '/shop', label: 'Shop' },
];

/** Product nav when signed in — daily work lives on Practice. */
export const siteNavSignedInLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/practice', label: 'Practice' },
  { to: '/reflect', label: 'Review' },
];

const PRODUCT_APP_PREFIXES = [
  '/dashboard',
  '/practice',
  '/reflect',
  '/snapshot',
  '/results',
  '/journey',
  '/more',
  '/profile',
  '/progress',
  '/admin',
  '/agent',
  '/share',
  '/alignment-map',
  '/success',
];

/** Product chrome (Dashboard · Practice · Review). Marketing pages stay visitor-facing. */
export function isProductAppPath(pathname) {
  if (!pathname) return false;
  return PRODUCT_APP_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export const siteNavLinkClass =
  'text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.22em] text-alignment-accent/75 hover:text-alignment-accent transition-colors';

export const siteNavDrawerRowClass =
  'block px-4 py-3 rounded-xl text-base font-medium text-alignment-accent hover:bg-alignment-accent/5';

export const beginFreeHeaderButtonClass =
  'inline-flex items-center justify-center rounded-full bg-alignment-primary text-white text-[9px] sm:text-[11px] font-medium uppercase tracking-[0.12em] px-2.5 sm:px-4 py-1.5 sm:py-2 transition-colors duration-200 hover:bg-alignment-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-foundation';
