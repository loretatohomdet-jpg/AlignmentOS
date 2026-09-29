import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import CommerceCta from '../components/CommerceCta';
import BookCover from '../components/BookCover';
import {
  pageWidth,
  pillPrimary,
  pillOutline,
  SitePageFooter,
} from '../components/HomeMarketingChrome';
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

const SHOP_DEFAULTS = {
  eyebrow: 'Shop',
  headline: 'Tools for what matters.',
  body: 'Simple tools for getting clear, choosing what matters, and carrying it into everyday life.',
};

const STALE_SHOP = new Set([
  'Practical tools for real life.',
  'The Life of Purpose Planner in three editions — sleeved, paperback, and digital — plus the digital Alignment Tools in three parts: Clarity, Daily, and the Quarterly Review.',
]);

function pickShop(cms) {
  const eyebrow = String(cms?.eyebrow || '').trim();
  const headline = String(cms?.headline || '').trim();
  const body = String(cms?.body || '').trim();
  return {
    eyebrow: !eyebrow || STALE_SHOP.has(eyebrow) ? SHOP_DEFAULTS.eyebrow : eyebrow,
    headline: !headline || STALE_SHOP.has(headline) ? SHOP_DEFAULTS.headline : headline,
    body: !body || STALE_SHOP.has(body) ? SHOP_DEFAULTS.body : body,
  };
}

export default function ShopPage() {
  usePageTitle('Shop — Alignment OS');
  const cms = useSitePage('/shop');
  const copy = pickShop(cms);
  const offers = useShopCatalog();
  const planner = mergeProduct(plannerProduct, offers);
  const reset = mergeProduct(resetProduct, offers);
  const tools = alignmentTools.map((item) => mergeProduct(item, offers)).filter((item) => !item.hidden);
  const shelf = [...tools, reset].filter((item) => !item.hidden);

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
        {/* Hero — copy left, product shot blended into page wash */}
        <section className="relative w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[32rem_minmax(0,1fr)] xl:grid-cols-[36rem_minmax(0,1fr)] lg:min-h-[min(72vh,40rem)]">
            <div className="relative z-10 flex flex-col justify-center bg-alignment-page px-5 sm:px-8 lg:px-10 xl:px-12 py-14 sm:py-16 lg:py-20 order-2 lg:order-1">
              <div className="max-w-sm">
                <p className={type.kicker}>{copy.eyebrow}</p>
                <h1 className={`mt-5 ${type.h1} text-balance`}>{copy.headline}</h1>
                <p className={`mt-5 ${type.body}`}>{copy.body}</p>
                <CommerceCta
                  to="/planner"
                  event="planner_shop_click"
                  sku={planner.sku}
                  className={`${pillPrimary} mt-8`}
                >
                  Explore the Planner <span aria-hidden>→</span>
                </CommerceCta>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 min-h-[18rem] sm:min-h-[24rem] lg:min-h-full min-w-0 bg-[#F7F3EC]">
              <img
                src="/images/shop/hero.jpg"
                alt="Life of Purpose Planner with gift bag, box, and pen."
                className="absolute inset-0 h-full w-full object-cover object-[55%_45%]"
                decoding="async"
                fetchPriority="high"
              />
              {/* Soft blends into page cream so the photo doesn’t sit as a hard inset */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-28 lg:w-36 bg-gradient-to-r from-[#FBFAF8] via-[#FBFAF8]/70 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FBFAF8]/90 to-transparent lg:from-[#FBFAF8]/40"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FBFAF8] via-[#FBFAF8]/50 to-transparent lg:h-16 lg:from-[#F8F6F2]/90"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-[#FBFAF8]/50 to-transparent"
                aria-hidden
              />
            </div>
          </div>
        </section>

        {/* Featured planner */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-center">
              <div className="max-w-md">
                <h2 className={`${type.h2} text-balance`}>One place for the life you’re actually living.</h2>
                <p className={`mt-5 ${type.body}`}>
                  The Life of Purpose Planner helps you decide what matters, make room for it, and carry those
                  priorities into your day.
                </p>
                <CommerceCta
                  to="/planner"
                  event="planner_shop_click"
                  sku={planner.sku}
                  className={`${pillPrimary} mt-8`}
                >
                  Explore the Planner <span aria-hidden>→</span>
                </CommerceCta>
              </div>
              <figure className="overflow-hidden rounded-2xl bg-alignment-surfaceSoft">
                <img
                  src={plannerImages.paperFoil}
                  alt={planner.imageAlt}
                  className="w-full aspect-[5/4] object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* Tool shelf */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="max-w-xl">
              <h2 className={`${type.h2} text-balance`}>Start with what you need.</h2>
              <p className={`mt-4 ${type.body}`}>
                Use the tools digitally, or print them at home. Each one does one job well.
              </p>
            </div>

            <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {shelf.map((product) => (
                <li key={product.sku}>
                  <Link to={product.path} className="group block h-full">
                    <BookCover
                      src={product.image}
                      alt={product.imageAlt}
                      title={product.title}
                      className="rounded-xl transition-opacity group-hover:opacity-90"
                    />
                    <h3 className={`mt-5 ${type.h3}`}>{product.title}</h3>
                    <p className="mt-1 font-display text-base font-medium text-alignment-primary">
                      {product.tagline}
                    </p>
                    <p className={`mt-3 ${type.body} text-sm line-clamp-3`}>{product.body}</p>
                    <p className="mt-4 text-sm font-medium text-alignment-accent group-hover:text-alignment-primary transition-colors">
                      Explore {product.title} <span aria-hidden>→</span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Collection + assessment */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="px-5 sm:px-8 lg:px-12 xl:px-16 py-14 sm:py-16 lg:py-20 flex flex-col justify-center bg-alignment-page">
              <div className="max-w-md mx-auto lg:mx-0 w-full">
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {shelf.map((product) => (
                    <BookCover
                      key={`collection-${product.sku}`}
                      src={product.image}
                      alt=""
                      title={product.title}
                      className="rounded-lg"
                    />
                  ))}
                </div>
                <h2 className={`mt-10 ${type.h2} text-balance`}>Not more to manage.</h2>
                <p className={`mt-4 ${type.body}`}>
                  Simple tools for seeing clearly, practicing daily, and returning when life shifts.
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-8 lg:px-12 xl:px-16 py-14 sm:py-16 lg:py-20 flex flex-col justify-center bg-alignment-surfaceSoft/90 border-t lg:border-t-0 lg:border-l border-alignment-accent/[0.06]">
              <div className="max-w-md mx-auto lg:mx-0 w-full">
                <p className={type.kicker}>The Alignment Tools Collection</p>
                <p className="mt-3 font-display text-lg font-medium text-alignment-primary">
                  {toolsCollection.tagline}
                </p>
                <p className={`mt-4 ${type.body}`}>{toolsCollection.body}</p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <CommerceCta
                    href={toolsCollection.digital.checkoutUrl}
                    event="checkout_started"
                    sku={toolsCollection.digital.sku}
                    className={pillPrimary}
                  >
                    Get the Collection — {formatUsd(toolsCollection.digital.price)}
                  </CommerceCta>
                  <CommerceCta
                    href={toolsCollection.print.checkoutUrl}
                    event="checkout_started"
                    sku={toolsCollection.print.sku}
                    className={pillOutline}
                  >
                    Print — {formatUsd(toolsCollection.print.price)}
                  </CommerceCta>
                </div>

                <div className="mt-12 pt-10 border-t border-alignment-accent/[0.08]">
                  <p className={type.kicker}>Alignment Assessment</p>
                  <p className={`mt-4 ${type.body}`}>
                    Not sure where to begin? Start with the free assessment.
                  </p>
                  <Link to="/assessment" className={`${pillPrimary} mt-6`}>
                    Take the Assessment <span aria-hidden>→</span>
                  </Link>
                  <p className="mt-4 text-sm text-alignment-accent/70">Free · 12 minutes · No account</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
