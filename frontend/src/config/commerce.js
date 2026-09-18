import {
  shopClarityPrintUrl,
  shopClarityUrl,
  shopPlannerDigitalUrl,
  shopPlannerHeirloomUrl,
  shopPlannerUrl,
  shopQuarterlyUrl,
  shopResetUrl,
  shopifyStoreUrl,
} from './externalLinks';

function checkout(url) {
  return url || shopifyStoreUrl || '';
}

export const plannerImages = {
  paperCover: '/images/planner/paper-cover.png',
  paperFoil: '/images/planner/paper-foil.png',
  paperLifestyle: '/images/planner/paper-lifestyle.png',
  paperGift: '/images/planner/paper-gift.png',
  sleevedDesk: '/images/planner/sleeved-desk.png',
  sleevedAnatomy: '/images/planner/sleeved-anatomy.png',
};

/** Single source for shop prices and checkout URLs. */
export const plannerEditions = [
  {
    sku: 'planner-digital',
    name: 'Digital Edition',
    price: 27,
    note: 'The same planner, as a fillable download. Use it on a tablet, or print the pages yourself.',
    kicker: 'Instant download',
    image: plannerImages.paperFoil,
    imageAlt: 'Life of Purpose Planner cover lettering — the digital edition is a fillable download of the same planner',
    imageClass: 'w-full aspect-[4/3] object-cover object-[center_70%]',
    checkoutUrl: shopPlannerDigitalUrl,
    vendor: 'gumroad',
    cta: 'Get the digital edition',
  },
  {
    sku: 'planner-standard',
    name: 'Paper Edition',
    price: 48,
    note: 'For those who would rather keep this work on paper than on a screen.',
    image: plannerImages.paperCover,
    imageAlt: 'Life of Purpose Planner, paper edition, with ribbon markers',
    imageClass: 'w-full aspect-[4/3] object-cover object-center',
    checkoutUrl: checkout(shopPlannerUrl),
    vendor: 'shopify',
    cta: 'Shop this edition',
  },
  {
    sku: 'planner-heirloom',
    name: 'Sleeved Edition',
    price: 168,
    note: 'The luxury edition. A signature cover and slipcase, made in Florence, Italy.',
    origin: 'Made in Florence, Italy',
    image: plannerImages.sleevedDesk,
    imageAlt: 'The sleeved Life of Purpose Planner, held at a desk',
    imageClass: 'w-full aspect-[4/3] object-cover object-[center_42%]',
    checkoutUrl: checkout(shopPlannerHeirloomUrl || shopPlannerUrl),
    vendor: 'shopify',
    cta: 'Shop this edition',
  },
];

export const plannerProduct = {
  sku: 'planner',
  title: 'Life of Purpose Planner',
  kicker: 'Planner',
  tagline: 'Plan from what matters.',
  body: 'Not another place to collect more tasks. A thoughtful planner for deciding what matters, making room for it, and carrying those priorities into your day — as a download, on paper, or in the sleeved edition made in Florence.',
  priceFrom: 27,
  path: '/planner',
  checkoutUrl: checkout(shopPlannerUrl),
  image: plannerImages.paperLifestyle,
  imageAlt: 'Life of Purpose Planner on a sunlit table, beside a pen and an open book',
};

export const companionImages = {
  reset: '/images/companions/reset.png',
  clarity: '/images/companions/clarity.png',
  quarterly: '/images/companions/quarterly-review.png',
};

export const resetProduct = {
  sku: 'alignment-reset',
  title: 'Reset',
  kicker: 'Companion',
  tagline: 'A fresh start for what matters.',
  body: 'Simple steps for a more aligned life. Begin here when effort is high and the week has drifted.',
  price: 0,
  path: '/reset',
  checkoutUrl: shopResetUrl,
  image: companionImages.reset,
  imageAlt: 'Reset — A Fresh Start for What Matters, the Alignment OS companion',
  priceLabel: 'Free',
  cta: 'Begin the Reset',
  event: 'shop_all_click',
};

export const clarityProduct = {
  sku: 'alignment-clarity',
  title: 'Clarity',
  kicker: 'Companion',
  tagline: 'See what matters.',
  body: 'A guided tool for stepping back, getting clear, and choosing what deserves your attention now.',
  price: 27,
  path: '/shop/alignment-clarity',
  checkoutUrl: checkout(shopClarityUrl),
  image: companionImages.clarity,
  imageAlt: 'Clarity — See What Matters, the Alignment OS companion',
  priceLabel: 'Digital — $27',
  cta: 'Get Clarity',
  event: 'clarity_product_click',
  print: {
    sku: 'alignment-clarity-print',
    name: 'Printed edition',
    price: 47,
    checkoutUrl: checkout(shopClarityPrintUrl),
  },
};

export const quarterlyProduct = {
  sku: 'alignment-quarterly',
  title: 'Quarterly Review',
  kicker: 'Companion',
  tagline: 'Realign as life changes.',
  body: 'Reflect. Release. Realign. A guided review for stepping into what is next when the season has moved.',
  price: 27,
  path: '/shop/quarterly-review',
  checkoutUrl: checkout(shopQuarterlyUrl || shopClarityUrl),
  image: companionImages.quarterly,
  imageAlt: 'Quarterly Review — Realign as life changes, the Alignment OS companion',
  priceLabel: 'Digital — $27',
  cta: 'Get the Quarterly Review',
  event: 'checkout_started',
};

/** Reset, Clarity, Quarterly Review — the three paper/digital companions. */
export const companionProducts = [resetProduct, clarityProduct, quarterlyProduct];

export const shopToolCards = [
  ...companionProducts,
  {
    ...plannerProduct,
    priceLabel: 'From $27',
    cta: 'Shop the planner',
    event: 'planner_shop_click',
  },
];

export function formatUsd(amount) {
  return `$${amount}`;
}

export function trackCommerce(event, payload = {}) {
  if (typeof window === 'undefined' || !event) return;
  try {
    window.dispatchEvent(new CustomEvent('alignment-commerce', { detail: { event, ...payload } }));
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, payload);
    }
  } catch {
    /* ignore */
  }
}
