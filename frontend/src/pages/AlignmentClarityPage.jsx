import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import CommerceCta from '../components/CommerceCta';
import { SitePageFooter, pillGhost, pillPrimary } from '../components/HomeMarketingChrome';
import { clarityProduct, formatUsd, trackCommerce } from '../config/commerce';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';

export default function AlignmentClarityPage() {
  usePageTitle('Alignment Clarity — Alignment OS');

  useEffect(() => {
    trackCommerce('product_view', { sku: clarityProduct.sku, product_sku: clarityProduct.sku });
  }, []);

  return (
    <div className={type.page}>
      <a href="#clarity-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="clarity-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <section className="max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 pt-12 sm:pt-16 pb-16 sm:pb-24">
          <p className={type.kicker}>{clarityProduct.kicker}</p>
          <h1 className={`mt-6 ${type.h1} text-balance max-w-xl`}>{clarityProduct.title}</h1>
          <p className="mt-6 font-display italic text-xl sm:text-2xl text-alignment-primary leading-snug">
            {clarityProduct.tagline}
          </p>
          <p className={`mt-6 ${type.body} max-w-xl`}>{clarityProduct.body}</p>
          <p className="mt-8 font-display text-3xl font-medium text-alignment-accent tabular-nums">
            {formatUsd(clarityProduct.price)}
          </p>
          <p className={`mt-2 ${type.muted}`}>Digital. Delivered after payment. No Alignment OS account required.</p>
          <CommerceCta
            href={clarityProduct.checkoutUrl}
            event="checkout_started"
            sku={clarityProduct.sku}
            className={`${pillPrimary} mt-10`}
          >
            Get Clarity <span aria-hidden className="ml-1">→</span>
          </CommerceCta>

          {clarityProduct.print?.checkoutUrl ? (
            <div className="mt-14 rounded-2xl border border-alignment-accent/[0.1] bg-alignment-surface p-6 sm:p-8">
              <p className={type.kicker}>Printed edition</p>
              <p className={`mt-3 ${type.h3}`}>{formatUsd(clarityProduct.print.price)}</p>
              <p className={`mt-3 ${type.body}`}>The same tool, on paper, if you want it in your hands.</p>
              <CommerceCta
                href={clarityProduct.print.checkoutUrl}
                event="checkout_started"
                sku={clarityProduct.print.sku}
                className={`${pillGhost} mt-6`}
              >
                Get the printed edition <span aria-hidden className="ml-1">→</span>
              </CommerceCta>
            </div>
          ) : null}

          <p className={`mt-12 ${type.body}`}>
            Prefer analog for the whole week?{' '}
            <Link to="/planner" className="underline underline-offset-2 hover:text-alignment-accent">
              Life of Purpose Planner
            </Link>
            .
          </p>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
