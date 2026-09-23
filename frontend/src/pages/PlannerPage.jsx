import SiteMarketingHeader from '../components/SiteMarketingHeader';
import CommerceCta from '../components/CommerceCta';
import { pageWidth, pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import { formatUsd, plannerEditions, plannerImages, plannerProduct, trackCommerce } from '../config/commerce';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { pageCopy, useSitePage } from '../hooks/useSiteContent';
import { useEffect } from 'react';

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
  usePageTitle('Planner — Alignment OS');
  const copy = pageCopy(useSitePage('/planner'), {
    eyebrow: 'Planner',
    headline: 'It started on paper.',
    subhead: 'Not another place for more tasks. A place to remember what the tasks were for.',
    ctaLabel: 'Explore the Planner',
    ctaHref: '#editions',
  });

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
        <section>
          <div className={`${pageWidth} pt-12 sm:pt-16 pb-10 sm:pb-14`}>
            <div className="max-w-xl">
              <p className={type.kicker}>{copy.eyebrow}</p>
              <h1 className={`mt-6 ${type.h1} text-balance`}>{copy.headline}</h1>
              <div className={`mt-10 sm:mt-12 space-y-6 ${type.body}`}>
                <p>Before Alignment OS became a platform, it was a planner.</p>
                <p>
                  I wanted a way to hold together what mattered without turning life into another exercise in
                  productivity.
                </p>
                <p className="font-display text-xl sm:text-2xl font-medium text-alignment-accent leading-snug">
                  {copy.subhead}
                </p>
              </div>
            </div>
            <figure className="mt-12 sm:mt-16 overflow-hidden rounded-2xl bg-alignment-surfaceSoft">
              <Photo
                src={plannerImages.paperLifestyle}
                alt="The Life of Purpose Planner carried with a laptop and tote, outdoors"
                className="w-full h-auto"
                eager
              />
            </figure>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="max-w-xl">
              <h2 className={type.h2}>Purpose before plans.</h2>
              <div className={`mt-8 space-y-6 ${type.body}`}>
                <p>The planner begins before the to-do list.</p>
                <p>What matters right now? What deserves your attention? What are you responsible for? What needs to become smaller?</p>
                <p>Then you plan.</p>
              </div>
            </div>
            <figure className="mt-12 overflow-hidden rounded-2xl bg-alignment-foundation">
              <Photo
                src={plannerImages.sleevedAnatomy}
                alt="The sleeved Life of Purpose Planner opened: slipcase, signature cover, title page, daily pages, and ribbon markers"
                className="w-full h-auto"
              />
            </figure>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="max-w-xl">
              <h2 className={`${type.h2} text-balance`}>A quieter way to carry clarity into the day.</h2>
              <div className={`mt-8 space-y-6 ${type.body}`}>
                <p>The platform helps you step back and see the bigger picture.</p>
                <p>The planner gives you somewhere to carry that clarity when the screen closes.</p>
                <p className="font-display text-xl sm:text-2xl font-medium text-alignment-accent leading-snug">
                  The platform helps you see. The planner helps you live it.
                </p>
              </div>
            </div>
            <figure className="mt-12 overflow-hidden rounded-2xl bg-alignment-surfaceSoft">
              <Photo
                src={plannerImages.sleevedDesk}
                alt="Hands holding the sleeved Life of Purpose Planner at a desk"
                className="w-full object-cover aspect-[4/5] sm:aspect-[5/4] object-[center_38%]"
              />
            </figure>
            <ul className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <li className="overflow-hidden rounded-2xl bg-alignment-surfaceSoft">
                <Photo
                  src={plannerImages.paperFoil}
                  alt="Gold foil lettering on the paper edition cover, with silk ribbons"
                  className="w-full aspect-[4/5] object-cover object-[center_40%]"
                />
              </li>
              <li className="overflow-hidden rounded-2xl bg-alignment-surfaceSoft">
                <Photo
                  src={plannerImages.paperCover}
                  alt="The paper edition of the Life of Purpose Planner"
                  className="w-full aspect-[4/5] object-cover object-center"
                />
              </li>
              <li className="overflow-hidden rounded-2xl bg-alignment-surfaceSoft">
                <Photo
                  src={plannerImages.paperGift}
                  alt="The paper planner on a stone plinth, with its gift sleeve beside it"
                  className="w-full aspect-[4/5] object-cover object-[center_40%]"
                />
              </li>
            </ul>
            <CommerceCta
              href={copy.ctaHref || '#editions'}
              event="planner_shop_click"
              sku={plannerProduct.sku}
              className={`${pillPrimary} mt-12 sm:mt-16`}
            >
              {copy.ctaLabel} <span aria-hidden className="ml-1">
                →
              </span>
            </CommerceCta>
          </div>
        </section>

        <section id="editions" className="w-full border-t border-alignment-accent/[0.06] scroll-mt-20">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {plannerEditions.map((edition) => (
                <li
                  key={edition.sku}
                  className="flex flex-col overflow-hidden rounded-2xl border border-alignment-accent/[0.1] bg-alignment-surface"
                >
                  <Photo src={edition.image} alt={edition.imageAlt} className={edition.imageClass} />
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
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
