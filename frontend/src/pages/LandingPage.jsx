import { Link } from 'react-router-dom';
import AgentFloatingButton from '../components/AgentFloatingButton';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import DomainPillarIcon from '../components/DomainPillarIcon';
import { pageWidth, pillPrimary, SitePageFooter, CmsCta } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import { DOMAIN_ORDER } from '../constants/domains';
import { homePageCopy, useSitePage } from '../hooks/useSiteContent';
import { usePageTitle } from '../hooks/usePageTitle';
import { resolveCmsImageUrl } from '../config/cmsMedia';

const DOMAIN_KEYS = {
  IDENTITY: { labelKey: 'domainIdentity', tagKey: 'domainIdentityTag' },
  PURPOSE: { labelKey: 'domainPurpose', tagKey: 'domainPurposeTag' },
  MINDSET: { labelKey: 'domainMindset', tagKey: 'domainMindsetTag' },
  HABITS: { labelKey: 'domainHabits', tagKey: 'domainHabitsTag' },
  ENVIRONMENT: { labelKey: 'domainEnvironment', tagKey: 'domainEnvironmentTag' },
  EXECUTION: { labelKey: 'domainExecution', tagKey: 'domainExecutionTag' },
};

function ProductPreviewCards() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mx-0 pb-28 sm:pb-10">
      <div className="rounded-2xl border border-white/80 bg-white/45 shadow-apple backdrop-blur-md px-5 py-5 sm:px-6 sm:pr-44">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/65">Daily</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-alignment-accent/55">
          <span>Morning</span>
          <span className="text-alignment-primary font-medium">Today</span>
          <span>Evening</span>
        </div>
        <ul className="mt-4 space-y-2.5 text-sm text-alignment-accent">
          <li className="flex gap-2 text-alignment-accent/70">
            <span aria-hidden>○</span>
            Be still and begin the day
          </li>
          <li className="flex gap-2">
            <span className="text-alignment-primary" aria-hidden>
              ✓
            </span>
            Choose one important step
          </li>
          <li className="flex gap-2 text-alignment-accent/70">
            <span aria-hidden>○</span>
            Be present with someone
          </li>
        </ul>
      </div>
      <div className="absolute left-8 right-0 bottom-0 sm:left-auto sm:w-[16.5rem] rounded-2xl bg-alignment-primary text-[#FBFAF8] shadow-apple-lg px-5 py-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#FBFAF8]/75">Your focus</p>
        <p className="mt-3 font-display text-lg font-medium leading-snug">Grow in attentiveness.</p>
        <p className="mt-2 text-sm text-[#FBFAF8]/85">One change. Practiced daily.</p>
        <div className="mt-4 h-1.5 rounded-full bg-white/25 overflow-hidden" aria-hidden>
          <div className="h-full w-[62%] rounded-full bg-[#FBFAF8]" />
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  usePageTitle('Alignment OS — A life is formed by what is repeated');
  const copy = homePageCopy(useSitePage('/'));

  const heroDomains = DOMAIN_ORDER.map((key) => ({
    key,
    label: copy[DOMAIN_KEYS[key].labelKey],
    tag: copy[DOMAIN_KEYS[key].tagKey],
    dot: key === 'PURPOSE' || key === 'HABITS' || key === 'EXECUTION' ? 'bg-alignment-surface/70' : 'bg-alignment-surface',
  }));

  const domainRow = (
    <ul className="flex shrink-0 items-center gap-x-10 sm:gap-x-14 md:gap-x-16 pr-10 sm:pr-14">
      {heroDomains.map(({ key, label, dot }) => (
        <li
          key={key}
          className="flex items-center gap-2 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] whitespace-nowrap"
        >
          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`${type.page} overflow-x-hidden`}>
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="main-content" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <section className="relative w-full overflow-hidden bg-[#FBFAF8]">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="relative z-10 flex flex-col justify-center px-5 sm:px-8 lg:pl-12 lg:pr-10 xl:pl-16 xl:pr-14 py-12 sm:py-16 lg:py-20 order-2 lg:order-1 bg-[#FBFAF8]">
              <div className="max-w-xl">
                <h1 className={`${type.h1} text-balance`}>{copy.headline}</h1>
                <p className={`mt-6 ${type.body} text-base sm:text-lg`}>{copy.subhead}</p>
                <CmsCta href={copy.ctaHref} className={`${pillPrimary} mt-8`}>
                  {copy.ctaLabel} <span aria-hidden>→</span>
                </CmsCta>
                <p className="mt-4 text-sm text-alignment-accent/70">{copy.body}</p>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 min-h-[18rem] sm:min-h-[24rem] lg:min-h-full overflow-hidden bg-[#FBFAF8]">
              <img
                src={resolveCmsImageUrl(copy.heroImage)}
                alt={copy.heroImageAlt}
                className="absolute inset-0 h-full w-full object-cover object-[center_42%] lg:[mask-image:linear-gradient(to_right,transparent_0%,#000_14%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_14%)]"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="max-w-xl">
                <h2 className={type.h2}>{copy.domainsHeading}</h2>
                {copy.domainsBody ? <p className={`mt-3 ${type.body}`}>{copy.domainsBody}</p> : null}
              </div>
              <Link
                to="/assessment"
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-alignment-accent/80 border-b border-alignment-accent/20 pb-1 hover:text-alignment-accent hover:border-alignment-accent shrink-0"
              >
                {copy.domainsCta} <span aria-hidden>→</span>
              </Link>
            </div>
            <ul className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-5">
              {heroDomains.map(({ key, label, tag }) => (
                <li key={key} className="flex flex-col items-center text-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center text-alignment-accent">
                    <DomainPillarIcon pillar={key} className="h-7 w-7" />
                  </span>
                  <span className="font-display text-base font-medium text-alignment-accent">{label}</span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-alignment-accent/60">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div
            className="relative w-full shrink-0 bg-alignment-primary text-white overflow-hidden"
            role="region"
            aria-label="Six alignment domains"
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-alignment-primary to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-alignment-primary to-transparent"
              aria-hidden
            />
            <div className="flex w-max motion-safe:animate-marquee-domains motion-reduce:animate-none py-3 sm:py-3.5 will-change-transform">
              {domainRow}
              <ul
                className="flex shrink-0 items-center gap-x-10 sm:gap-x-14 md:gap-x-16 pr-10 sm:pr-14"
                aria-hidden
              >
                {heroDomains.map(({ key, label, dot }) => (
                  <li
                    key={`dup-${key}`}
                    className="flex items-center gap-2 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] whitespace-nowrap"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-center">
              <div className="max-w-md">
                <h2 className={`${type.h2} text-balance`}>{copy.insightHeading}</h2>
                <div className={`mt-6 space-y-3 ${type.body}`}>
                  {[copy.insightLine1, copy.insightLine2, copy.insightLine3]
                    .filter((line) => String(line || '').trim())
                    .map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                </div>
                <CmsCta href="/platform" className={`${pillPrimary} mt-8`}>
                  {copy.insightCta} <span aria-hidden>→</span>
                </CmsCta>
              </div>
              <ProductPreviewCards />
            </div>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[min(48vh,26rem)]">
            <div className="relative min-h-[14rem] sm:min-h-[18rem] lg:min-h-full overflow-hidden bg-[#FBFAF8]">
              <img
                src={resolveCmsImageUrl(copy.outsideImage)}
                alt={copy.outsideImageAlt}
                className="absolute inset-0 h-full w-full object-cover object-[55%_45%]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex flex-col justify-center px-5 sm:px-8 lg:px-12 xl:px-16 py-14 sm:py-16 bg-alignment-page">
              <div className="max-w-md">
                <h2 className={`${type.h2} text-balance`}>{copy.outsideHeading}</h2>
                <p className={`mt-5 ${type.body}`}>{copy.outsideBody}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              <div className="max-w-xs">
                <h2 className={type.h2}>{copy.closeLeft}</h2>
              </div>
              <div className={`max-w-xs space-y-4 ${type.body} md:border-x md:border-alignment-accent/[0.08] md:px-8`}>
                <p>{copy.closeMid1}</p>
                <p>{copy.closeMid2}</p>
                <p>{copy.closeMid3}</p>
              </div>
              <div className="max-w-sm md:ml-auto">
                <h2 className={type.h2}>{copy.closeRightHeading}</h2>
                <p className={`mt-4 ${type.body}`}>{copy.closeRightBody}</p>
                <CmsCta href={copy.ctaHref} className={`${pillPrimary} mt-6`}>
                  {copy.closeCtaLabel || copy.ctaLabel} <span aria-hidden>→</span>
                </CmsCta>
                <p className="mt-4 text-sm text-alignment-accent/70">{copy.closeMeta}</p>
              </div>
            </div>
          </div>
        </section>

        <SitePageFooter />
        <AgentFloatingButton />
      </main>
    </div>
  );
}
