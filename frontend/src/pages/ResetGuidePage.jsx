import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import BookCover from '../components/BookCover';
import { pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import { companionProducts, resetProduct } from '../config/commerce';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';

export default function ResetGuidePage() {
  usePageTitle('Reset — Alignment OS');
  const others = companionProducts.filter((item) => item.sku !== resetProduct.sku);

  return (
    <div className={type.page}>
      <a href="#reset-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />
      <main id="reset-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <section className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-16 sm:pb-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start xl:gap-16">
            <BookCover
              src={resetProduct.image}
              alt={resetProduct.imageAlt}
              className="rounded-2xl max-w-xs mx-auto lg:mx-0 lg:max-w-none"
            />
            <div className="min-w-0">
              <p className={type.kicker}>{resetProduct.kicker}</p>
              <h1 className={`mt-6 ${type.h1} text-balance`}>{resetProduct.title}</h1>
              <p className="mt-6 font-display italic text-xl sm:text-2xl text-alignment-primary leading-snug">
                {resetProduct.tagline}
              </p>
              <p className={`mt-6 ${type.body} max-w-xl`}>
                A life is formed by what is repeated. This is not more motivation. It is a way to see the structure
                underneath the week — and to begin again without starting over.
              </p>
            </div>
          </div>

          <div className="mt-16 max-w-2xl">
            <h2 className={type.h2}>Six domains</h2>
            <p className={`mt-4 ${type.body}`}>
              Identity. Purpose. Mindset. Habits. Environment. Execution. Where one is thin, the others compensate. The
              diagnostic names the thin place.
            </p>

            <h2 className={`mt-14 ${type.h2}`}>The reset</h2>
            <ol className={`mt-4 space-y-4 ${type.body}`}>
              <li>
                <span className="font-medium text-alignment-accent">See.</span> Take the free diagnostic. Twelve
                minutes. Six domains. One score, one primary strain.
              </li>
              <li>
                <span className="font-medium text-alignment-accent">Hold the day.</span> Three rooms: morning before the
                phone, a midday pause, a close. Not a new personality. A repetition.
              </li>
              <li>
                <span className="font-medium text-alignment-accent">Review.</span> Once a week, look at what was
                repeated — not what was intended.
              </li>
            </ol>

            <Link to="/assessment" className={`${pillPrimary} mt-12`}>
              Begin the free diagnostic →
            </Link>
          </div>

          <div className="mt-20">
            <p className={type.kicker}>The other parts</p>
            <ul className="mt-6 grid grid-cols-2 gap-4 max-w-lg">
              {others.map((item) => (
                <li key={item.sku}>
                  <Link to={item.path} className="block group">
                    <BookCover
                      src={item.image}
                      alt={item.imageAlt}
                      className="rounded-2xl transition-opacity group-hover:opacity-90"
                    />
                    <p className="mt-3 text-sm font-medium text-alignment-accent">{item.title}</p>
                    <p className={`mt-1 ${type.muted}`}>{item.tagline}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className={`mt-10 ${type.body}`}>
              For the week itself, there is the{' '}
              <Link to="/planner" className="underline underline-offset-2 hover:text-alignment-accent">
                Life of Purpose Planner
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <SitePageFooter />
    </div>
  );
}
