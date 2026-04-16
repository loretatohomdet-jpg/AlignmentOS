import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { checkoutHabitUrl, checkoutJourneyUrl, courseLibraryUrl } from '../config/externalLinks';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { SiteSecondaryFooterNav } from '../components/SiteFooterNav';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-foundation';

const freeFeatures = [
  '24-question diagnostic',
  'Score /100 + six domain breakdown',
  'Alignment Type named',
  'Primary Strain identified',
  'Three habits previewed',
  'Identity Anchors introduced',
  '90-day projection',
  'Shareable score card',
];

const habitFeatures = [
  'Everything in Free',
  'Full 7-screen Dashboard',
  'Three habits tracked daily',
  'Habits recalibrate every 90 days',
  'Weekly Review — stored',
  'Quarterly Reset ceremony',
  'Score history + Alignment Map',
  'Accountability Partner invite',
];

const journeyFeatures = [
  '14 formation modules · 90 days',
  'Identity Formation + Mission Discovery',
  'Life Architecture — work, time, relationships',
  'Habit installation + Quarterly Reset',
  'Alignment Score Day 1 vs Day 90',
  'Habit Engine included ($12/mo value)',
  'Lifetime access to all modules',
];

const compareRows = [
  { feature: '24-question diagnostic', free: true, habit: true, journey: true },
  { feature: 'Alignment Score /100', free: true, habit: true, journey: true },
  { feature: 'Alignment Type + Primary Strain', free: true, habit: true, journey: true },
  { feature: 'Three habit preview', free: true, habit: true, journey: true },
  { feature: 'Shareable score card', free: true, habit: true, journey: true },
  { feature: 'Full 7-screen Dashboard', free: false, habit: true, journey: true },
  { feature: 'Daily habit tracking', free: false, habit: true, journey: true },
  { feature: 'Weekly Review (stored)', free: false, habit: true, journey: true },
  { feature: 'Quarterly Reset ceremony', free: false, habit: true, journey: true },
  { feature: 'Score history + Alignment Map', free: false, habit: true, journey: true },
  { feature: 'Recalibration every 90 days', free: false, habit: true, journey: true },
  { feature: '14 formation modules', free: false, habit: false, journey: true },
  { feature: 'Identity Formation programme', free: false, habit: false, journey: true },
  { feature: 'Mission Discovery programme', free: false, habit: false, journey: true },
  { feature: 'Life Architecture modules', free: false, habit: false, journey: true },
  { feature: 'Score Day 1 vs Day 90', free: false, habit: false, journey: true },
];

const faqBlocks = [
  {
    title: 'The diagnostic',
    body:
      'Free forever. No trial, no credit card, no time limit. You get the 24-question diagnostic, your score, Alignment Type, primary strain, three habits, and Identity Anchors. Keep those results and free access permanently — even if you cancel other services later.',
  },
  {
    title: 'Habit Engine',
    body:
      'Stores daily habit completions, builds habit integrity, saves weekly reviews, and recalibrates when you retake the diagnostic. Billing is through Stripe’s customer portal — cancel anytime, no friction.',
  },
  {
    title: 'Journey to Purpose',
    body:
      'A 90-day, 14-module formation path: Identity, Purpose, Life Architecture, Habit Installation, Quarterly Reset, and more. One payment, lifetime access. Includes Habit Engine. Goes far deeper than the diagnostic alone.',
  },
  {
    title: 'How this differs',
    body:
      'Alignment OS is not another task list. It asks whether your actions are rooted in who you are — not just what you do. Retake the diagnostic about every 90 days to align with your Quarterly Reset.',
  },
  {
    title: 'Philosophy',
    body:
      'Unlike productivity apps that optimise throughput, we focus on coherence across identity, purpose, mindset, habits, environment, and execution.',
  },
  {
    title: 'Cadence',
    body:
      'Quarterly diagnostic retakes pair with the Quarterly Reset ceremony so structure compounds instead of drifting.',
  },
];

function Cell({ included }) {
  return (
    <td className="px-3 py-4 text-center text-sm text-alignment-accent/80">
      {included ? (
        <span className="text-alignment-accent" aria-label="Included">
          ✓
        </span>
      ) : (
        <span className="text-alignment-accent/35" aria-label="Not included">
          —
        </span>
      )}
    </td>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState('yearly');

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
  const habitYearlySave = habitMonthly * 12 - habitYearly;

  return (
    <div className="min-h-screen w-full bg-alignment-surface flex flex-col overflow-x-hidden">
      <a href="#pricing-main" className="skip-to-main">
        Skip to main content
      </a>

      <SiteMarketingHeader />

      <main id="pricing-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        {/* Hero */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32 text-center">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">Pricing</p>
            <h1 className="mt-6 font-display text-[2rem] sm:text-[2.5rem] md:text-[2.85rem] font-medium text-alignment-accent leading-[1.15] tracking-tight text-balance">
              Begin free.
              <br />
              <span className="italic font-normal text-alignment-accent/80">Go deeper when</span>
              <br />
              ready.
            </h1>
            <p className="mt-8 text-sm sm:text-base text-alignment-accent/65 font-sans max-w-md mx-auto leading-relaxed">
              Three offers. Each earns the next.
            </p>
          </div>
        </section>

        {/* Billing toggle + cards */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surface">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-20">
            <div className="flex flex-col items-center gap-3 mb-12 sm:mb-16">
              <div
                className="inline-flex items-center gap-1 rounded-full border border-alignment-accent/10 bg-alignment-accent/[0.02] p-1"
                role="group"
                aria-label="Billing period"
              >
                <button
                  type="button"
                  onClick={() => setBilling('monthly')}
                  className={`rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                    billing === 'monthly' ? 'bg-alignment-surface text-alignment-accent shadow-sm' : 'text-alignment-accent/50 hover:text-alignment-accent/80'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBilling('yearly')}
                  className={`rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                    billing === 'yearly' ? 'bg-alignment-surface text-alignment-accent shadow-sm' : 'text-alignment-accent/50 hover:text-alignment-accent/80'
                  }`}
                >
                  Yearly
                </button>
              </div>
              {billing === 'yearly' && (
                <span className="text-[10px] uppercase tracking-[0.16em] text-alignment-accent/45">Save 17%</span>
              )}
            </div>

            <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 items-stretch">
              {/* Free */}
              <div className="flex flex-col border border-alignment-accent/[0.1] bg-alignment-surface p-6 sm:p-8 shadow-sm">
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-alignment-accent/45">Free forever</p>
                <p className="mt-6 font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">$0</p>
                <p className="mt-2 text-sm font-semibold text-alignment-accent">Alignment Diagnostic</p>
                <ul className="mt-8 space-y-3 flex-1">
                  {freeFeatures.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-alignment-accent/80">
                      <span className="text-alignment-accent shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/assessment"
                  className={`mt-10 w-full inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] py-3.5 transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
                >
                  Begin free <span aria-hidden className="ml-2">→</span>
                </Link>
              </div>

              {/* Habit Engine */}
              <div className="relative flex flex-col border-2 border-alignment-accent/20 bg-alignment-surface p-6 sm:p-8 shadow-apple z-10">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-alignment-primary text-white text-[9px] font-medium uppercase tracking-[0.2em] px-3 py-1">
                  Core product
                </span>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-alignment-accent/45 mt-2">
                  {billing === 'yearly' ? 'Yearly · best value' : 'Monthly'}
                </p>
                <p className="mt-6 font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">
                  {billing === 'yearly' ? `$${habitYearly}` : `$${habitMonthly}`}
                </p>
                <p className="mt-1 text-xs text-alignment-accent/50">
                  {billing === 'yearly'
                    ? `per year — save $${habitYearlySave}`
                    : 'per month'}
                </p>
                <p className="mt-4 text-sm font-semibold text-alignment-accent">Habit Engine</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {habitFeatures.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-alignment-accent/80">
                      <span className="text-alignment-accent shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {checkoutHabitUrl ? (
                  <a
                    href={checkoutHabitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-10 w-full inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] py-3.5 transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
                  >
                    Activate <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <Link
                    to="/login"
                    className={`mt-10 w-full inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] py-3.5 transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
                  >
                    Activate <span aria-hidden className="ml-2">→</span>
                  </Link>
                )}
                <p className="mt-4 text-center text-[11px] text-alignment-accent/45">
                  Secure checkout via Stripe · Cancel any time
                </p>
              </div>

              {/* Journey — anchor: /pricing#journey-tier , /journey */}
              <div
                id="journey-tier"
                className="flex flex-col scroll-mt-28 border border-white/10 bg-alignment-primary text-white p-6 sm:p-8"
              >
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/45">
                  Formation layer · one-time
                </p>
                <p className="mt-6 font-display text-4xl sm:text-[2.75rem] font-medium tabular-nums">$397</p>
                <p className="mt-1 text-xs text-white/45">one-time · lifetime access</p>
                <p className="mt-4 text-sm font-semibold">Journey to Purpose</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {journeyFeatures.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-white/85">
                      <span className="text-white shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {checkoutJourneyUrl ? (
                  <a
                    href={checkoutJourneyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 w-full inline-flex items-center justify-center rounded-sm bg-alignment-surface text-alignment-accent text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] py-3.5 transition-colors hover:bg-alignment-surface/90 ${focusRing} focus-visible:ring-offset-alignment-foundation`}
                  >
                    Begin journey to purpose <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <Link
                    to="/login"
                    className={`mt-6 w-full inline-flex items-center justify-center rounded-sm bg-alignment-surface text-alignment-accent text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] py-3.5 transition-colors hover:bg-alignment-surface/90 ${focusRing} focus-visible:ring-offset-alignment-foundation`}
                  >
                    Begin journey to purpose <span aria-hidden className="ml-2">→</span>
                  </Link>
                )}
                {courseLibraryUrl ? (
                  <a
                    href={courseLibraryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full inline-flex items-center justify-center rounded-sm border border-white/25 text-white text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] py-3 transition-colors hover:bg-alignment-surface/5"
                  >
                    See the full programme <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <Link
                    to="/start"
                    className="mt-3 w-full inline-flex items-center justify-center rounded-sm border border-white/25 text-white text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] py-3 transition-colors hover:bg-alignment-surface/5"
                  >
                    See the full programme <span aria-hidden className="ml-2">→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Compare table */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">Compare</p>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-medium text-alignment-accent tracking-tight text-balance">
              What&apos;s included at each level.
            </h2>
            <div className="mt-12 overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-alignment-accent/[0.1]">
                    <th className="py-4 pr-4 text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.18em] text-alignment-accent/45">
                      Feature
                    </th>
                    <th className="py-4 px-2 text-center text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.18em] text-alignment-accent/45">
                      Free
                    </th>
                    <th className="py-4 px-2 text-center text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.18em] text-alignment-accent/45">
                      Habit Engine
                    </th>
                    <th className="py-4 pl-2 text-center text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.18em] text-alignment-accent/45">
                      Journey
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.feature} className="border-b border-alignment-accent/[0.08]">
                      <td className="py-4 pr-4 text-sm text-alignment-accent/85">{row.feature}</td>
                      <Cell included={row.free} />
                      <Cell included={row.habit} />
                      <Cell included={row.journey} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Beyond the individual */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surface">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">
              Beyond the individual
            </p>
            <h2 className="mt-4 font-display text-2xl sm:text-[2.35rem] font-medium text-alignment-accent leading-[1.15] tracking-tight max-w-2xl text-balance">
              For leaders, organizations, and{' '}
              <span className="italic font-normal text-alignment-accent/80">institutions.</span>
            </h2>
            <p className="mt-6 text-sm sm:text-base text-alignment-accent/65 max-w-2xl leading-relaxed font-sans">
              All organizational, leadership, and institutional pricing is by direct conversation. No public price list —
              every engagement is scoped to fit.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  label: 'Leaders',
                  title: 'Leadership Alignment Programme',
                  body: 'A 90-day programme for leaders and leadership teams — identity, decision architecture, culture, and execution rhythms.',
                },
                {
                  label: 'Organizations',
                  title: 'Organizational Alignment OS',
                  body: 'Diagnostic, team platform, and formation programme for mission-driven organizations and founder-led companies.',
                },
                {
                  label: 'Institutions',
                  title: 'Institutional Access',
                  body: 'Platform access, cohorts, and formation programmes for missionary organizations, universities, and professional networks.',
                },
              ].map((card) => (
                <div key={card.label} className="border border-alignment-accent/[0.08] bg-alignment-surface p-6 sm:p-8 flex flex-col">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-alignment-accent/45">{card.label}</p>
                  <h3 className="mt-4 font-display text-lg font-semibold text-alignment-accent">{card.title}</h3>
                  <p className="mt-3 text-sm text-alignment-accent/65 leading-relaxed flex-1 font-sans">{card.body}</p>
                  <Link
                    to="/business"
                    className="mt-8 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-alignment-accent/55 hover:text-alignment-accent border-b border-alignment-accent/20 pb-0.5 self-start transition-colors"
                  >
                    Learn more <span aria-hidden>→</span>
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-14 text-center text-sm text-alignment-accent/50">
              Contact{' '}
              <a href="mailto:organizations@alignmentos.com" className="text-alignment-accent/70 underline underline-offset-2 hover:text-alignment-accent">
                organizations@alignmentos.com
              </a>{' '}
              to start the conversation.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">
              Common questions
            </p>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-medium text-alignment-accent tracking-tight text-balance max-w-2xl">
              Everything you need to decide.
            </h2>
            <div className="mt-12 grid gap-px bg-alignment-primary/20 border border-alignment-primary/20 sm:grid-cols-2 lg:grid-cols-3">
              {faqBlocks.map((block) => (
                <div key={block.title} className="bg-apple-surface-muted p-6 sm:p-8">
                  <h3 className="text-sm font-semibold text-alignment-accent">{block.title}</h3>
                  <p className="mt-3 text-sm text-alignment-accent/65 leading-relaxed font-sans">{block.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                to="/assessment"
                className={`inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] px-8 py-3.5 transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
              >
                Still unsure? Take the free diagnostic first <span aria-hidden className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="w-full border-t border-white/15 bg-alignment-primary">
          <div className="max-w-xl mx-auto px-6 py-20 sm:py-28 text-center">
            <h2 className="font-display text-[1.75rem] sm:text-2xl md:text-[2.25rem] font-medium text-white leading-snug text-balance">
              The diagnostic{' '}
              <span className="block sm:inline italic font-normal text-white/90 mt-1 sm:mt-0">costs nothing.</span>
            </h2>
            <Link
              to="/assessment"
              className="mt-10 inline-flex items-center justify-center rounded-sm bg-alignment-surface text-alignment-accent text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 transition-colors hover:bg-alignment-foundation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-primary"
            >
              Begin free <span aria-hidden className="ml-2">→</span>
            </Link>
            <p className="mt-8 text-xs sm:text-sm text-white/45 font-sans">
              24 questions · 12 minutes · Free forever · No card required
            </p>
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
