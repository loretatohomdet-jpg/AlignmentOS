import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { pageWidth, pillGhost, pillPrimary, SitePageFooter, CmsCta } from '../components/HomeMarketingChrome';
import { monicaStoryUrl } from '../config/externalLinks';
import { ABOUT_SECTION_DEFAULTS } from '../config/pageSections';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { marketingPageCopy, useSitePage } from '../hooks/useSiteContent';

const ABOUT_DEFAULTS = {
  eyebrow: 'About Alignment OS',
  headline: 'Why Alignment OS exists.',
  subhead:
    'Knowing what matters and living like it are not always the same thing. Alignment OS was created to help make what matters visible again — and to support the ordinary work of living it.',
  ctaLabel: 'Take the Assessment',
  ctaHref: '/assessment',
  ...ABOUT_SECTION_DEFAULTS,
};

const STALE_ABOUT = new Set([
  'About',
  'Built for real life.',
  'Knowing what matters and living like it are not always the same thing.',
]);

function pickAbout(cms) {
  const copy = marketingPageCopy('/about', cms, ABOUT_DEFAULTS);
  const out = { ...copy };
  for (const key of Object.keys(ABOUT_DEFAULTS)) {
    if (STALE_ABOUT.has(String(out[key] || '').trim())) {
      out[key] = ABOUT_DEFAULTS[key];
    }
  }
  return out;
}

function beliefItems(copy) {
  return [1, 2, 3, 4, 5, 6].map((n) => ({
    title: copy[`belief${n}Title`],
    body: copy[`belief${n}Body`],
  }));
}

export default function AboutPage() {
  usePageTitle('About — Alignment OS');
  const copy = pickAbout(useSitePage('/about'));
  const beliefs = beliefItems(copy);

  return (
    <div className={type.page}>
      <a href="#about-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="about-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        {/* Hero — copy left, lifestyle photo on matching cream (no wash overlays) */}
        <section className="relative w-full overflow-hidden bg-[#FBFAF8]">
          <div className="grid grid-cols-1 lg:grid-cols-[32rem_minmax(0,1fr)] xl:grid-cols-[36rem_minmax(0,1fr)] lg:min-h-[min(72vh,40rem)]">
            <div className="relative z-10 flex flex-col justify-center px-5 sm:px-8 lg:px-10 xl:px-12 py-14 sm:py-16 lg:py-20 order-2 lg:order-1 bg-[#FBFAF8]">
              <div className="max-w-md">
                <p className={type.kicker}>{copy.eyebrow}</p>
                <h1 className={`mt-5 ${type.h1} text-balance`}>{copy.headline}</h1>
                <p className={`mt-6 ${type.body}`}>{copy.subhead}</p>
                <p className="mt-8 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent/60">
                  {copy.heroAccent}
                </p>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 min-h-[18rem] sm:min-h-[24rem] lg:min-h-full min-w-0 bg-[#FBFAF8]">
              <img
                src={copy.heroImage}
                alt={copy.heroImageAlt}
                className="absolute inset-0 h-full w-full object-cover object-[55%_45%]"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        {/* The problem */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] gap-10 lg:gap-16 lg:items-start">
              <div className="max-w-xl">
                <h2 className={type.h2}>{copy.problemHeading}</h2>
                <div className="mt-4 h-px w-16 bg-alignment-accent/20" aria-hidden />
                <div className={`mt-6 space-y-5 ${type.body}`}>
                  <p>{copy.problemBody1}</p>
                  <p>{copy.problemBody2}</p>
                  <p>{copy.problemBody3}</p>
                </div>
              </div>
              <aside className="lg:pt-2">
                <p className="font-display text-xl sm:text-2xl font-medium text-alignment-accent leading-snug text-balance">
                  {copy.problemAside}
                </p>
                <div className="mt-5 h-px w-12 bg-alignment-accent/20" aria-hidden />
              </aside>
            </div>
          </div>
        </section>

        {/* Beliefs */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <h2 className={`${type.h2} max-w-xl text-balance`}>{copy.beliefsHeading}</h2>
            <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {beliefs.map((belief) => (
                <li key={belief.title} className="max-w-sm">
                  <p className="font-display text-lg font-medium text-alignment-accent">{belief.title}</p>
                  <p className={`mt-3 ${type.body}`}>{belief.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Quote band */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-foundation">
          <div className={`${pageWidth} py-14 sm:py-16 text-center`}>
            <p className={`${type.quote} max-w-2xl mx-auto`}>“{copy.quote}”</p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              <div className="max-w-md">
                <h2 className={type.h2}>{copy.openHeading}</h2>
                <div className="mt-4 h-px w-16 bg-alignment-accent/20" aria-hidden />
                <p className={`mt-6 ${type.body}`}>{copy.openBody}</p>
              </div>
              <div className="max-w-md md:border-l md:border-alignment-accent/[0.08] md:pl-12">
                <h2 className={type.h2}>{copy.techHeading}</h2>
                <div className="mt-4 h-px w-16 bg-alignment-accent/20" aria-hidden />
                <p className={`mt-6 ${type.body}`}>{copy.techBody}</p>
                <p className="mt-8 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent/60">
                  {copy.techAccent}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Built from ordinary life */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] gap-10 lg:gap-16 lg:items-start">
              <div className="max-w-xl">
                <p className="font-display text-lg italic text-alignment-primary/90">{copy.storyKicker}</p>
                <h2 className={`mt-6 ${type.h2}`}>{copy.storyHeading}</h2>
                <div className="mt-4 h-px w-16 bg-alignment-accent/20" aria-hidden />
                <div className={`mt-6 space-y-5 ${type.body}`}>
                  <p>{copy.storyBody1}</p>
                  <p>{copy.storyBody2}</p>
                  <p>{copy.storyBody3}</p>
                  <p className="font-medium text-alignment-accent">{copy.storySignoff}</p>
                </div>
                <a
                  href={monicaStoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${pillGhost} mt-8`}
                >
                  {copy.storyCta} <span aria-hidden>→</span>
                </a>
              </div>
              <aside className="lg:pt-8">
                <p className="font-display text-xl sm:text-2xl font-medium text-alignment-accent leading-snug text-balance">
                  {copy.storyAside}
                </p>
                <div className="mt-5 h-px w-12 bg-alignment-accent/20" aria-hidden />
              </aside>
            </div>
          </div>
        </section>

        {/* Close CTA */}
        <section className="relative w-full overflow-hidden border-t border-alignment-accent/[0.06]">
          <div className="absolute inset-0 bg-alignment-primary/[0.06]" aria-hidden />
          <div className={`relative ${pageWidth} py-16 sm:py-24 text-center`}>
            <h2 className={`${type.h2} text-balance`}>{copy.closeHeading}</h2>
            <p className={`mt-4 ${type.body} max-w-md mx-auto`}>{copy.closeBody}</p>
            <CmsCta href={copy.ctaHref} className={`${pillPrimary} mt-8`}>
              {copy.ctaLabel} <span aria-hidden>→</span>
            </CmsCta>
            <p className="mt-4 text-sm text-alignment-accent/70">{copy.closeMeta}</p>
            <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/55">
              {copy.closeAccent}
            </p>
            <div className="mt-8">
              <Link
                to="/how-it-works"
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-alignment-accent/70 border-b border-alignment-accent/20 pb-1 hover:text-alignment-accent hover:border-alignment-accent"
              >
                {copy.closeSecondary} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
