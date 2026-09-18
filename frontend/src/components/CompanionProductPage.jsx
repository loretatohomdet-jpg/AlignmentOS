import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteMarketingHeader from './SiteMarketingHeader';
import CommerceCta from './CommerceCta';
import BookCover from './BookCover';
import { SitePageFooter, pillGhost, pillPrimary } from './HomeMarketingChrome';
import { companionProducts, formatUsd, trackCommerce } from '../config/commerce';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';

export default function CompanionProductPage({ product }) {
  usePageTitle(`${product.title} — Alignment OS`);

  useEffect(() => {
    trackCommerce('product_view', { sku: product.sku, product_sku: product.sku });
  }, [product.sku]);

  const others = companionProducts.filter((item) => item.sku !== product.sku);
  const paid = product.price > 0;

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
              src={product.image}
              alt={product.imageAlt}
              className="rounded-2xl max-w-xs mx-auto lg:mx-0 lg:max-w-none"
            />
            <div className="min-w-0">
              <p className={type.kicker}>{product.kicker}</p>
              <h1 className={`mt-6 ${type.h1} text-balance`}>{product.title}</h1>
              <p className="mt-6 font-display italic text-xl sm:text-2xl text-alignment-primary leading-snug">
                {product.tagline}
              </p>
              <p className={`mt-6 ${type.body} max-w-xl`}>{product.body}</p>
              {paid ? (
                <>
                  <p className="mt-8 font-display text-3xl font-medium text-alignment-accent tabular-nums">
                    {formatUsd(product.price)}
                  </p>
                  <p className={`mt-2 ${type.muted}`}>
                    Digital download. Print it if you want it in your hands. No Alignment OS account required.
                  </p>
                  <CommerceCta
                    href={product.checkoutUrl}
                    event="checkout_started"
                    sku={product.sku}
                    className={`${pillPrimary} mt-10`}
                  >
                    {product.cta} <span aria-hidden className="ml-1">
                      →
                    </span>
                  </CommerceCta>
                </>
              ) : (
                <CommerceCta to={product.path} event={product.event} sku={product.sku} className={`${pillPrimary} mt-10`}>
                  {product.cta} <span aria-hidden className="ml-1">
                    →
                  </span>
                </CommerceCta>
              )}

              {product.print?.checkoutUrl ? (
                <div className="mt-14 rounded-2xl border border-alignment-accent/[0.1] bg-alignment-surface p-6 sm:p-8">
                  <p className={type.kicker}>Printed edition</p>
                  <p className={`mt-3 ${type.h3}`}>{formatUsd(product.print.price)}</p>
                  <p className={`mt-3 ${type.body}`}>The same tool, bound, if you want it on the table.</p>
                  <CommerceCta
                    href={product.print.checkoutUrl}
                    event="checkout_started"
                    sku={product.print.sku}
                    className={`${pillGhost} mt-6`}
                  >
                    Get the printed edition <span aria-hidden className="ml-1">
                      →
                    </span>
                  </CommerceCta>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-20">
            <p className={type.kicker}>The other parts</p>
            <ul className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-4 max-w-lg">
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
