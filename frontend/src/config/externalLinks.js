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
/** Formation on Teachable — override with VITE_COURSE_LIBRARY_URL in production if needed */
export const formationTeachableFallback = 'https://simplicityandproductivity.teachable.com/';
export const courseLibraryUrl =
  trimUrl(import.meta.env.VITE_COURSE_LIBRARY_URL) || formationTeachableFallback;
export const bookingUrl = trimUrl(import.meta.env.VITE_BOOKING_URL);
export const checkoutHabitUrl = trimUrl(import.meta.env.VITE_CHECKOUT_HABIT_URL);
/** Self-guided Journey to Purpose (one-time), e.g. Teachable checkout */
export const checkoutJourneyUrl = trimUrl(import.meta.env.VITE_CHECKOUT_JOURNEY_URL);
/** Guided cohort application or checkout (falls back to booking when unset) */
export const cohortApplyUrl = trimUrl(import.meta.env.VITE_COHORT_APPLY_URL) || bookingUrl;
/** Creator handoff (GHL funnel, Teachable, etc.) */
export const creatorUrl = trimUrl(import.meta.env.VITE_CREATOR_URL);
/** Amazon storefront or planner listing */
export const amazonStoreUrl = trimUrl(import.meta.env.VITE_AMAZON_STORE_URL);
/** Life of Purpose Planner on Shopify — swap preview URLs for live /products/… when the store publishes */
export const shopifyStoreFallback = 'https://f21q75-bs.myshopify.com/';
export const shopPlannerFallback =
  'https://8xmgf686qndd0nw2-78907834445.shopifypreview.com/products_preview?preview_key=dd356bfa6c19abd5e019648fda85fd35';
export const shopPlannerHeirloomFallback =
  'https://8xmgf686qndd0nw2-78907834445.shopifypreview.com/products_preview?preview_key=cf118f4a5ad13e7713a4e887f6b6c296';
export const shopifyStoreUrl =
  trimUrl(import.meta.env.VITE_SHOPIFY_STORE_URL) || shopifyStoreFallback;
export const shopPlannerUrl =
  trimUrl(import.meta.env.VITE_SHOP_PLANNER_URL) || shopPlannerFallback;
export const shopPlannerHeirloomUrl =
  trimUrl(import.meta.env.VITE_SHOP_PLANNER_HEIRLOOM_URL) || shopPlannerHeirloomFallback;
export const shopPlannerDigitalUrl = trimUrl(import.meta.env.VITE_SHOP_PLANNER_DIGITAL_URL);
export const shopDigitalUrl = trimUrl(import.meta.env.VITE_SHOP_DIGITAL_URL) || trimUrl(import.meta.env.VITE_COURSE_LIBRARY_URL);
export const shopResetUrl = trimUrl(import.meta.env.VITE_SHOP_RESET_URL);
export const shopResetPrintUrl = trimUrl(import.meta.env.VITE_SHOP_RESET_PRINT_URL);
export const shopClarityUrl = trimUrl(import.meta.env.VITE_SHOP_CLARITY_URL) || shopDigitalUrl;
export const shopClarityPrintUrl = trimUrl(import.meta.env.VITE_SHOP_CLARITY_PRINT_URL);
export const shopDailyUrl = trimUrl(import.meta.env.VITE_SHOP_DAILY_URL);
export const shopDailyPrintUrl = trimUrl(import.meta.env.VITE_SHOP_DAILY_PRINT_URL);
export const shopQuarterlyUrl = trimUrl(import.meta.env.VITE_SHOP_QUARTERLY_URL);
export const shopQuarterlyPrintUrl = trimUrl(import.meta.env.VITE_SHOP_QUARTERLY_PRINT_URL);
export const shopCollectionUrl = trimUrl(import.meta.env.VITE_SHOP_COLLECTION_URL);
export const shopCollectionPrintUrl = trimUrl(import.meta.env.VITE_SHOP_COLLECTION_PRINT_URL);

/** Fallback when no VITE_PROGRAM_HUB_URL — existing formation site */
export const formationExploreFallback = 'https://simplicityandproductivity.com/';
export const monicaStoryUrl =
  trimUrl(import.meta.env.VITE_MONICA_STORY_URL) || creatorUrl || formationExploreFallback;

export function formationExploreUrl() {
  return programHubUrl || formationExploreFallback;
}

/**
 * Teachable course library when set; otherwise the Formation / program hub URL.
 * Pass `domain` (e.g. IDENTITY) so the outbound link carries the thin-place track.
 */
export function formationTeachableUrl({ domain } = {}) {
  const base = courseLibraryUrl;
  if (!domain) return base;
  return withUtmParams(base, {
    utm_source: 'alignmentos',
    utm_medium: 'app',
    utm_campaign: 'formation',
    utm_content: String(domain).toLowerCase(),
  });
}

function withUtmParams(url, params) {
  if (!url) return '';
  try {
    const u = new URL(url);
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v == null || v === '') return;
      u.searchParams.set(k, String(v));
    });
    return u.toString();
  } catch (_) {
    return url;
  }
}

/** Outbound Creator URL with basic UTM tracking applied. */
export function creatorHandoffUrl({ medium = 'app', source = 'alignmentos', campaign = 'creator' } = {}) {
  return withUtmParams(creatorUrl, {
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
  });
}

/** Extra footer nav items when env URLs are set */
export const extraMarketingFooterLinks = (() => {
  const out = [];
  if (programHubUrl) out.push({ href: programHubUrl, label: 'Programs', external: true });
  if (courseLibraryUrl) out.push({ href: courseLibraryUrl, label: 'Courses', external: true });
  if (bookingUrl) out.push({ href: bookingUrl, label: 'Book a call', external: true });
  return out;
})();
