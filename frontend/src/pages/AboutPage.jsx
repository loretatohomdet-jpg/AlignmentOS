import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { pageWidth, pillGhost, pillPrimary, SitePageFooter, CmsCta } from '../components/HomeMarketingChrome';
import { monicaStoryUrl } from '../config/externalLinks';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { pageCopy, useSitePage } from '../hooks/useSiteContent';

export default function AboutPage() {
  usePageTitle('About — Alignment OS');
  const copy = pageCopy(useSitePage('/about'), {
    eyebrow: 'About',
    headline: 'Built for real life.',
    subhead: 'Knowing what matters and living like it are not always the same thing.',
    ctaLabel: 'Take the Assessment',
    ctaHref: '/assessment',
  });

  return (
    <div className={type.page}>
      <a href="#about-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="about-main" className="flex-1" tabIndex={-1}>
        <section>
          <div className={`${pageWidth} pt-12 sm:pt-16 pb-10 sm:pb-14`}>
            <div className="max-w-xl">
              <p className={type.kicker}>{copy.eyebrow}</p>
              <h1 className={`mt-6 ${type.h1}`}>{copy.headline}</h1>
              <div className={`mt-10 sm:mt-12 space-y-6 ${type.body}`}>
                <p>Alignment OS began with a simple problem:</p>
                <p className="font-display text-xl sm:text-2xl font-medium text-alignment-accent leading-snug">
                  {copy.subhead}
                </p>
                <p>Most of us do not lack information.</p>
                <p>
                  We live inside competing responsibilities, changing seasons, limited time, habits, relationships,
                  environments, and expectations.
                </p>
                <p>Eventually, what matters can become difficult to see.</p>
                <p>Alignment OS was created to help make it visible again.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="max-w-xl">
              <h2 className={type.h2}>We don’t think you need to optimize everything.</h2>
              <div className={`mt-8 space-y-6 ${type.body}`}>
                <p>Your life is not a performance dashboard.</p>
                <p>
                  Not every difficult season means something is wrong. Not every problem requires another habit. And not
                  everything important can be measured.
                </p>
                <p>
                  What matters is knowing what deserves your attention now—and being able to live accordingly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="max-w-xl">
              <h2 className={type.h2}>Human first.</h2>
              <div className={`mt-8 space-y-6 ${type.body}`}>
                <p>You are more than your productivity.</p>
                <p>
                  Your responsibilities matter. Your relationships matter. Your limits matter. What you repeatedly do
                  matters.
                </p>
                <p>And the life in front of you deserves your attention.</p>
                <p>Technology should support that life, not compete with it.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="max-w-xl">
              <p className={type.kicker}>Founder</p>
              <h2 className={`mt-4 ${type.h2}`}>Created by Monica Anyango</h2>
              <div className={`mt-8 space-y-6 ${type.body}`}>
                <p>
                  Alignment OS grew from my work around identity, formation, purpose, habits, work, and the ordinary
                  structures that shape a life.
                </p>
                <p>
                  It also grew from something practical: trying to make the different parts of my own life work together
                  without reducing life to productivity.
                </p>
                <p>The planner came first. Then the questions became larger.</p>
                <p>Alignment OS is what grew from them.</p>
              </div>
              <a
                href={monicaStoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${pillGhost} mt-10`}
              >
                Read Monica’s story <span aria-hidden className="ml-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} py-16 sm:pb-28`}>
            <div className="max-w-xl">
              <h2 className={type.h2}>See where your life holds.</h2>
              <CmsCta href={copy.ctaHref} className={`${pillPrimary} mt-8`}>
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
