import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import CommerceCta from '../components/CommerceCta';
import BookCover from '../components/BookCover';
import { SitePageFooter, pillGhost, pillPrimary } from '../components/HomeMarketingChrome';
import {
  alignmentTools,
  formatUsd,
  plannerImages,
  plannerProduct,
  resetProduct,
  toolsCollection,
  trackCommerce,
} from '../config/commerce';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { mergeProduct, useShopCatalog, useSitePage } from '../hooks/useSiteContent';

export default function ShopPage() {
  usePageTitle('Tools — Alignment OS');
  const cms = useSitePage('/shop');
  const offers = useShopCatalog();
  const planner = mergeProduct(plannerProduct, offers);
  const reset = mergeProduct(resetProduct, offers);
  const tools = alignmentTools.map((item) => mergeProduct(item, offers)).filter((item) => !item.hidden);

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
          <p className={type.kicker}>{cms?.eyebrow || 'Shop'}</p>
          <h1 className={`mt-6 ${type.h1} text-balance max-w-xl`}>{cms?.headline || 'Practical tools for real life.'}</h1>
          <p className={`mt-6 ${type.body} max-w-xl`}>
            {cms?.body ||
              'The Life of Purpose Planner is the flagship paper product. Clarity, Daily, and the Quarterly Review are the focused Alignment Tools. Reset is a simple place to begin.'}
          </p>
        </section>

        <section
          className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16"
          aria-labelledby="shop-planner-heading"
        >
          <p className={type.kicker}>The signature planner</p>
          <h2 id="shop-planner-heading" className={`mt-4 ${type.h2} max-w-xl text-balance`}>
            {planner.title}
          </h2>
          <figure className="mt-8 overflow-hidden rounded-2xl bg-alignment-foundation max-w-3xl">
            <img
              src={plannerImages.paperLifestyle}
              alt={planner.imageAlt}
              className="w-full aspect-[4/5] sm:aspect-[4/3] object-cover object-[center_46%]"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <p className={`mt-6 ${type.body} max-w-xl`}>
            A thoughtfully designed planner for carrying what matters into the days and weeks of your actual life.
          </p>
          <p className={`mt-3 ${type.muted}`}>Priced separately from the Alignment Tools.</p>
          <CommerceCta
            to="/planner"
            event="planner_shop_click"
            sku={planner.sku}
            className="mt-8 inline-flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent border-b border-alignment-accent/25 pb-1 hover:border-alignment-accent"
          >
            Explore the Planner <span aria-hidden className="ml-1">
              →
            </span>
          </CommerceCta>
        </section>

        <section
          className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16"
          aria-labelledby="shop-tools-heading"
        >
          <p className={type.kicker}>The Alignment Tools</p>
          <h2 id="shop-tools-heading" className={`mt-4 ${type.h2} max-w-xl text-balance`}>
            Three tools. Three places to begin.
          </h2>
          <p className={`mt-4 ${type.body} max-w-xl`}>Focused guides for the moments you need them most.</p>
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {tools.map((product) => (
              <li key={product.sku}>
                <Link to={product.path} className="group block">
                  <BookCover
                    src={product.image}
                    alt={product.imageAlt}
                    title={product.title}
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
          className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16"
          aria-labelledby="shop-collection-heading"
        >
          <p className={type.kicker}>Together</p>
          <h2 id="shop-collection-heading" className={`mt-4 ${type.h2} max-w-xl text-balance`}>
            {toolsCollection.title}
          </h2>
          <p className="mt-3 font-display italic text-alignment-primary">{toolsCollection.tagline}</p>
          <p className={`mt-4 ${type.body} max-w-xl`}>{toolsCollection.body}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CommerceCta
              href={toolsCollection.digital.checkoutUrl}
              event="checkout_started"
              sku={toolsCollection.digital.sku}
              className={pillPrimary}
            >
              Digital Collection — {formatUsd(toolsCollection.digital.price)}
            </CommerceCta>
            <CommerceCta
              href={toolsCollection.print.checkoutUrl}
              event="checkout_started"
              sku={toolsCollection.print.sku}
              className={pillGhost}
            >
              Print Collection — {formatUsd(toolsCollection.print.price)}
            </CommerceCta>
          </div>
        </section>

        <section
          className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16"
          aria-labelledby="shop-reset-heading"
        >
          <p className={type.kicker}>Need a fresh start?</p>
          <h2 id="shop-reset-heading" className={`mt-4 ${type.h2}`}>
            {reset.title}
          </h2>
          <div className="mt-8 max-w-xs">
            <Link to={reset.path} className="group block">
              <BookCover
                src={reset.image}
                alt={reset.imageAlt}
                title={reset.title}
                className="rounded-2xl transition-opacity group-hover:opacity-90"
              />
            </Link>
          </div>
          <p className="mt-6 font-display italic text-xl text-alignment-primary">{reset.tagline}</p>
          <p className={`mt-4 ${type.body} max-w-xl`}>{reset.body}</p>
          <p className={`mt-3 ${type.muted}`}>{reset.priceLabel}</p>
          <CommerceCta
            to={reset.path}
            event="shop_all_click"
            sku={reset.sku}
            className={`${pillPrimary} mt-8`}
          >
            Begin with Reset <span aria-hidden className="ml-1">
              →
            </span>
          </CommerceCta>
        </section>

        <section className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-24">
          <p className={type.kicker}>Not sure where to begin?</p>
          <p className={`mt-4 ${type.body} max-w-xl`}>
            Take the free Alignment Assessment and we’ll help you identify the tool that fits your current season.
          </p>
          <Link
            to="/assessment"
            className="mt-8 inline-flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent border-b border-alignment-accent/25 pb-1 hover:border-alignment-accent"
          >
            Take the Assessment <span aria-hidden className="ml-1">
              →
            </span>
          </Link>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
