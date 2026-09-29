import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import DomainPillarIcon from '../components/DomainPillarIcon';
import { pageWidth, pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import { DOMAIN_ORDER, DOMAIN_LABELS } from '../constants/domains';
import { usePageTitle } from '../hooks/usePageTitle';
import { marketingPageCopy, useSitePage } from '../hooks/useSiteContent';
import { HOW_IT_WORKS_SECTION_DEFAULTS } from '../config/pageSections';
import { resolveCmsImageUrl } from '../config/cmsMedia';

const DEMO_SCORES = {
  IDENTITY: 78,
  PURPOSE: 66,
  MINDSET: 58,
  HABITS: 71,
  ENVIRONMENT: 80,
  EXECUTION: 67,
};

function AlignmentMapCard({ className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surface shadow-apple px-5 py-6 sm:px-7 sm:py-7 ${className}`}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/65">Your Alignment Map</p>
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-8">
        <div className="relative mx-auto sm:mx-0 h-36 w-36 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(110,113,88,0.12)" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#6E7158"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${72 * 3.016} 301.6`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-3xl font-medium tabular-nums text-alignment-accent leading-none">72</span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.16em] text-alignment-accent/65">Alignment Score</span>
          </div>
        </div>
        <ul className="flex-1 space-y-2.5 min-w-0">
          {DOMAIN_ORDER.map((key) => (
            <li key={key} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 min-w-0 text-alignment-accent">
                <DomainPillarIcon pillar={key} className="h-4 w-4 shrink-0 text-alignment-accent/80" />
                <span className="truncate">{DOMAIN_LABELS[key]}</span>
              </span>
              <span className="tabular-nums text-alignment-accent/80 shrink-0">{DEMO_SCORES[key]}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 rounded-xl bg-alignment-primary/[0.08] px-4 py-3 text-sm text-alignment-accent/90 leading-relaxed">
        Your primary opportunity: <span className="font-medium text-alignment-accent">Mindset</span> — where attention
        begins.
      </p>
    </div>
  );
}

function PlanPreviewCard() {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surface shadow-apple px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/65">My Plan</p>
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-alignment-primary">This season</p>
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
      <div className="mt-4 sm:mt-0 sm:absolute sm:-right-2 sm:top-16 sm:w-[min(100%,16rem)] rounded-2xl border border-alignment-primary/25 bg-alignment-primary/[0.08] shadow-apple px-5 py-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-primary">Your focus</p>
        <p className="mt-3 font-display text-lg font-medium text-alignment-accent leading-snug">Grow in attentiveness.</p>
        <p className="mt-2 text-sm text-alignment-accent/90">A calmer, more present life.</p>
        <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.16em] text-alignment-accent/65">Next steps</p>
        <ul className="mt-2 space-y-1.5 text-sm text-alignment-accent/90">
          <li>Choose one daily practice</li>
          <li>Hold it on Daily</li>
          <li>Track what helps</li>
        </ul>
      </div>
    </div>
  );
}

function LivePreviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surface shadow-apple px-5 py-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/65">Daily</p>
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
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/65">Weekly Review</p>
        <ol className="mt-4 space-y-3 text-sm text-alignment-accent/90">
          <li>
            <span className="text-alignment-primary tabular-nums mr-2">1.</span>
            What is working well?
          </li>
          <li>
            <span className="text-alignment-primary tabular-nums mr-2">2.</span>
            Where did I feel most aligned?
          </li>
          <li>
            <span className="text-alignment-primary tabular-nums mr-2">3.</span>
            What felt harder than it should?
          </li>
          <li>
            <span className="text-alignment-primary tabular-nums mr-2">4.</span>
            What will I focus on next?
          </li>
        </ol>
      </div>
    </div>
  );
}

function StepMark({ n }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-alignment-accent/20 text-sm font-medium tabular-nums text-alignment-accent">
        {n}
      </span>
      <span className="h-px flex-1 max-w-[4rem] bg-alignment-accent/15" aria-hidden />
    </div>
  );
}

const HOW_IT_WORKS_DEFAULTS = {
  eyebrow: 'How it works',
  headline: 'Start where you are.',
  subhead: 'Take the Assessment.',
  body: 'Get a clear picture of what’s working, what’s getting in the way, and what deserves your attention now.',
  ctaLabel: 'Take the Assessment',
  ctaHref: '/assessment',
  ...HOW_IT_WORKS_SECTION_DEFAULTS,
};

const STALE_HOW_IT_WORKS = new Set([
  'See clearly. Start small.',
  'See what is off. Start one practice.',
  'You do not need to change everything at once.',
  'The assessment names the thin place. Alignment OS starts the practice and keeps the day on that thread.',
  'You need to see what matters now and make the changes that support it.',
  'Take the Alignment Assessment',
]);

function pickHowItWorks(cms) {
  const copy = marketingPageCopy('/how-it-works', cms, HOW_IT_WORKS_DEFAULTS);
  const out = { ...copy };
  for (const key of Object.keys(HOW_IT_WORKS_DEFAULTS)) {
    if (STALE_HOW_IT_WORKS.has(String(out[key] || '').trim())) {
      out[key] = HOW_IT_WORKS_DEFAULTS[key];
    }
  }
  return out;
}

export default function HowItWorksPage() {
  usePageTitle('How It Works — Alignment OS');
  const copy = pickHowItWorks(useSitePage('/how-it-works'));

  return (
    <div className={type.page}>
      <a href="#how-it-works-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="how-it-works-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        {/* Hero — copy left, product mockup on matching cream (no wash overlays) */}
        <section className="relative w-full overflow-hidden bg-[#FBFAF8]">
          <div className="grid grid-cols-1 lg:grid-cols-[32rem_minmax(0,1fr)] xl:grid-cols-[36rem_minmax(0,1fr)] lg:min-h-[min(70vh,38rem)]">
            <div className="relative z-10 flex flex-col justify-center px-5 sm:px-8 lg:px-10 xl:px-12 py-14 sm:py-16 lg:py-20 order-2 lg:order-1 bg-[#FBFAF8]">
              <div className="max-w-sm">
                <p className={type.kicker}>{copy.eyebrow}</p>
                <h1 className={`mt-5 ${type.h1} text-balance`}>{copy.headline}</h1>
                <p className={`mt-5 ${type.body}`}>{copy.body}</p>
                <Link to={copy.ctaHref} className={`${pillPrimary} mt-8`}>
                  {copy.ctaLabel} <span aria-hidden>→</span>
                </Link>
                <p className="mt-4 text-sm text-alignment-accent/70">{copy.heroMeta}</p>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 min-h-[20rem] sm:min-h-[26rem] lg:min-h-full min-w-0 bg-[#FBFAF8]">
              <img
                src={resolveCmsImageUrl(copy.heroImage)}
                alt={copy.heroImageAlt}
                className="absolute inset-0 h-full w-full object-cover object-[62%_45%]"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        {/* 01 SEE */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className={`${pageWidth} py-14 sm:py-20`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-start">
              <div className="max-w-md">
                <StepMark n="01" />
                <p className={`${type.kicker} mt-6`}>{copy.seeKicker}</p>
                <h2 className={`mt-4 ${type.h2}`}>{copy.seeHeading}</h2>
                <p className={`mt-4 ${type.body}`}>{copy.seeBody}</p>
                <ul className="mt-8 grid grid-cols-3 gap-4">
                  {DOMAIN_ORDER.map((key) => (
                    <li key={key} className="flex flex-col items-center text-center gap-2">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-alignment-accent/15 text-alignment-accent">
                        <DomainPillarIcon pillar={key} className="h-6 w-6" />
                      </span>
                      <span className="text-[11px] font-medium text-alignment-accent/85">{DOMAIN_LABELS[key]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <AlignmentMapCard />
            </div>
          </div>
        </section>

        {/* 02 CHOOSE */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-14 sm:py-20`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-start">
              <div className="max-w-md lg:order-1">
                <StepMark n="02" />
                <p className={`${type.kicker} mt-6`}>{copy.chooseKicker}</p>
                <h2 className={`mt-4 ${type.h2}`}>{copy.chooseHeading}</h2>
                <p className={`mt-4 ${type.body}`}>{copy.chooseBody}</p>
              </div>
              <div className="lg:order-2 min-h-[18rem] sm:min-h-[20rem]">
                <PlanPreviewCard />
              </div>
            </div>
          </div>
        </section>

        {/* 03 LIVE */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className={`${pageWidth} py-14 sm:py-20`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-start">
              <div className="max-w-md">
                <StepMark n="03" />
                <p className={`${type.kicker} mt-6`}>{copy.liveKicker}</p>
                <h2 className={`mt-4 ${type.h2}`}>{copy.liveHeading}</h2>
                <p className={`mt-4 ${type.body}`}>{copy.liveBody}</p>
              </div>
              <LivePreviewCards />
            </div>
          </div>
        </section>

        {/* Close */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-24`}>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              <div className="max-w-xl">
                <p className={type.kicker}>{copy.closeKicker}</p>
                <h2 className={`mt-4 ${type.h2} text-balance`}>{copy.closeHeading}</h2>
                <p className={`mt-4 ${type.body}`}>{copy.closeBody}</p>
              </div>
              <div className="shrink-0">
                <Link to={copy.ctaHref} className={pillPrimary}>
                  {copy.ctaLabel} <span aria-hidden>→</span>
                </Link>
                <p className="mt-4 text-sm text-alignment-accent/70">{copy.closeMeta}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
