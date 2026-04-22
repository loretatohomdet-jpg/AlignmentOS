/**
 * Optional outbound URLs (GHL, Teachable, etc.). Set in Vercel / .env as VITE_*.
 * All are trimmed; empty = feature uses in-app fallback (login, /start, etc.).
 */

function trimUrl(v) {
  if (v == null || typeof v !== 'string') return '';
  const s = v.trim();
  return s;
}

export const programHubUrl = trimUrl(import.meta.env.VITE_PROGRAM_HUB_URL);
export const courseLibraryUrl = trimUrl(import.meta.env.VITE_COURSE_LIBRARY_URL);
export const bookingUrl = trimUrl(import.meta.env.VITE_BOOKING_URL);
export const checkoutHabitUrl = trimUrl(import.meta.env.VITE_CHECKOUT_HABIT_URL);
/** Self-guided Journey to Purpose (one-time), e.g. Teachable checkout */
export const checkoutJourneyUrl = trimUrl(import.meta.env.VITE_CHECKOUT_JOURNEY_URL);
/** Guided cohort application or checkout (falls back to booking when unset) */
export const cohortApplyUrl = trimUrl(import.meta.env.VITE_COHORT_APPLY_URL) || bookingUrl;

/** Fallback when no VITE_PROGRAM_HUB_URL — existing formation site */
export const formationExploreFallback = 'https://simplicityandproductivity.com/';

export function formationExploreUrl() {
  return programHubUrl || formationExploreFallback;
}

/** Extra footer nav items when env URLs are set */
export const extraMarketingFooterLinks = (() => {
  const out = [];
  if (programHubUrl) out.push({ href: programHubUrl, label: 'Programs', external: true });
  if (courseLibraryUrl) out.push({ href: courseLibraryUrl, label: 'Courses', external: true });
  if (bookingUrl) out.push({ href: bookingUrl, label: 'Book a call', external: true });
  return out;
})();
