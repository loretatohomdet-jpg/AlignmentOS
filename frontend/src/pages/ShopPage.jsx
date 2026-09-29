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
  plannerProduct,
  resetProduct,
  toolsCollection,
  trackCommerce,
} from '../config/commerce';
import { SHOP_SECTION_DEFAULTS } from '../config/pageSections';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { marketingPageCopy, mergeProduct, useShopCatalog, useSitePage } from '../hooks/useSiteContent';
import { resolveCmsImageUrl } from '../config/cmsMedia';

const SHOP_DEFAULTS = {
  eyebrow: 'Shop',
  headline: 'Tools for what matters.',
  body: 'Simple tools for getting clear, choosing what matters, and carrying it into everyday life.',
  ...SHOP_SECTION_DEFAULTS,
};

const STALE_SHOP = new Set([
  'Practical tools for real life.',
  'The Life of Purpose Planner in three editions — sleeved, paperback, and digital — plus the digital Alignment Tools: Clarity and the Quarterly Review.',
]);

function pickShop(cms) {
  const copy = marketingPageCopy('/shop', cms, SHOP_DEFAULTS);
  const out = { ...copy };
  for (const key of ['eyebrow', 'headline', 'body']) {
    if (STALE_SHOP.has(String(out[key] || '').trim())) {
      out[key] = SHOP_DEFAULTS[key];
    }
  }
  return out;
}

export default function ShopPage() {
  usePageTitle('Shop — Alignment OS');
  const copy = pickShop(useSitePage('/shop'));
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
        {/* Hero — copy left, product photo on matching cream (no wash overlays) */}
        <section className="relative w-full overflow-hidden bg-[#FBFAF8]">
          <div className="grid grid-cols-1 lg:grid-cols-[32rem_minmax(0,1fr)] xl:grid-cols-[36rem_minmax(0,1fr)] lg:min-h-[min(72vh,40rem)]">
            <div className="relative z-10 flex flex-col justify-center px-5 sm:px-8 lg:px-10 xl:px-12 py-14 sm:py-16 lg:py-20 order-2 lg:order-1 bg-[#FBFAF8]">
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
                  {copy.plannerCta} <span aria-hidden>→</span>
                </CommerceCta>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 min-h-[18rem] sm:min-h-[24rem] lg:min-h-full min-w-0 bg-[#FBFAF8]">
              <img
                src={resolveCmsImageUrl(copy.heroImage)}
                alt={copy.heroImageAlt}
                className="absolute inset-0 h-full w-full object-cover object-[55%_45%]"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        {/* Featured planner */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-center">
              <div className="max-w-md">
                <h2 className={`${type.h2} text-balance`}>{copy.featuredHeading}</h2>
                <p className={`mt-5 ${type.body}`}>{copy.featuredBody}</p>
                <CommerceCta
                  to="/planner"
                  event="planner_shop_click"
                  sku={planner.sku}
                  className={`${pillPrimary} mt-8`}
                >
                  {copy.featuredCta} <span aria-hidden>→</span>
                </CommerceCta>
              </div>
              <figure className="overflow-hidden rounded-2xl bg-alignment-surfaceSoft">
                <img
                  src={resolveCmsImageUrl(copy.featuredImage)}
                  alt={copy.featuredImageAlt || planner.imageAlt}
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
              <h2 className={`${type.h2} text-balance`}>{copy.shelfHeading}</h2>
              <p className={`mt-4 ${type.body}`}>{copy.shelfBody}</p>
            </div>

            <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
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
            <div className="px-5 sm:px-8 lg:px-10 xl:px-12 py-14 sm:py-16 lg:py-20 flex flex-col justify-center bg-alignment-page">
              <div className="w-full max-w-xl xl:max-w-2xl mx-auto lg:mx-0">
                <figure className="overflow-hidden rounded-2xl bg-[#F7F3EC]">
                  <img
                    src={resolveCmsImageUrl(copy.collectionImage)}
                    alt={copy.collectionImageAlt}
                    className="block w-full h-auto"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <h2 className={`mt-10 ${type.h2} text-balance`}>{copy.collectionHeading}</h2>
                <p className={`mt-4 ${type.body} max-w-md`}>{copy.collectionBody}</p>
              </div>
            </div>

            <div className="px-5 sm:px-8 lg:px-12 xl:px-16 py-14 sm:py-16 lg:py-20 flex flex-col justify-center bg-alignment-surfaceSoft/90 border-t lg:border-t-0 lg:border-l border-alignment-accent/[0.06]">
              <div className="max-w-md mx-auto lg:mx-0 w-full">
                <p className={type.kicker}>{copy.collectionKicker}</p>
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
                  <p className={type.kicker}>{copy.assessKicker}</p>
                  <p className={`mt-4 ${type.body}`}>{copy.assessBody}</p>
                  <Link to="/assessment" className={`${pillPrimary} mt-6`}>
                    {copy.assessCta} <span aria-hidden>→</span>
                  </Link>
                  <p className="mt-4 text-sm text-alignment-accent/70">{copy.assessMeta}</p>
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
