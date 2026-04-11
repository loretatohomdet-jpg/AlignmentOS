/**
 * Diagnostic + results styling — alignment palette:
 * foundation, surface, accent text, primary olive accents (see tailwind `alignment.*`).
 */
export const diag = {
  /** Page / section background */
  bg: 'bg-alignment-foundation',
  /** Surfaces that read as “card on warm ground” */
  card: 'bg-alignment-surface',
  /** Primary text */
  text: 'text-alignment-accent',
  /** Secondary labels */
  muted: 'text-alignment-accent/55',
  /** Tertiary / helper */
  subtle: 'text-alignment-accent/45',
  /** Category line above question */
  category: 'text-alignment-accent/50',
  /** Accent for links & small highlights */
  accent: 'text-alignment-accent',
  /** Primary actions — deep olive */
  btn: 'bg-alignment-primary text-white',
  btnHover: 'hover:bg-alignment-primary/90',
  /** Progress bar — primary olive (grounding / progress) */
  barTrack: 'bg-alignment-accent/[0.08]',
  barFill: 'bg-alignment-primary',
  /** Borders */
  border: 'border-alignment-accent/[0.08]',
  /** Inputs */
  input:
    'border-alignment-accent/10 bg-alignment-surface text-alignment-accent placeholder:text-alignment-accent/40',
  /** Primary strain title */
  strainTitle: 'text-alignment-accent',
  /** Alignment “type” card */
  typeCard: 'bg-alignment-surface border border-alignment-accent/[0.06] shadow-apple',
};

/**
 * Full-screen diagnostic — dark charcoal immersive flow (accent as backdrop).
 */
export const diagFlow = {
  /** Dark olive-brown canvas — immersive flow without pure black */
  page: 'bg-alignment-deep text-white',
  kicker: 'text-white/50',
  muted: 'text-white/60',
  subtle: 'text-white/45',
  category: 'text-white/50',
  barTrack: 'bg-alignment-surface/15',
  barFill: 'bg-alignment-primary',
  domainCard: 'rounded-2xl border border-white/10 bg-neutral-900 shadow-none',
  domainKicker: 'text-white/45',
  domainTitle: 'text-white',
  domainBody: 'text-neutral-400',
  question: 'text-white',
  likertIdle:
    'border border-white/35 bg-transparent text-white hover:border-white/55 hover:bg-alignment-surface/[0.06]',
  likertActive: 'bg-alignment-surface text-alignment-accent border-alignment-surface ring-2 ring-white/25',
  likertCaption: 'text-neutral-400',
  scaleEnds: 'text-white/40',
  likertHint: 'text-neutral-500',
  footerCount: 'text-white/45',
  primaryBtn: 'bg-alignment-surface text-alignment-accent hover:bg-alignment-foundation',
  primaryBtnDisabled: 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-white/10',
  ghostLink: 'text-neutral-400 hover:text-white',
  errorBox: 'rounded-2xl border border-white/20 bg-neutral-900 text-neutral-200 px-4 py-3',
  emptySurface: 'rounded-2xl border border-white/10 bg-neutral-900',
  reviewCard: 'rounded-2xl border border-white/10 bg-neutral-900',
  reviewMuted: 'text-neutral-400',
  reviewLink: 'text-neutral-400 hover:text-white',
};

/** Logged-in results (/results) — warm surfaces + charcoal type */
export const resultsUi = {
  wrap: 'bg-alignment-foundation rounded-2xl sm:rounded-3xl',
  label: 'text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-alignment-accent/45',
  panel: `rounded-xl border ${diag.border} ${diag.card} px-5 py-6 sm:px-7 sm:py-7 shadow-apple`,
  heading: 'font-display text-alignment-accent',
  btnPrimary: `${diag.btn} ${diag.btnHover} inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors`,
  btnOutline:
    'inline-flex items-center justify-center rounded-sm border border-alignment-accent/15 bg-alignment-surface text-alignment-accent text-[10px] font-semibold uppercase tracking-[0.14em] px-5 py-2.5 hover:bg-alignment-accent/[0.03] transition-colors',
  input:
    'w-full rounded-xl border border-alignment-accent/12 bg-alignment-surface px-4 py-3 text-sm text-alignment-accent placeholder:text-alignment-accent/40 focus:border-alignment-primary/40 focus:outline-none focus:ring-2 focus:ring-alignment-primary/15',
};

export const diagRun = {
  page: 'bg-alignment-foundation text-alignment-accent',
  kicker: 'text-alignment-accent/45',
  muted: 'text-alignment-accent/55',
  subtle: 'text-alignment-accent/45',
  category: 'text-alignment-accent/50',
  barTrack: 'bg-alignment-accent/10',
  barFill: 'bg-alignment-primary',
  domainCard: 'rounded-2xl border border-alignment-accent/10 bg-alignment-surface shadow-apple',
  domainKicker: 'text-alignment-accent/45',
  domainTitle: 'text-alignment-accent',
  domainBody: 'text-alignment-accent/60',
  question: 'text-alignment-accent',
  likertIdle:
    'border border-alignment-accent/15 bg-alignment-surface text-alignment-accent hover:border-alignment-accent/30 hover:bg-alignment-accent/[0.02]',
  likertActive: 'bg-alignment-primary text-white border-alignment-primary ring-2 ring-alignment-primary/20',
  likertCaption: 'text-alignment-accent/50',
  scaleEnds: 'text-alignment-accent/40',
  likertHint: 'text-alignment-accent/45',
  footerCount: 'text-alignment-accent/45',
  primaryBtn: 'bg-alignment-primary text-white hover:bg-alignment-primary/90',
  primaryBtnDisabled: 'bg-alignment-primary/15 text-alignment-accent/35 cursor-not-allowed border border-alignment-primary/20',
  ghostLink: 'text-alignment-accent/45 hover:text-alignment-accent',
  errorBox: 'rounded-2xl border border-alignment-accent/10 bg-alignment-surface text-alignment-accent px-4 py-3',
  emptySurface: 'rounded-2xl border border-alignment-accent/10 bg-alignment-surface shadow-apple',
  reviewCard: 'rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surface shadow-apple',
  reviewMuted: 'text-alignment-accent/55',
  reviewLink: 'text-alignment-accent/55 hover:text-alignment-accent',
};
