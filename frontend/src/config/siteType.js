/**
 * Homepage is the source of truth for type and color.
 * Playfair for titles, system sans for body, olive / ivory / ink only.
 */
export const type = {
  page: 'min-h-screen w-full min-w-0 max-w-full overflow-x-hidden bg-alignment-page text-alignment-accent flex flex-col',
  kicker: 'text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.22em] text-alignment-primary/70',
  h1: 'font-display italic font-normal text-[2.15rem] sm:text-[2.75rem] md:text-[3.15rem] leading-[1.18] tracking-tight text-alignment-accent',
  h1Hero:
    'font-display italic font-normal text-[2.25rem] sm:text-[3.15rem] md:text-[3.45rem] leading-[1.18] tracking-tight text-balance',
  h2: 'font-display text-2xl sm:text-3xl font-medium text-alignment-accent leading-tight tracking-tight',
  h3: 'font-display text-xl sm:text-2xl font-medium text-alignment-accent tracking-tight',
  quote: 'font-display text-xl sm:text-2xl font-normal text-alignment-accent leading-snug tracking-tight text-balance',
  body: 'text-sm sm:text-base text-alignment-accent/70 leading-relaxed',
  muted: 'text-[11px] sm:text-xs text-alignment-accent/45',
};
