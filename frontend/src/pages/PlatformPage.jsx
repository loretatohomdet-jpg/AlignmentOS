import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import DomainPillarIcon from '../components/DomainPillarIcon';
import {
  pageWidth,
  pillPrimary,
  pillOutline,
  SitePageFooter,
  CmsCta,
} from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import { DOMAIN_ORDER } from '../constants/domains';
import { usePageTitle } from '../hooks/usePageTitle';
import { pageCopy, useSitePage } from '../hooks/useSiteContent';

const DOMAIN_BLURBS = {
  IDENTITY: { label: 'Identity', tag: 'Who you are' },
  PURPOSE: { label: 'Purpose', tag: 'Why it matters' },
  MINDSET: { label: 'Mindset', tag: 'How you think' },
  HABITS: { label: 'Habits', tag: 'What you do' },
  ENVIRONMENT: { label: 'Environment', tag: 'Where you live' },
  EXECUTION: { label: 'Follow-through', tag: 'How it comes together' },
};

const FLOW_STEPS = [
  {
    n: '01',
    title: 'See',
    body: 'Your Map shows the whole picture.',
  },
  {
    n: '02',
    title: 'Choose',
    body: 'Your Plan names what matters now.',
  },
  {
    n: '03',
    title: 'Live',
    body: 'Daily + Review help you practice and adjust.',
  },
];

const PLATFORM_DEFAULTS = {
  eyebrow: 'Platform',
  headline: 'A clearer way forward.',
  subhead: 'See where you are. Choose what matters. Make one change.',
  ctaLabel: 'Take the Assessment',
  ctaHref: '/assessment',
};

const STALE_PLATFORM = new Set([
  'From insight to everyday life.',
  'Seeing the pattern is useful. Knowing what to do next is where Alignment OS begins.',
  'Get started',
]);

function pickPlatform(cms) {
  const copy = pageCopy(cms, PLATFORM_DEFAULTS);
  const out = { ...copy };
  for (const key of Object.keys(PLATFORM_DEFAULTS)) {
    if (STALE_PLATFORM.has(String(out[key] || '').trim())) {
      out[key] = PLATFORM_DEFAULTS[key];
    }
  }
  return out;
}

function DevicesPreview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
      <div className="rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surface shadow-apple px-5 py-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/65">My Plan</p>
        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-alignment-primary">This season</p>
        <ul className="mt-3 space-y-2.5 text-sm text-alignment-accent">
          <li className="flex gap-2">
            <span className="text-alignment-primary" aria-hidden>
              ✓
            </span>
            Grow in attentiveness
          </li>
          <li className="flex gap-2 text-alignment-accent/70">
            <span aria-hidden>○</span>
            Simplify my space
          </li>
          <li className="flex gap-2 text-alignment-accent/70">
            <span aria-hidden>○</span>
            Be present with my family
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surface shadow-apple px-5 py-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/65">Daily</p>
        <p className="mt-2 text-xs text-alignment-accent/60">Tue, Sep 24</p>
        <div className="mt-3 flex gap-3 text-[11px] uppercase tracking-[0.14em] text-alignment-accent/55">
          <span>Morning</span>
          <span className="text-alignment-primary font-medium">Today</span>
          <span>Evening</span>
        </div>
        <ul className="mt-4 space-y-2.5 text-sm text-alignment-accent">
          <li className="flex gap-2 text-alignment-accent/70">
            <span aria-hidden>○</span>
            Be still and begin the day
          </li>
          <li className="flex gap-2 text-alignment-accent/70">
            <span aria-hidden>○</span>
            Set your intention
          </li>
          <li className="flex gap-2">
            <span className="text-alignment-primary" aria-hidden>
              ✓
            </span>
            Choose one important step
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surface shadow-apple px-5 py-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/65">Review</p>
        <p className="mt-2 text-xs text-alignment-accent/60">This week</p>
        <ol className="mt-4 space-y-3 text-sm text-alignment-accent/90">
          <li>What went well?</li>
          <li>What was hard?</li>
          <li>What matters now?</li>
        </ol>
      </div>
    </div>
  );
}

export default function PlatformPage() {
  usePageTitle('Platform — Alignment OS');
  const copy = pickPlatform(useSitePage('/platform'));

  return (
    <div className={type.page}>
      <a href="#platform-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="platform-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        {/* Hero */}
        <section className="relative w-full overflow-hidden border-b border-alignment-accent/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-[32rem_minmax(0,1fr)] xl:grid-cols-[36rem_minmax(0,1fr)] lg:min-h-[min(70vh,38rem)]">
            <div className="relative z-10 flex flex-col justify-center bg-alignment-page px-5 sm:px-8 lg:px-10 xl:px-12 py-14 sm:py-16 lg:py-20 order-2 lg:order-1">
              <div className="max-w-sm">
                <p className={type.kicker}>{copy.eyebrow}</p>
                <h1 className={`mt-5 ${type.h1} text-balance`}>{copy.headline}</h1>
                <p className="mt-5 font-display text-xl sm:text-2xl font-medium text-alignment-primary leading-snug">
                  {copy.subhead}
                </p>
                <CmsCta href={copy.ctaHref} className={`${pillPrimary} mt-8`}>
                  {copy.ctaLabel} <span aria-hidden>→</span>
                </CmsCta>
                <p className="mt-4 text-sm text-alignment-accent/70">Free · 12 minutes · No account</p>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 min-h-[20rem] sm:min-h-[26rem] lg:min-h-full min-w-0 overflow-hidden bg-alignment-surfaceSoft">
              <img
                src="/images/platform/hero.jpg"
                alt="Alignment OS on laptop and phone — today’s focus, practice, and alignment score."
                className="absolute inset-0 h-full w-full object-cover object-[58%_42%]"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        {/* One life. Six areas. */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="max-w-xl mx-auto text-center">
              <p className={type.kicker}>One life. Six areas</p>
              <h2 className={`mt-4 ${type.h2}`}>One life. Six areas.</h2>
            </div>

            <ul className="mt-12 sm:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
              {DOMAIN_ORDER.map((key) => {
                const d = DOMAIN_BLURBS[key];
                return (
                  <li key={key} className="flex flex-col items-center text-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center text-alignment-accent">
                      <DomainPillarIcon pillar={key} className="h-8 w-8" />
                    </span>
                    <span className="font-display text-lg font-medium text-alignment-accent">{d.label}</span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-alignment-accent/60">
                      {d.tag}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-12 sm:mt-14 flex justify-center">
              <Link to="/assessment" className={pillOutline}>
                See Your Map <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* How it works — See. Choose. Live. */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="max-w-xl">
              <p className={type.kicker}>How it works</p>
              <h2 className={`mt-4 ${type.h2}`}>See. Choose. Live.</h2>
            </div>

            <ol className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {FLOW_STEPS.map((step, idx) => (
                <li key={step.n} className="relative">
                  {idx < FLOW_STEPS.length - 1 && (
                    <span
                      className="pointer-events-none absolute top-5 left-[3.25rem] right-0 hidden md:block h-px bg-alignment-accent/15"
                      aria-hidden
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-alignment-accent/20 text-sm font-medium tabular-nums text-alignment-accent bg-alignment-page">
                      {step.n}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-alignment-primary">
                      {step.title}
                    </span>
                  </div>
                  <p className={`mt-4 ${type.body} max-w-xs`}>{step.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 sm:mt-14">
              <DevicesPreview />
            </div>
          </div>
        </section>

        {/* Close */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[min(52vh,28rem)]">
            <div className="relative min-h-[16rem] sm:min-h-[20rem] lg:min-h-full overflow-hidden bg-alignment-surfaceSoft">
              <img
                src="/images/planner/paper-lifestyle.png"
                alt="Alignment OS planner on a wooden table."
                className="absolute inset-0 h-full w-full object-cover object-center"
                decoding="async"
              />
            </div>
            <div className="flex flex-col justify-center px-5 sm:px-8 lg:px-12 xl:px-16 py-14 sm:py-16 lg:py-20 bg-alignment-page">
              <div className="max-w-md">
                <h2 className={`${type.h2} text-balance`}>Your life belongs outside the app.</h2>
                <p className={`mt-5 ${type.body}`}>Get clear. Make the change. Then close it.</p>
                <CmsCta href={copy.ctaHref} className={`${pillPrimary} mt-8`}>
                  {copy.ctaLabel} <span aria-hidden>→</span>
                </CmsCta>
                <p className="mt-4 text-sm text-alignment-accent/70">Free · 12 minutes · No account</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
