import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import CommerceCta from '../components/CommerceCta';
import BookCover from '../components/BookCover';
import { SitePageFooter, pillGhost, pillPrimary } from '../components/HomeMarketingChrome';
import {
  alignmentTools,
  formatUsd,
  plannerEditions,
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
  const plannerShelf = ['planner-heirloom', 'planner-standard', 'planner-digital']
    .map((sku) => plannerEditions.find((edition) => edition.sku === sku))
    .filter(Boolean)
    .map((edition) => mergeProduct(edition, offers))
    .filter((edition) => !edition.hidden);

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
              'The Life of Purpose Planner in three editions — sleeved, paperback, and digital — plus the digital Alignment Tools in three parts: Clarity, Daily, and the Quarterly Review.'}
          </p>
        </section>

        <section
          className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16"
          aria-labelledby="shop-planner-heading"
        >
          <p className={type.kicker}>The planner</p>
          <h2 id="shop-planner-heading" className={`mt-4 ${type.h2} max-w-xl text-balance`}>
            {planner.title}
          </h2>
          <p className={`mt-4 ${type.body} max-w-xl`}>
            Choose the sleeved edition, the paperback, or the digital download. Each is the same planner, held a
            different way.
          </p>
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {plannerShelf.map((edition) => (
              <li
                key={edition.sku}
                className="flex flex-col overflow-hidden rounded-2xl border border-alignment-accent/[0.1] bg-alignment-surface"
              >
                <img
                  src={edition.image}
                  alt={edition.imageAlt}
                  className={edition.imageClass}
                  loading="lazy"
                  decoding="async"
                />
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  {edition.kicker ? <p className={type.kicker}>{edition.kicker}</p> : null}
                  <h3 className={`${edition.kicker ? 'mt-3' : ''} ${type.h3}`}>{edition.name}</h3>
                  {edition.origin ? <p className={`mt-2 ${type.kicker}`}>{edition.origin}</p> : null}
                  <p className="mt-3 font-display text-3xl font-medium text-alignment-accent tabular-nums">
                    {formatUsd(edition.price)}
                  </p>
                  <p className={`mt-3 ${type.body} flex-1`}>{edition.note}</p>
                  <CommerceCta
                    href={edition.checkoutUrl}
                    event="checkout_started"
                    sku={edition.sku}
                    className={`${pillPrimary} mt-8`}
                  >
                    {edition.cta} <span aria-hidden className="ml-1">
                      →
                    </span>
                  </CommerceCta>
                </div>
              </li>
            ))}
          </ul>
          <CommerceCta
            to="/planner"
            event="planner_shop_click"
            sku={planner.sku}
            className="mt-8 inline-flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent border-b border-alignment-accent/25 pb-1 hover:border-alignment-accent"
          >
            See the planner in full <span aria-hidden className="ml-1">
              →
            </span>
          </CommerceCta>
        </section>

        <section
          className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16"
          aria-labelledby="shop-tools-heading"
        >
          <p className={type.kicker}>The digital product</p>
          <h2 id="shop-tools-heading" className={`mt-4 ${type.h2} max-w-xl text-balance`}>
            Three parts. One practice.
          </h2>
          <p className={`mt-4 ${type.body} max-w-xl`}>
            Clarity, Daily, and the Quarterly Review — the Alignment Tools, sold together or as the part you need now.
          </p>
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
