import SiteMarketingHeader from '../components/SiteMarketingHeader';
import CommerceCta from '../components/CommerceCta';
import { SitePageFooter, pillGhost, pillPrimary } from '../components/HomeMarketingChrome';
import { formatUsd, plannerEditions, plannerImages, plannerProduct, trackCommerce } from '../config/commerce';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const gallery = [
  {
    src: plannerImages.paperLifestyle,
    alt: 'The paper planner on a sunlit table, beside an open book and a pen',
  },
  {
    src: plannerImages.paperGift,
    alt: 'The paper planner on a stone plinth, with its gift sleeve beside it',
  },
  {
    src: plannerImages.paperFoil,
    alt: 'Gold foil lettering on the paper edition cover, with silk ribbons',
  },
];

function Photo({ src, alt, className, eager = false }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

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
        <section className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-12 sm:pb-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center xl:gap-16">
            <div className="min-w-0">
              <p className={type.kicker}>{plannerProduct.kicker}</p>
              <h1 className={`mt-6 ${type.h1} text-balance`}>{plannerProduct.title}</h1>
              <p className="mt-6 font-display italic text-xl sm:text-2xl text-alignment-primary leading-snug">
                {plannerProduct.tagline}
              </p>
              <p className={`mt-6 ${type.body} max-w-xl`}>{plannerProduct.body}</p>
              <CommerceCta
                href="#editions"
                event="planner_shop_click"
                sku={plannerProduct.sku}
                className={`${pillPrimary} mt-10`}
              >
                Choose an edition <span aria-hidden className="ml-1">
                  →
                </span>
              </CommerceCta>
            </div>
            <figure className="min-w-0 overflow-hidden rounded-2xl bg-alignment-surfaceSoft">
              <Photo
                src={plannerImages.paperFoil}
                alt="Close view of the paper edition: linen cover, gold lettering, and silk ribbons"
                className="w-full h-auto object-cover aspect-[4/3] object-[center_70%]"
                eager
              />
            </figure>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
            <p className={type.kicker}>The sleeved edition</p>
            <h2 className={`mt-4 ${type.h2} text-balance max-w-2xl`}>Made in Florence, Italy.</h2>
            <p className={`mt-6 ${type.body} max-w-xl`}>
              A signature cover and slipcase for the person who wants the planner as an object to keep — not only a page
              to write on.
            </p>
            <figure className="mt-10 max-w-4xl overflow-hidden rounded-2xl bg-alignment-foundation">
              <Photo
                src={plannerImages.sleevedAnatomy}
                alt="The sleeved Life of Purpose Planner opened: slipcase, signature cover, title page, daily pages, and ribbon markers"
                className="w-full h-auto"
              />
            </figure>
          </div>
        </section>

        <section id="editions" className="w-full border-t border-alignment-accent/[0.06] scroll-mt-20">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
            <p className={type.kicker}>Editions</p>
            <h2 className={`mt-4 ${type.h2} text-balance`}>Three ways to hold the week.</h2>
            <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {plannerEditions.map((edition) => (
                <li
                  key={edition.sku}
                  className="flex flex-col overflow-hidden rounded-2xl border border-alignment-accent/[0.1] bg-alignment-surface"
                >
                  <Photo
                    src={edition.image}
                    alt={edition.imageAlt}
                    className={edition.imageClass}
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
            <p className={`mt-8 ${type.muted}`}>
              The digital edition checks out on Gumroad. Paper and sleeved editions check out on Shopify. No Alignment OS
              account is required.
            </p>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
            <p className={type.kicker}>On the table</p>
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {gallery.map((shot) => (
                <li key={shot.src} className="overflow-hidden rounded-2xl bg-alignment-foundation">
                  <Photo src={shot.src} alt={shot.alt} className="w-full aspect-[4/5] sm:aspect-[4/5] object-cover object-[center_40%]" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-20">
            <p className={type.kicker}>Together</p>
            <h2 className={`mt-4 ${type.h2} text-balance`}>Digital clarity. Analog practice.</h2>
            <p className={`mt-6 ${type.body} max-w-xl`}>
              Reset, Clarity, and the Quarterly Review are the three companions for paper and screen. Alignment OS
              helps you see the bigger picture. The planner helps you carry it into the day — as a download, on paper,
              or as an object made in Florence.
            </p>
            <Link to="/shop" className={`${pillGhost} mt-10`}>
              Explore all tools
            </Link>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
