import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteMarketingHeader from './SiteMarketingHeader';
import CommerceCta from './CommerceCta';
import BookCover from './BookCover';
import { SitePageFooter, pillGhost, pillPrimary } from './HomeMarketingChrome';
import { alignmentTools, formatUsd, trackCommerce } from '../config/commerce';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { mergeProduct, useShopCatalog } from '../hooks/useSiteContent';

export default function CompanionProductPage({ product }) {
  const offers = useShopCatalog();
  const live = mergeProduct(product, offers);
  usePageTitle(`${live.title} — Alignment OS`);

  useEffect(() => {
    trackCommerce('product_view', { sku: live.sku, product_sku: live.sku });
  }, [live.sku]);

  const others = alignmentTools
    .map((item) => mergeProduct(item, offers))
    .filter((item) => item.sku !== live.sku && !item.hidden);

  return (
    <div className={type.page}>
      <a href="#companion-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="companion-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <section className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-16 sm:pb-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start xl:gap-16">
            <BookCover
              src={live.image}
              alt={live.imageAlt}
              title={live.title}
              className="rounded-2xl max-w-xs mx-auto lg:mx-0 lg:max-w-none"
            />
            <div className="min-w-0">
              <p className={type.kicker}>{live.kicker}</p>
              <h1 className={`mt-6 ${type.h1} text-balance`}>{live.title}</h1>
              <p className="mt-6 font-display font-medium text-xl sm:text-2xl text-alignment-primary leading-snug">
                {live.tagline}
              </p>
              <p className={`mt-6 ${type.body} max-w-xl`}>{live.body}</p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 max-w-xl">
                <div className="rounded-2xl border border-alignment-accent/[0.1] bg-alignment-surface p-6">
                  <p className={type.kicker}>Digital</p>
                  <p className={`mt-3 ${type.h3}`}>{formatUsd(live.price)}</p>
                  <p className={`mt-2 ${type.muted}`}>Instant download. Printable. Fillable where useful.</p>
                  <CommerceCta
                    href={live.checkoutUrl}
                    event="checkout_started"
                    sku={live.sku}
                    className={`${pillPrimary} mt-6`}
                  >
                    Choose Digital
                  </CommerceCta>
                </div>
                {live.print?.price != null ? (
                <div className="rounded-2xl border border-alignment-accent/[0.1] bg-alignment-surface p-6">
                  <p className={type.kicker}>Print</p>
                  <p className={`mt-3 ${type.h3}`}>{formatUsd(live.print.price)}</p>
                  <p className={`mt-2 ${type.muted}`}>Professionally printed. Ready to write in.</p>
                  <CommerceCta
                    href={live.print.checkoutUrl}
                    event="checkout_started"
                    sku={live.print.sku}
                    className={`${pillGhost} mt-6`}
                  >
                    Choose Print
                  </CommerceCta>
                </div>
                ) : null}
              </div>
            </div>
          </div>

          {others.length > 0 ? (
            <div className="mt-20">
              <p className={type.kicker}>The Alignment Tools</p>
              <ul
                className={`mt-6 grid grid-cols-1 gap-4 ${
                  others.length > 2 ? 'sm:grid-cols-3 max-w-3xl' : 'sm:grid-cols-2 max-w-lg'
                }`}
              >
                {others.map((item) => (
                  <li key={item.sku}>
                    <Link to={item.path} className="block group">
                      <BookCover
                        src={item.image}
                        alt={item.imageAlt}
                        title={item.title}
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
          ) : null}
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
