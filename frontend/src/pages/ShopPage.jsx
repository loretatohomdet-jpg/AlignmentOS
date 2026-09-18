import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import CommerceCta from '../components/CommerceCta';
import BookCover from '../components/BookCover';
import { SitePageFooter } from '../components/HomeMarketingChrome';
import {
  companionProducts,
  plannerImages,
  plannerProduct,
  trackCommerce,
} from '../config/commerce';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';

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
        <section className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-10">
          <p className={type.kicker}>Tools</p>
          <h1 className={`mt-6 ${type.h1} text-balance max-w-xl`}>Practical tools for real life.</h1>
          <p className={`mt-6 ${type.body} max-w-xl`}>
            Three companions for paper and screen — Reset, Clarity, and the Quarterly Review — beside the Life of
            Purpose Planner.
          </p>
        </section>

        <section
          className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-12"
          aria-labelledby="shop-companions-heading"
        >
          <p className={type.kicker}>Paper & digital</p>
          <h2 id="shop-companions-heading" className={`mt-4 ${type.h2} max-w-xl text-balance`}>
            The three companions.
          </h2>
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {companionProducts.map((product) => (
              <li key={product.sku}>
                <Link to={product.path} className="group block">
                  <BookCover
                    src={product.image}
                    alt={product.imageAlt}
                    className="rounded-2xl transition-opacity group-hover:opacity-90"
                  />
                  <p className="mt-4 text-sm font-medium text-alignment-accent">{product.title}</p>
                  <p className="mt-1 font-display italic text-alignment-primary">{product.tagline}</p>
                  <p className={`mt-2 ${type.muted}`}>{product.priceLabel}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-24"
          aria-labelledby="shop-planner-heading"
        >
          <p className={type.kicker}>Planner</p>
          <h2 id="shop-planner-heading" className={`mt-4 ${type.h2} max-w-xl text-balance`}>
            {plannerProduct.title}
          </h2>
          <figure className="mt-8 overflow-hidden rounded-2xl bg-alignment-foundation max-w-3xl">
            <img
              src={plannerImages.paperLifestyle}
              alt={plannerProduct.imageAlt}
              className="w-full aspect-[4/5] sm:aspect-[4/3] object-cover object-[center_46%]"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <p className={`mt-6 ${type.body} max-w-xl`}>{plannerProduct.body}</p>
          <p className={`mt-3 ${type.muted}`}>From $27</p>
          <CommerceCta
            to="/planner"
            event="planner_shop_click"
            sku={plannerProduct.sku}
            className="mt-8 inline-flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent border-b border-alignment-accent/25 pb-1 hover:border-alignment-accent"
          >
            Shop the planner <span aria-hidden className="ml-1">
              →
            </span>
          </CommerceCta>

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
                I need a fresh start.{' '}
                <Link to="/reset" className="underline underline-offset-2 hover:text-alignment-accent">
                  Begin with Reset →
                </Link>
              </li>
              <li>
                I need to see what matters now.{' '}
                <Link to="/shop/alignment-clarity" className="underline underline-offset-2 hover:text-alignment-accent">
                  Start with Clarity →
                </Link>
              </li>
              <li>
                The season has moved.{' '}
                <Link to="/shop/quarterly-review" className="underline underline-offset-2 hover:text-alignment-accent">
                  Open the Quarterly Review →
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
