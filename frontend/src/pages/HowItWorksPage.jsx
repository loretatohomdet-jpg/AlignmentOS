import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { pageWidth, pillPrimary, SitePageFooter, CmsCta } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { pageCopy, useSitePage } from '../hooks/useSiteContent';

const steps = [
  {
    n: '01',
    label: 'See',
    title: 'Start with the Alignment Assessment.',
    body: 'Look across the six parts of your life and notice what is working—and what is not.',
  },
  {
    n: '02',
    label: 'Understand',
    title: 'See what may be underneath the problem.',
    body: 'Sometimes the difficulty is not where it first appears. Look at the relationships between your priorities, habits, environment, mindset, and follow-through.',
  },
  {
    n: '03',
    label: 'Decide',
    title: 'Choose what matters now.',
    body: 'Not everything deserves equal attention. Decide what needs protecting, what needs changing, and what can become smaller for this season.',
  },
  {
    n: '04',
    label: 'Practice',
    title: 'Make the change livable.',
    body: 'Choose one or two habits, boundaries, rhythms, or changes that support what matters.',
  },
  {
    n: '05',
    label: 'Review',
    title: 'Notice what is actually helping.',
    body: 'Step back, see what is working, and adjust without starting over.',
  },
];

export default function HowItWorksPage() {
  usePageTitle('How It Works — Alignment OS');
  const copy = pageCopy(useSitePage('/how-it-works'), {
    eyebrow: 'How it works',
    headline: 'See clearly. Start small.',
    subhead: 'You do not need to change everything at once.',
    body: 'You need to see what matters now and make the changes that support it.',
    ctaLabel: 'Take the Alignment Assessment',
    ctaHref: '/assessment',
  });

  return (
    <div className={type.page}>
      <a href="#how-it-works-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="how-it-works-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <section>
          <div className={`${pageWidth} pt-12 sm:pt-16 pb-10 sm:pb-14`}>
            <div className="max-w-xl">
              <p className={type.kicker}>{copy.eyebrow}</p>
              <h1 className={`mt-6 ${type.h1} text-balance`}>{copy.headline}</h1>
              <div className={`mt-10 sm:mt-12 space-y-6 ${type.body}`}>
                <p>{copy.subhead}</p>
                <p>{copy.body}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} pb-10 sm:pb-14`}>
            <ol className="max-w-xl space-y-12 sm:space-y-14">
              {steps.map((step) => (
                <li key={step.n}>
                  <p className={type.kicker}>
                    {step.n} — {step.label}
                  </p>
                  <h2 className={`mt-4 ${type.h2}`}>{step.title}</h2>
                  <p className={`mt-4 ${type.body}`}>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-24`}>
            <div className="max-w-xl">
              <p className="font-display text-xl sm:text-2xl font-medium text-alignment-accent leading-snug">
                You don’t need a perfect system. You need one that helps you notice, decide, act, and adjust.
              </p>
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
