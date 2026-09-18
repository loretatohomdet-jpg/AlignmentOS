import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import CommerceCta from '../components/CommerceCta';
import { SitePageFooter } from '../components/HomeMarketingChrome';
import { shopToolCards, trackCommerce } from '../config/commerce';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { useEffect } from 'react';

export default function ShopPage() {
  usePageTitle('Tools — Alignment OS');

  useEffect(() => {
    trackCommerce('shop_all_click', { sku: 'shop' });
  }, []);

  return (
    <div className={type.page}>
      <a href="#shop-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="shop-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <section className="max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 pt-12 sm:pt-16 pb-10">
          <p className={type.kicker}>Tools</p>
          <h1 className={`mt-6 ${type.h1} text-balance max-w-xl`}>Practical tools for real life.</h1>
          <p className={`mt-6 ${type.body} max-w-xl`}>
            Use them when you need to step back, get clear, or bring a little more order to what matters now.
          </p>
        </section>

        <section className="max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 pb-16 sm:pb-24">
          <ul className="grid grid-cols-1 gap-4">
            {shopToolCards.map((product) => (
              <li
                key={product.sku}
                className="flex flex-col rounded-2xl border border-alignment-accent/[0.1] bg-alignment-surface p-6 sm:p-8"
              >
                <p className={type.kicker}>{product.kicker}</p>
                <h2 className={`mt-4 ${type.h3}`}>{product.title}</h2>
                <p className="mt-2 font-display italic text-alignment-primary">{product.tagline}</p>
                <p className={`mt-3 ${type.body} flex-1`}>{product.body}</p>
                <p className={`mt-4 ${type.muted}`}>{product.priceLabel}</p>
                <CommerceCta
                  to={product.path}
                  event={product.event}
                  sku={product.sku}
                  className="mt-8 inline-flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent border-b border-alignment-accent/25 pb-1 hover:border-alignment-accent"
                >
                  {product.cta} <span aria-hidden className="ml-1">→</span>
                </CommerceCta>
              </li>
            ))}
          </ul>

          <div className="mt-16 max-w-xl">
            <p className={type.kicker}>Not sure where to begin?</p>
            <ul className={`mt-6 space-y-4 ${type.body}`}>
              <li>
                I want to understand where I am.{' '}
                <Link to="/assessment" className="underline underline-offset-2 hover:text-alignment-accent">
                  Take the free Alignment Assessment →
                </Link>
              </li>
              <li>
                I need clarity about what matters now.{' '}
                <Link to="/shop/alignment-clarity" className="underline underline-offset-2 hover:text-alignment-accent">
                  Start with Alignment Clarity →
                </Link>
              </li>
              <li>
                I want help carrying priorities into my day.{' '}
                <Link to="/planner" className="underline underline-offset-2 hover:text-alignment-accent">
                  Choose the Life of Purpose Planner →
                </Link>
              </li>
              <li>
                I want an ongoing system.{' '}
                <Link to="/platform" className="underline underline-offset-2 hover:text-alignment-accent">
                  Alignment OS Early Access →
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
