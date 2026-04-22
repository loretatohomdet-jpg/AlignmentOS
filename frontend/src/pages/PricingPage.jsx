import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import {
  bookingUrl,
  checkoutHabitUrl,
  checkoutJourneyUrl,
  cohortApplyUrl,
  courseLibraryUrl,
  formationExploreUrl,
} from '../config/externalLinks';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { SiteSecondaryFooterNav } from '../components/SiteFooterNav';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-foundation';

const foundationFree = [
  '24-question diagnostic',
  'Score across six domains',
  'Alignment Type named',
  'Primary gap identified',
  'Three habits previewed',
];

const foundationHabit = [
  'Everything in Free',
  'Full 7-screen dashboard',
  'Three habits tracked daily',
  'Weekly review — stored',
  'Quarterly reset ceremony',
  'Score history + alignment map',
];

const foundationJourney = [
  '6 formation modules · 6 weeks',
  'Identity, mission & life architecture',
  'Personal rule of life',
  'Habit Engine — lifetime access (replaces monthly subscription)',
  'Before & after Alignment Score',
];

const consultationFeatures = [
  'Full score review across all six domains',
  'Formation conversation — identity, direction, obstacles',
  'Clear next step recommended',
  'Written follow-up within 24 hours',
];

const faqBlocks = [
  {
    title: 'The diagnostic (Step 1)',
    body:
      'Free forever — no card, no trial window. Your score shows how the six domains cohere today and which gap to address first.',
  },
  {
    title: 'Habit Engine (Step 2)',
    body:
      'Monthly or yearly billing through Stripe. Cancel any time. Daily habits, stored weekly reviews, and quarterly reset rhythm.',
  },
  {
    title: 'Journey & cohort (Steps 3–5)',
    body:
      'Journey to Purpose (self-guided) is one payment with lifetime access. Guided cohort is limited enrolment; resources and consultation are optional add-ons whenever you are ready.',
  },
];

function CheckList({ items, checkClass = 'text-alignment-primary' }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((f) => (
        <li key={f} className="flex gap-2.5 text-sm text-alignment-accent/80 font-sans leading-relaxed">
          <span className={`${checkClass} shrink-0`} aria-hidden>
            ✓
          </span>
          {f}
        </li>
      ))}
    </ul>
  );
}

function SectionRule({ children, bgClass = 'bg-alignment-surface' }) {
  return (
    <div className="relative flex items-center justify-center py-8 sm:py-10">
      <div className="absolute inset-x-0 top-1/2 h-px bg-alignment-accent/[0.1]" aria-hidden />
      <span
        className={`relative px-5 sm:px-8 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent/50 ${bgClass}`}
      >
        {children}
      </span>
    </div>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState('monthly');

  useEffect(() => {
    const prev = document.title;
    document.title = 'Pricing — Alignment OS';
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash !== '#journey-tier') return;
    const el = document.getElementById('journey-tier');
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, []);

  const habitMonthly = 12;
  const habitYearly = 120;
  const resourcesHref = courseLibraryUrl || formationExploreUrl();

  const toggleActive = 'bg-alignment-primary text-white shadow-sm';
  const toggleIdle = 'text-alignment-accent/50 hover:text-alignment-accent/80';

  return (
    <div className="min-h-screen w-full bg-alignment-surface text-alignment-accent flex flex-col overflow-x-hidden">
      <a href="#pricing-main" className="skip-to-main">
        Skip to main content
      </a>

      <SiteMarketingHeader />

      <main id="pricing-main" className="flex-1 w-full scroll-mt-16 font-sans" tabIndex={-1}>
        {/* Hero */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32 text-center">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">Pricing</p>
            <h1 className="mt-6 font-display text-[2rem] sm:text-[2.5rem] md:text-[2.85rem] font-medium text-alignment-accent leading-[1.15] tracking-tight text-balance">
              <em className="italic font-medium">Begin</em> free.
              <br />
              <span className="text-alignment-primary">Go deeper when ready.</span>
            </h1>
            <p className="mt-8 text-sm sm:text-base text-alignment-accent/65 max-w-lg mx-auto leading-relaxed">
              Five steps. Each earns the next. Nothing is required before you are ready.
            </p>
          </div>
        </section>

        {/* Habit Engine billing + Steps 1–3 */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surface">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-20">
            <p className="text-center text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.22em] text-alignment-accent/45">
              Habit Engine billing
            </p>

            <div className="mt-6 flex flex-col items-center gap-2">
              <div
                className="inline-flex items-center gap-1 rounded-full border border-alignment-accent/10 bg-alignment-accent/[0.02] p-1"
                role="group"
                aria-label="Billing period"
              >
                <button
                  type="button"
                  onClick={() => setBilling('monthly')}
                  className={`rounded-full px-4 sm:px-5 py-2.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                    billing === 'monthly' ? toggleActive : toggleIdle
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBilling('yearly')}
                  className={`rounded-full px-4 sm:px-5 py-2.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                    billing === 'yearly' ? toggleActive : toggleIdle
                  }`}
                >
                  Yearly
                  <span className="hidden sm:inline"> · save 17%</span>
                </button>
              </div>
              {billing === 'yearly' && (
                <span className="text-[10px] uppercase tracking-[0.16em] text-alignment-accent/45 sm:hidden">Save 17%</span>
              )}
            </div>

            <SectionRule>Steps 1 – 3 · The foundation</SectionRule>

            <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-0 border border-alignment-accent/[0.1] bg-alignment-surface divide-y lg:divide-y-0 lg:divide-x divide-alignment-accent/[0.1] shadow-sm">
              {/* Step 1 */}
              <div className="flex flex-col p-6 sm:p-8 lg:min-h-[26rem]">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary">Step 1</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/55">Free · forever</span>
                </div>
                <h2 className="mt-6 font-display text-xl sm:text-2xl font-medium text-alignment-accent tracking-tight">Alignment Diagnostic</h2>
                <p className="mt-5 font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">$0</p>
                <p className="mt-1 text-xs text-alignment-accent/50">No card required</p>
                <CheckList items={foundationFree} />
                <div className="flex-1" />
                <Link
                  to="/assessment"
                  className={`mt-10 w-full inline-flex items-center justify-center rounded-sm border border-alignment-accent/20 bg-alignment-surface px-4 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-accent transition-colors hover:bg-alignment-accent/[0.03] ${focusRing}`}
                >
                  Begin free <span aria-hidden className="ml-2">→</span>
                </Link>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col p-6 sm:p-8 lg:min-h-[26rem]">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary">Step 2</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary/90">
                    {billing === 'yearly' ? 'Yearly subscription' : 'Monthly subscription'}
                  </span>
                </div>
                <h2 className="mt-6 font-display text-xl sm:text-2xl font-medium text-alignment-accent tracking-tight">Habit Engine</h2>
                <p className="mt-5 font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">
                  {billing === 'yearly' ? `$${habitYearly}` : `$${habitMonthly}`}
                </p>
                <p className="mt-1 text-xs text-alignment-accent/50">
                  {billing === 'yearly' ? 'per year · save 17%' : 'per month · cancel any time'}
                </p>
                <CheckList items={foundationHabit} />
                <div className="flex-1" />
                {checkoutHabitUrl ? (
                  <a
                    href={checkoutHabitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-10 w-full inline-flex items-center justify-center rounded-sm border border-alignment-primary/40 bg-transparent px-4 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-primary transition-colors hover:bg-alignment-primary/[0.06] ${focusRing}`}
                  >
                    Activate <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <Link
                    to="/login"
                    className={`mt-10 w-full inline-flex items-center justify-center rounded-sm border border-alignment-primary/40 bg-transparent px-4 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-primary transition-colors hover:bg-alignment-primary/[0.06] ${focusRing}`}
                  >
                    Activate <span aria-hidden className="ml-2">→</span>
                  </Link>
                )}
                <p className="mt-3 text-center text-[11px] text-alignment-accent/45">Secure checkout · Stripe</p>
              </div>

              {/* Step 3 */}
              <div
                id="journey-tier"
                className="flex flex-col scroll-mt-28 p-6 sm:p-8 lg:min-h-[26rem] bg-alignment-primary/[0.03] border-t-2 border-t-alignment-primary/25 lg:border-t-0 lg:border-l-2 lg:border-l-alignment-primary/20"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary">Step 3</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/55">Course · one-time</span>
                </div>
                <h2 className="mt-6 font-display text-xl sm:text-2xl font-medium text-alignment-accent tracking-tight">Journey to Purpose</h2>
                <p className="mt-5 font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">$297</p>
                <p className="mt-1 text-xs text-alignment-accent/50">Self-guided · lifetime access</p>
                <CheckList items={foundationJourney} />
                <div className="flex-1" />
                {checkoutJourneyUrl ? (
                  <a
                    href={checkoutJourneyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-10 w-full inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white px-4 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
                  >
                    Begin journey <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <Link
                    to="/login"
                    className={`mt-10 w-full inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white px-4 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
                  >
                    Begin journey <span aria-hidden className="ml-2">→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Steps 4–5 */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
            <p className="text-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-alignment-accent/50">
              Steps 4 – 5 · Go further
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="flex flex-col border border-alignment-accent/[0.1] bg-alignment-surface p-6 sm:p-8 shadow-sm">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary">Step 4</span>
                <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary/90">Formation resources</span>
                <h2 className="mt-5 font-display text-xl sm:text-2xl font-medium text-alignment-accent tracking-tight">
                  Planners, workbooks & short courses
                </h2>
                <p className="mt-5 font-display text-3xl sm:text-4xl font-medium text-alignment-accent tabular-nums">$19 – $97</p>
                <p className="mt-1 text-xs text-alignment-accent/50">One-time · digital · instant access</p>
                <p className="mt-5 text-sm text-alignment-accent/70 leading-relaxed">
                  Standalone tools built to deepen the work already underway — a daily planner, quarterly workbook, vision clarity guide,
                  and short formation courses rooted in the six-domain framework. Each connects back to your Alignment Score.
                </p>
                <div className="flex-1" />
                <a
                  href={resourcesHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 w-full sm:w-auto inline-flex items-center justify-center rounded-sm border border-alignment-primary/40 px-6 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-primary transition-colors hover:bg-alignment-primary/[0.06] ${focusRing}`}
                >
                  Browse resources <span aria-hidden className="ml-2">→</span>
                </a>
              </div>

              <div className="flex flex-col border border-alignment-accent/[0.1] bg-alignment-surface p-6 sm:p-8 shadow-sm">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary">Optional · any stage</span>
                <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary/90">One-to-one · one-time</span>
                <h2 className="mt-5 font-display text-xl sm:text-2xl font-medium text-alignment-accent tracking-tight">Formation consultation</h2>
                <p className="mt-5 font-display text-3xl sm:text-4xl font-medium text-alignment-accent tabular-nums">$127</p>
                <p className="mt-1 text-xs text-alignment-accent/50">60 minutes · one session</p>
                <CheckList items={consultationFeatures} />
                <div className="flex-1" />
                {bookingUrl ? (
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 w-full sm:w-auto inline-flex items-center justify-center rounded-sm border border-alignment-primary/40 px-6 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-primary transition-colors hover:bg-alignment-primary/[0.06] ${focusRing}`}
                  >
                    Book a session <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <Link
                    to="/business"
                    className={`mt-8 w-full sm:w-auto inline-flex items-center justify-center rounded-sm border border-alignment-primary/40 px-6 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-primary transition-colors hover:bg-alignment-primary/[0.06] ${focusRing}`}
                  >
                    Book a session <span aria-hidden className="ml-2">→</span>
                  </Link>
                )}
                <p className="mt-4 text-[11px] text-alignment-accent/45">With Kylie Heins · Jack Beers · Roxane de Vera</p>
              </div>
            </div>

            <div className="mt-8 border border-alignment-accent/[0.1] bg-alignment-surface p-6 sm:p-8 lg:p-10 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary">Step 5</span>
                  <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary/90">
                    Guided cohort · small group
                  </span>
                  <h2 className="mt-5 font-display text-xl sm:text-2xl md:text-[1.65rem] font-medium text-alignment-accent tracking-tight">
                    Journey to Purpose — Guided
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-alignment-accent/70 leading-relaxed">
                    The full six-week programme with a formation guide, a small cohort of peers, live sessions, and built-in accountability.
                    For those who want to do the work — together.
                  </p>
                  <p className="mt-4 text-xs sm:text-sm italic text-alignment-primary/90">
                    Includes lifetime Habit Engine access · Before & after Alignment Score
                  </p>
                </div>
                <div className="flex flex-col items-start lg:items-end shrink-0 gap-4">
                  <div className="text-left lg:text-right">
                    <p className="font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">$997</p>
                    <p className="mt-1 text-xs text-alignment-accent/50">Per person · cohort enrolment</p>
                  </div>
                  {cohortApplyUrl ? (
                    <a
                      href={cohortApplyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white px-6 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
                    >
                      Apply for cohort <span aria-hidden className="ml-2">→</span>
                    </a>
                  ) : (
                    <Link
                      to="/business"
                      className={`inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white px-6 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
                    >
                      Apply for cohort <span aria-hidden className="ml-2">→</span>
                    </Link>
                  )}
                  <p className="text-[11px] text-alignment-accent/45 lg:text-right">Limited places per cohort</p>
                </div>
              </div>
            </div>

            <div className="mt-14 sm:mt-16 text-center max-w-xl mx-auto">
              <p className="text-sm sm:text-base text-alignment-accent/65 leading-relaxed">
                Not sure where to begin? The diagnostic is always first. Your score determines everything else.
              </p>
              <Link
                to="/assessment"
                className={`mt-6 inline-flex items-center justify-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-alignment-primary border-b border-alignment-primary/30 pb-0.5 hover:border-alignment-primary/60 transition-colors ${focusRing} rounded-sm`}
              >
                Take the diagnostic — free <span aria-hidden className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Institutions */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surface">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">Beyond the individual</p>
            <h2 className="mt-4 font-display text-2xl sm:text-[2.15rem] font-medium text-alignment-accent leading-[1.15] tracking-tight max-w-2xl text-balance">
              For leaders, organizations, and <span className="italic font-normal text-alignment-accent/80">institutions.</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base text-alignment-accent/65 max-w-2xl leading-relaxed">
              Organizational and institutional pricing is by conversation — every engagement is scoped to fit.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { label: 'Leaders', title: 'Leadership Alignment Programme', body: 'Identity, decision architecture, culture, and execution rhythms for teams.' },
                { label: 'Organizations', title: 'Organizational Alignment OS', body: 'Diagnostic, platform, and formation for mission-driven companies.' },
                { label: 'Institutions', title: 'Institutional access', body: 'Cohorts and programmes for networks, schools, and mission fields.' },
              ].map((card) => (
                <div key={card.label} className="border border-alignment-accent/[0.08] bg-apple-surface-muted/50 p-6 flex flex-col">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-alignment-accent/45">{card.label}</p>
                  <h3 className="mt-3 font-display text-lg font-semibold text-alignment-accent">{card.title}</h3>
                  <p className="mt-3 text-sm text-alignment-accent/65 leading-relaxed flex-1">{card.body}</p>
                  <Link
                    to="/business"
                    className="mt-6 text-[10px] font-medium uppercase tracking-[0.18em] text-alignment-accent/55 hover:text-alignment-accent border-b border-alignment-accent/20 pb-0.5 self-start transition-colors"
                  >
                    Learn more <span aria-hidden>→</span>
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-12 text-center text-sm text-alignment-accent/50">
              Contact{' '}
              <a
                href="mailto:organizations@alignmentos.com"
                className="text-alignment-accent/70 underline underline-offset-2 hover:text-alignment-accent"
              >
                organizations@alignmentos.com
              </a>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">Common questions</p>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-medium text-alignment-accent tracking-tight max-w-2xl text-balance">
              How the five steps fit together
            </h2>
            <div className="mt-10 grid gap-px bg-alignment-primary/15 border border-alignment-primary/15 sm:grid-cols-2 lg:grid-cols-3">
              {faqBlocks.map((block) => (
                <div key={block.title} className="bg-apple-surface-muted p-6 sm:p-8">
                  <h3 className="text-sm font-semibold text-alignment-accent">{block.title}</h3>
                  <p className="mt-3 text-sm text-alignment-accent/65 leading-relaxed">{block.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="w-full border-t border-white/15 bg-alignment-primary">
          <div className="max-w-xl mx-auto px-6 py-20 sm:py-28 text-center">
            <h2 className="font-display text-[1.75rem] sm:text-2xl md:text-[2.25rem] font-medium text-white leading-snug text-balance">
              The diagnostic <span className="italic font-normal text-white/90">costs nothing.</span>
            </h2>
            <Link
              to="/assessment"
              className="mt-10 inline-flex items-center justify-center rounded-sm bg-alignment-surface text-alignment-accent text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 transition-colors hover:bg-alignment-foundation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-primary"
            >
              Begin free <span aria-hidden className="ml-2">→</span>
            </Link>
            <p className="mt-8 text-xs sm:text-sm text-white/45">24 questions · ~12 minutes · Free forever · No card required</p>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-alignment-accent/[0.08] bg-alignment-surface mt-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-8 flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <BrandLogo iconHeightPx={44} />
            <Link to="/" className={`text-sm text-alignment-accent/70 hover:text-alignment-accent ${focusRing} rounded-sm sm:text-right`}>
              ← Home
            </Link>
          </div>
          <SiteSecondaryFooterNav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end" />
        </div>
      </footer>
    </div>
  );
}
