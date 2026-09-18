import SiteMarketingHeader from '../components/SiteMarketingHeader';
import CommerceCta from '../components/CommerceCta';
import { SitePageFooter, pillGhost, pillPrimary } from '../components/HomeMarketingChrome';
import { formatUsd, plannerEditions, plannerProduct, trackCommerce } from '../config/commerce';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const gallery = [
  { id: 'cover', label: 'Cover' },
  { id: 'interior', label: 'Interior spreads' },
  { id: 'weekly', label: 'Weekly view' },
  { id: 'reflection', label: 'Reflection pages' },
  { id: 'detail', label: 'Paper, binding, ribbon' },
  { id: 'beside', label: 'Beside Alignment OS' },
];

export default function PlannerPage() {
  usePageTitle('Life of Purpose Planner — Alignment OS');

  useEffect(() => {
    trackCommerce('product_view', { sku: plannerProduct.sku, product_sku: plannerProduct.sku });
  }, []);

  return (
    <div className={type.page}>
      <a href="#planner-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="planner-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <section className="max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 pt-12 sm:pt-16 pb-12">
          <p className={type.kicker}>{plannerProduct.kicker}</p>
          <h1 className={`mt-6 ${type.h1} text-balance max-w-xl`}>{plannerProduct.title}</h1>
          <p className="mt-6 font-display italic text-xl sm:text-2xl text-alignment-primary leading-snug">
            {plannerProduct.tagline}
          </p>
          <p className={`mt-6 ${type.body} max-w-xl`}>{plannerProduct.body}</p>
          <CommerceCta
            href={plannerProduct.checkoutUrl}
            to={plannerProduct.checkoutUrl ? undefined : '/shop'}
            event="planner_shop_click"
            sku={plannerProduct.sku}
            className={`${pillPrimary} mt-10`}
          >
            Shop the planner <span aria-hidden className="ml-1">→</span>
          </CommerceCta>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
            <p className={type.kicker}>The object</p>
            <ul className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {gallery.map((shot) => (
                <li
                  key={shot.id}
                  className="aspect-[4/5] rounded-2xl border border-alignment-accent/[0.1] bg-alignment-foundation flex items-end p-4"
                >
                  <span className={type.muted}>{shot.label}</span>
                </li>
              ))}
            </ul>
            <p className={`mt-4 ${type.muted}`}>
              Product photography slots — cover, interiors, weekly view, reflection pages, materials, and the planner beside Alignment OS.
            </p>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-20">
            <p className={type.kicker}>Together</p>
            <h2 className={`mt-4 ${type.h2} text-balance`}>Digital clarity. Analog practice.</h2>
            <p className={`mt-6 ${type.body} max-w-xl`}>
              Alignment OS helps you see the bigger picture. The planner helps you carry it into the day.
            </p>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-20">
            <p className={type.kicker}>Editions</p>
            <h2 className={`mt-4 ${type.h2}`}>Choose how you hold the week.</h2>
            <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {plannerEditions.map((edition) => (
                <li
                  key={edition.sku}
                  className="flex flex-col rounded-2xl border border-alignment-accent/[0.1] bg-alignment-surface p-6 sm:p-8"
                >
                  <h3 className={type.h3}>{edition.name}</h3>
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
                    Shop this edition <span aria-hidden className="ml-1">→</span>
                  </CommerceCta>
                </li>
              ))}
            </ul>
            <p className={`mt-8 ${type.muted}`}>
              Checkout is on Shopify. No Alignment OS account is required.
            </p>
            <Link to="/shop" className={`${pillGhost} mt-6`}>
              Explore all tools
            </Link>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
