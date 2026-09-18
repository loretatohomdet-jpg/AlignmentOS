import {
  shopClarityPrintUrl,
  shopClarityUrl,
  shopPlannerHeirloomUrl,
  shopPlannerUrl,
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

/** Single source for shop prices and Shopify checkout URLs. */
export const plannerEditions = [
  {
    sku: 'planner-standard',
    name: 'Paper Edition',
    price: 48,
    note: 'For those who would rather keep this work on paper than on a screen.',
    image: plannerImages.paperCover,
    imageAlt: 'Life of Purpose Planner, paper edition, with ribbon markers',
    checkoutUrl: checkout(shopPlannerUrl),
  },
  {
    sku: 'planner-heirloom',
    name: 'Sleeved Edition',
    price: 168,
    note: 'The luxury edition. A signature cover and slipcase, made in Florence, Italy.',
    origin: 'Made in Florence, Italy',
    image: plannerImages.sleevedDesk,
    imageAlt: 'The sleeved Life of Purpose Planner, held at a desk',
    checkoutUrl: checkout(shopPlannerHeirloomUrl || shopPlannerUrl),
  },
];

export const plannerProduct = {
  sku: 'planner',
  title: 'Life of Purpose Planner',
  kicker: 'Planner',
  tagline: 'Plan from what matters.',
  body: 'Not another place to collect more tasks. A thoughtful planner for deciding what matters, making room for it, and carrying those priorities into your day — on paper, or in the sleeved edition made in Florence.',
  priceFrom: 48,
  path: '/planner',
  checkoutUrl: checkout(shopPlannerUrl),
  image: plannerImages.paperLifestyle,
  imageAlt: 'Life of Purpose Planner on a sunlit table, beside a pen and an open book',
};

export const clarityProduct = {
  sku: 'alignment-clarity',
  title: 'Alignment Clarity',
  kicker: 'Digital',
  tagline: 'Get clear on what matters now.',
  body: 'A guided reflection tool for sorting through competing priorities and deciding what deserves your attention.',
  price: 27,
  path: '/shop/alignment-clarity',
  checkoutUrl: checkout(shopClarityUrl),
  print: {
    sku: 'alignment-clarity-print',
    name: 'Printed edition',
    price: 47,
    checkoutUrl: checkout(shopClarityPrintUrl),
  },
};

export const resetProduct = {
  sku: 'alignment-reset',
  title: 'Alignment Reset',
  kicker: 'Free',
  tagline: 'When life feels scattered, start here.',
  body: 'A short guided reset for noticing what is creating friction and choosing one meaningful next step.',
  price: 0,
  path: '/reset',
};

export const shopToolCards = [
  {
    ...clarityProduct,
    priceLabel: 'Digital — $27',
    cta: 'Get Clarity',
    event: 'clarity_product_click',
  },
  {
    ...plannerProduct,
    priceLabel: 'From $48',
    cta: 'Shop the planner',
    event: 'planner_shop_click',
  },
  {
    ...resetProduct,
    priceLabel: 'Free',
    cta: 'Start the Reset',
    event: 'shop_all_click',
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
