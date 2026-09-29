import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { pageWidth, pillGhost, pillPrimary, SitePageFooter, CmsCta } from '../components/HomeMarketingChrome';
import { monicaStoryUrl } from '../config/externalLinks';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { pageCopy, useSitePage } from '../hooks/useSiteContent';

const ABOUT_DEFAULTS = {
  eyebrow: 'About Alignment OS',
  headline: 'Why Alignment OS exists.',
  subhead:
    'Knowing what matters and living like it are not always the same thing. Alignment OS was created to help make what matters visible again — and to support the ordinary work of living it.',
  ctaLabel: 'Take the Assessment',
  ctaHref: '/assessment',
};

const STALE_ABOUT = new Set([
  'About',
  'Built for real life.',
  'Knowing what matters and living like it are not always the same thing.',
]);

const BELIEFS = [
  {
    title: 'The whole person',
    body: 'A Catholic understanding of the human person — dignity, freedom, and the call to become who you are.',
  },
  {
    title: 'Inherent dignity',
    body: 'You are more than your productivity. Your life has worth beyond what you achieve.',
  },
  {
    title: 'True freedom',
    body: 'Freedom is not endless option. It is the capacity to choose what is good and stay with it.',
  },
  {
    title: 'Habits shape a life',
    body: 'What you repeatedly do forms who you become. Attention, practice, and review matter.',
  },
  {
    title: 'One life, many parts',
    body: 'Identity, purpose, mindset, habits, environment, and follow-through belong together.',
  },
  {
    title: 'Lived in community',
    body: 'Truth, virtue, and relationship are not private projects. A fuller life is shared.',
  },
];

function pickAbout(cms) {
  const copy = pageCopy(cms, ABOUT_DEFAULTS);
  const out = { ...copy };
  for (const key of Object.keys(ABOUT_DEFAULTS)) {
    if (STALE_ABOUT.has(String(out[key] || '').trim())) {
      out[key] = ABOUT_DEFAULTS[key];
    }
  }
  return out;
}

export default function AboutPage() {
  usePageTitle('About — Alignment OS');
  const copy = pickAbout(useSitePage('/about'));

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
                  Clarity today. A more human tomorrow.
                </p>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 min-h-[18rem] sm:min-h-[24rem] lg:min-h-full min-w-0 bg-[#FBFAF8]">
              <img
                src="/images/about/hero.jpg"
                alt="A quiet room with a woven chair by the window, looking out over green hills — book, mug, and olive plant on the table."
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
                <h2 className={type.h2}>The problem</h2>
                <div className="mt-4 h-px w-16 bg-alignment-accent/20" aria-hidden />
                <div className={`mt-6 space-y-5 ${type.body}`}>
                  <p>
                    Most of us do not lack information. We live inside competing responsibilities, changing seasons,
                    limited time, habits, relationships, environments, and expectations.
                  </p>
                  <p>Eventually, what matters can become difficult to see.</p>
                  <p>Alignment OS was created to help make it visible again.</p>
                </div>
              </div>
              <aside className="lg:pt-2">
                <p className="font-display text-xl sm:text-2xl font-medium text-alignment-accent leading-snug text-balance">
                  Same human questions. A brighter way forward.
                </p>
                <div className="mt-5 h-px w-12 bg-alignment-accent/20" aria-hidden />
              </aside>
            </div>
          </div>
        </section>

        {/* Beliefs */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <h2 className={`${type.h2} max-w-xl text-balance`}>The view of the person behind the work</h2>
            <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {BELIEFS.map((belief) => (
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
            <p className={`${type.quote} max-w-2xl mx-auto`}>“Your life belongs outside the app.”</p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              <div className="max-w-md">
                <h2 className={type.h2}>Open to anyone.</h2>
                <div className="mt-4 h-px w-16 bg-alignment-accent/20" aria-hidden />
                <p className={`mt-6 ${type.body}`}>
                  You do not need a perfect week, a new identity, or another system to manage. Alignment OS is for
                  people who want to see clearly, choose carefully, and live what matters — whatever your season.
                </p>
              </div>
              <div className="max-w-md md:border-l md:border-alignment-accent/[0.08] md:pl-12">
                <h2 className={type.h2}>Technology should serve the person.</h2>
                <div className="mt-4 h-px w-16 bg-alignment-accent/20" aria-hidden />
                <p className={`mt-6 ${type.body}`}>
                  We don’t think you need to optimize everything. Your life is not a performance dashboard. Technology
                  should support attention, formation, and ordinary faithfulness — not compete with them.
                </p>
                <p className="mt-8 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent/60">
                  Tools for a fuller life. Not a longer scroll.
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
                <p className="font-display text-lg italic text-alignment-primary/90">Ordinary life changes everything.</p>
                <h2 className={`mt-6 ${type.h2}`}>Built from ordinary life.</h2>
                <div className="mt-4 h-px w-16 bg-alignment-accent/20" aria-hidden />
                <div className={`mt-6 space-y-5 ${type.body}`}>
                  <p>
                    Alignment OS grew from work around identity, formation, purpose, habits, and the ordinary structures
                    that shape a life.
                  </p>
                  <p>
                    It also grew from something practical: trying to make the different parts of life work together
                    without reducing life to productivity. The planner came first. Then the questions became larger.
                  </p>
                  <p>Alignment OS is what grew from them.</p>
                  <p className="font-medium text-alignment-accent">— Monica Anyango</p>
                </div>
                <a
                  href={monicaStoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${pillGhost} mt-8`}
                >
                  Read Monica’s story <span aria-hidden>→</span>
                </a>
              </div>
              <aside className="lg:pt-8">
                <p className="font-display text-xl sm:text-2xl font-medium text-alignment-accent leading-snug text-balance">
                  Different experiences. A more whole life.
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
            <h2 className={`${type.h2} text-balance`}>Start where you are.</h2>
            <p className={`mt-4 ${type.body} max-w-md mx-auto`}>Take the free Alignment Assessment.</p>
            <CmsCta href={copy.ctaHref} className={`${pillPrimary} mt-8`}>
              {copy.ctaLabel} <span aria-hidden>→</span>
            </CmsCta>
            <p className="mt-4 text-sm text-alignment-accent/70">Free · 12 minutes · No account</p>
            <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/55">
              A more aligned you. A brighter world.
            </p>
            <div className="mt-8">
              <Link
                to="/how-it-works"
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-alignment-accent/70 border-b border-alignment-accent/20 pb-1 hover:text-alignment-accent hover:border-alignment-accent"
              >
                See how it works <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
