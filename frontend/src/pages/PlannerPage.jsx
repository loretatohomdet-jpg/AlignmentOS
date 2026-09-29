import { useEffect } from 'react';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import CommerceCta from '../components/CommerceCta';
import { pageWidth, pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import {
  formatUsd,
  plannerEditions,
  plannerImages,
  plannerProduct,
  trackCommerce,
} from '../config/commerce';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { mergeProduct, useShopCatalog } from '../hooks/useSiteContent';

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

const INSIDE_FEATURES = [
  {
    title: 'See the season',
    body: 'Step back and notice what matters now.',
  },
  {
    title: 'Choose your priorities',
    body: 'Name what deserves your attention.',
  },
  {
    title: 'Plan the week',
    body: 'Give important things a place.',
  },
  {
    title: 'Return each day',
    body: 'Keep what matters in view.',
  },
  {
    title: 'Look back',
    body: 'Notice what held, what changed, and what needs adjusting.',
  },
];

const INSIDE_PHOTOS = [
  {
    src: plannerImages.paperCover,
    alt: 'Life of Purpose Planner paper edition cover',
  },
  {
    src: plannerImages.paperFoil,
    alt: 'Gold foil lettering on the planner cover',
  },
  {
    src: plannerImages.sleevedAnatomy,
    alt: 'Inside the sleeved planner — pages and ribbon markers',
  },
  {
    src: plannerImages.sleevedDesk,
    alt: 'The sleeved planner at a desk',
  },
];

export default function PlannerPage() {
  usePageTitle('Planner — Alignment OS');
  const offers = useShopCatalog();
  const editions = plannerEditions.map((edition) => mergeProduct(edition, offers));
  const paper = editions.find((e) => e.sku === 'planner-standard') || editions[1];
  const sleeved = editions.find((e) => e.sku === 'planner-heirloom') || editions[2];
  const digital = editions.find((e) => e.sku === 'planner-digital') || editions[0];
  const heroEditions = [paper, sleeved].filter(Boolean);

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
        {/* Hero */}
        <section className="relative w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[32rem_minmax(0,1fr)] xl:grid-cols-[36rem_minmax(0,1fr)] lg:min-h-[min(72vh,40rem)]">
            <div className="relative z-10 flex flex-col justify-center bg-alignment-page px-5 sm:px-8 lg:px-10 xl:px-12 py-14 sm:py-16 lg:py-20 order-2 lg:order-1">
              <div className="max-w-md">
                <p className={type.kicker}>Life of Purpose Planner</p>
                <h1 className={`mt-5 ${type.h1} text-balance`}>Make room for what matters.</h1>
                <p className={`mt-5 ${type.body}`}>
                  A paper planner for seeing the bigger picture, choosing what matters now, and carrying it into
                  ordinary days.
                </p>

                <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {heroEditions.map((edition) => (
                    <li key={edition.sku}>
                      <CommerceCta
                        href={edition.checkoutUrl}
                        event="checkout_started"
                        sku={edition.sku}
                        className="flex h-full flex-col justify-between rounded-xl border border-alignment-accent/[0.12] bg-alignment-surface px-4 py-4 text-left transition-colors hover:border-alignment-primary/35"
                      >
                        <span className="text-sm font-medium text-alignment-accent leading-snug">
                          {edition.sku === 'planner-heirloom' ? 'Boxed Leather Sleeve Edition' : 'Paper Planner'}
                        </span>
                        <span className="mt-4 font-display text-2xl font-medium tabular-nums text-alignment-accent">
                          {formatUsd(edition.price)}
                        </span>
                      </CommerceCta>
                    </li>
                  ))}
                </ul>

                <CommerceCta
                  href="#editions"
                  event="planner_shop_click"
                  sku={plannerProduct.sku}
                  className={`${pillPrimary} mt-6 w-full sm:w-auto`}
                >
                  Choose Your Edition <span aria-hidden>→</span>
                </CommerceCta>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 min-h-[18rem] sm:min-h-[24rem] lg:min-h-full min-w-0 bg-[#F7F3EC]">
              <Photo
                src="/images/planner/hero.jpg"
                alt="Life of Purpose Planner with gift bag, box, and pen."
                className="absolute inset-0 h-full w-full object-cover object-[55%_45%]"
                eager
              />
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

        {/* A different way to plan */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-center">
              <div className="max-w-md">
                <p className={type.kicker}>A different way to plan</p>
                <h2 className={`mt-4 ${type.h2} text-balance`}>Your life is more than a list.</h2>
                <p className={`mt-5 ${type.body}`}>
                  There will always be more to do. The Life of Purpose Planner helps you decide what deserves your
                  attention before you fill the page.
                </p>
                <ul className="mt-8 space-y-2 font-display text-lg sm:text-xl text-alignment-accent leading-snug">
                  <li>See clearly.</li>
                  <li>Choose carefully.</li>
                  <li>Plan from there.</li>
                </ul>
              </div>
              <figure className="overflow-hidden rounded-2xl bg-alignment-surfaceSoft">
                <Photo
                  src={plannerImages.sleevedAnatomy}
                  alt="The sleeved Life of Purpose Planner opened: slipcase, cover, and pages"
                  className="w-full aspect-[5/4] object-cover object-center"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* Inside */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-10 lg:gap-14 lg:items-start">
              <div className="max-w-md">
                <p className={type.kicker}>Inside</p>
                <h2 className={`mt-4 ${type.h2} text-balance`}>Enough structure. Plenty of room to live.</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {INSIDE_FEATURES.map((feature) => (
                  <li key={feature.title} className="max-w-xs">
                    <p className="font-display text-lg font-medium text-alignment-accent">{feature.title}</p>
                    <p className={`mt-2 ${type.body}`}>{feature.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="mt-12 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {INSIDE_PHOTOS.map((photo) => (
                <li key={photo.src} className="overflow-hidden rounded-2xl bg-alignment-foundation">
                  <Photo
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full aspect-[4/5] object-cover object-center"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Two editions */}
        <section id="editions" className="w-full border-t border-alignment-accent/[0.06] scroll-mt-20">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <p className={type.kicker}>Two editions</p>

            <ul className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
              {heroEditions.map((edition) => {
                const isSleeved = edition.sku === 'planner-heirloom';
                return (
                  <li key={edition.sku} className="grid grid-cols-1 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] gap-6 sm:gap-8 items-start">
                    <figure className="overflow-hidden rounded-2xl bg-alignment-surfaceSoft">
                      <Photo
                        src={edition.image}
                        alt={edition.imageAlt}
                        className="w-full aspect-square object-cover object-center"
                      />
                    </figure>
                    <div className="min-w-0">
                      <h3 className={type.h3}>
                        {isSleeved ? 'Boxed Leather Sleeve Edition' : 'The Life of Purpose Planner'}
                      </h3>
                      <p className="mt-3 font-display text-2xl font-medium tabular-nums text-alignment-accent">
                        {formatUsd(edition.price)}
                      </p>
                      <p className={`mt-4 ${type.body}`}>
                        {isSleeved
                          ? 'The Life of Purpose Planner presented with its leather sleeve and keepsake box. Made for keeping, gifting, and carrying year after year.'
                          : 'The complete planner in its classic paper edition. A simple, beautiful tool made to be used.'}
                      </p>
                      {edition.origin ? <p className={`mt-3 ${type.kicker}`}>{edition.origin}</p> : null}
                      <CommerceCta
                        href={edition.checkoutUrl}
                        event="checkout_started"
                        sku={edition.sku}
                        className={`${pillPrimary} mt-6`}
                      >
                        {isSleeved ? 'Choose the Boxed Edition' : 'Choose the Planner'} <span aria-hidden>→</span>
                      </CommerceCta>
                    </div>
                  </li>
                );
              })}
            </ul>

            {digital ? (
              <div className="mt-12 pt-10 border-t border-alignment-accent/[0.08] max-w-xl">
                <p className={type.kicker}>{digital.kicker || 'Also available'}</p>
                <h3 className={`mt-3 ${type.h3}`}>{digital.name}</h3>
                <p className="mt-2 font-display text-xl font-medium tabular-nums text-alignment-accent">
                  {formatUsd(digital.price)}
                </p>
                <p className={`mt-3 ${type.body}`}>{digital.note}</p>
                <CommerceCta
                  href={digital.checkoutUrl}
                  event="checkout_started"
                  sku={digital.sku}
                  className={`${pillPrimary} mt-6`}
                >
                  {digital.cta} <span aria-hidden>→</span>
                </CommerceCta>
              </div>
            ) : null}
          </div>
        </section>

        {/* Close */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-20`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              <div className="max-w-sm">
                <p className={type.kicker}>Made for real life</p>
                <h2 className={`mt-4 ${type.h2}`}>Plans change.</h2>
                <p className={`mt-4 ${type.body}`}>
                  Weeks get full. Some things take longer than expected. The planner gives you a place to return — not
                  a system you have to keep perfectly.
                </p>
              </div>
              <div className="flex flex-col justify-center font-display text-xl sm:text-2xl text-alignment-accent leading-snug max-w-xs md:mx-auto">
                <p>No streaks.</p>
                <p>No catching up.</p>
                <p>No perfect week required.</p>
              </div>
              <div className="max-w-sm md:ml-auto">
                <p className={type.kicker}>Part of Alignment OS</p>
                <h2 className={`mt-4 ${type.h2}`}>Paper when paper is better.</h2>
                <p className={`mt-4 ${type.body}`}>
                  The planner works on its own. If you use Alignment OS, the two can work together: see the pattern in
                  your Map, choose what matters in your Plan, and carry it onto paper.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom choose bar */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-page">
          <div className={`${pageWidth} py-10 sm:py-12`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <h2 className={`${type.h2} text-balance`}>Begin with what matters.</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                {heroEditions.map((edition) => (
                  <CommerceCta
                    key={`bar-${edition.sku}`}
                    href={edition.checkoutUrl}
                    event="checkout_started"
                    sku={edition.sku}
                    className="text-sm text-alignment-accent hover:text-alignment-primary transition-colors"
                  >
                    <span className="font-medium">
                      {edition.sku === 'planner-heirloom' ? 'Boxed Edition' : 'Paper Planner'}
                    </span>
                    <span className="ml-2 tabular-nums text-alignment-accent/70">{formatUsd(edition.price)}</span>
                  </CommerceCta>
                ))}
                <CommerceCta
                  href="#editions"
                  event="planner_shop_click"
                  sku={plannerProduct.sku}
                  className={pillPrimary}
                >
                  Choose Your Edition <span aria-hidden>→</span>
                </CommerceCta>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
