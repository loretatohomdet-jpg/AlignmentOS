/**
 * Auth / account pages — match marketing typography (Playfair + system sans).
 * See LandingPage / PricingPage: `font-sans` on body copy, `font-display` on titles.
 */
export const authHeadingClass =
  'font-display text-[2rem] sm:text-[2.35rem] md:text-[2.75rem] font-medium text-alignment-accent leading-[1.15] tracking-tight text-balance';

/** Explicit `font-sans` so copy matches Pricing hero / landing (inherits same stack as `body`). */
export const authLeadClass =
  'mt-3 font-sans text-sm sm:text-base text-alignment-accent/65 leading-relaxed';

export const authLeadClassCompact = 'mt-2 font-sans text-sm text-alignment-accent/65 leading-relaxed';

/** Focus ring aligned with PricingPage CTAs (olive) */
export const authFocusRingClass =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-foundation';

/** Full-page auth primary button — matches Pricing “Begin free” / landing diagnostics CTA */
export const authPrimaryButtonMarketingClass = `w-full inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.16em] py-3.5 transition-colors duration-200 hover:bg-alignment-primary/90 disabled:opacity-50 disabled:cursor-not-allowed ${authFocusRingClass}`;

/** Modal / compact auth — smaller control, sentence case */
export const authPrimaryButtonCompactClass =
  'w-full rounded-full bg-alignment-primary text-white py-3.5 font-sans text-sm font-medium hover:bg-alignment-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200';
