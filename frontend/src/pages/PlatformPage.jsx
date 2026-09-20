import SiteMarketingHeader from '../components/SiteMarketingHeader';
import AlignmentMapHex from '../components/AlignmentMapHex';
import { pageWidth, pillPrimary, SitePageFooter, CmsCta } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { pageCopy, useSitePage } from '../hooks/useSiteContent';

const stages = [
  {
    kicker: 'Your Alignment Map',
    title: 'See the bigger picture.',
    body: 'See how the six parts of your life are working together.',
  },
  {
    kicker: 'Your Personal Plan',
    title: 'Decide what matters now.',
    body: 'Choose what to protect, change, release, or leave for later.',
  },
  {
    kicker: 'Habit Engine',
    title: 'Not more habits. The right support for this season.',
    body: 'Sometimes the answer is a habit. Sometimes it is a boundary, a different environment, or a clearer priority.',
  },
  {
    kicker: 'Weekly Review',
    title: 'Step back before another week begins.',
    body: 'Notice what helped, what changed, and what needs your attention next.',
  },
];

export default function PlatformPage() {
  usePageTitle('Platform — Alignment OS');
  const copy = pageCopy(useSitePage('/platform'), {
    eyebrow: 'Platform',
    headline: 'From insight to everyday life.',
    subhead: 'Seeing the pattern is useful. Knowing what to do next is where Alignment OS begins.',
    ctaLabel: 'Get started',
    ctaHref: '/assessment',
  });

  return (
    <div className={type.page}>
      <a href="#platform-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="platform-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <section>
          <div className={`${pageWidth} pt-12 sm:pt-16 pb-10 sm:pb-14`}>
            <div className="max-w-xl">
              <p className={type.kicker}>{copy.eyebrow}</p>
              <h1 className={`mt-6 ${type.h1} text-balance`}>{copy.headline}</h1>
              <p className={`mt-6 ${type.body}`}>{copy.subhead}</p>
            </div>
            <figure className="mt-12 sm:mt-16 max-w-2xl mx-auto">
              <AlignmentMapHex className="w-full h-auto text-alignment-accent" />
            </figure>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {stages.map((stage) => (
                <li key={stage.kicker} className="max-w-md">
                  <p className={type.kicker}>{stage.kicker}</p>
                  <h2 className={`mt-4 ${type.h2}`}>{stage.title}</h2>
                  <p className={`mt-4 ${type.body}`}>{stage.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-24`}>
            <div className="max-w-xl">
              <p className={type.kicker}>Assessment. Map. Plan. Practice. Review.</p>
              <h2 className={`mt-6 ${type.h2} text-balance`}>
                Designed to help you spend less time managing a system and more time living what matters.
              </h2>
              <CmsCta href={copy.ctaHref} className={`${pillPrimary} mt-10`}>
                {copy.ctaLabel} <span aria-hidden className="ml-1">
                  →
                </span>
              </CmsCta>
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
