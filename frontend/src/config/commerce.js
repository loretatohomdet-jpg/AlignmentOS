import {
  shopClarityPrintUrl,
  shopClarityUrl,
  shopCollectionPrintUrl,
  shopCollectionUrl,
  shopDailyPrintUrl,
  shopDailyUrl,
  shopPlannerDigitalUrl,
  shopPlannerHeirloomUrl,
  shopPlannerUrl,
  shopQuarterlyPrintUrl,
  shopQuarterlyUrl,
  shopResetPrintUrl,
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

function digitalPrint(digitalPrice, printPrice) {
  return `Digital — $${digitalPrice}  ·  Print — $${printPrice}`;
}

export const resetProduct = {
  sku: 'alignment-reset',
  title: 'Reset',
  kicker: 'Fresh start',
  tagline: 'A fresh start for what matters.',
  body: 'A short guided reset for stepping back, clearing what no longer belongs, and deciding what matters next.',
  price: 12,
  path: '/shop/reset',
  checkoutUrl: checkout(shopResetUrl),
  image: companionImages.reset,
  imageAlt: 'Reset — A Fresh Start for What Matters',
  priceLabel: digitalPrint(12, 24),
  cta: 'Choose Digital',
  event: 'checkout_started',
  print: {
    sku: 'alignment-reset-print',
    name: 'Printed edition',
    price: 24,
    checkoutUrl: checkout(shopResetPrintUrl),
  },
};

export const clarityProduct = {
  sku: 'alignment-clarity',
  title: 'Clarity',
  kicker: 'Alignment Tool',
  tagline: 'See what matters.',
  body: 'A guided tool for stepping back from the noise, identifying what matters, and choosing a direction for this season.',
  price: 27,
  path: '/shop/alignment-clarity',
  checkoutUrl: checkout(shopClarityUrl),
  image: companionImages.clarity,
  imageAlt: 'Clarity — See What Matters',
  priceLabel: digitalPrint(27, 42),
  cta: 'Choose Digital',
  event: 'clarity_product_click',
  print: {
    sku: 'alignment-clarity-print',
    name: 'Printed edition',
    price: 42,
    checkoutUrl: checkout(shopClarityPrintUrl),
  },
};

export const dailyProduct = {
  sku: 'alignment-daily',
  title: 'Daily',
  kicker: 'Alignment Tool',
  tagline: 'Practice what matters.',
  body: 'A simple daily structure for carrying your priorities into the way you actually spend your time and attention.',
  price: 24,
  path: '/shop/daily',
  checkoutUrl: checkout(shopDailyUrl),
  image: '',
  imageAlt: 'Daily — Practice What Matters',
  priceLabel: digitalPrint(24, 38),
  cta: 'Choose Digital',
  event: 'checkout_started',
  print: {
    sku: 'alignment-daily-print',
    name: 'Printed edition',
    price: 38,
    checkoutUrl: checkout(shopDailyPrintUrl),
  },
};

export const quarterlyProduct = {
  sku: 'alignment-quarterly',
  title: 'Quarterly Review',
  kicker: 'Alignment Tool',
  tagline: 'Realign as life changes.',
  body: 'A guided seasonal review for noticing what is working, what has drifted, and what needs to change.',
  price: 18,
  path: '/shop/quarterly-review',
  checkoutUrl: checkout(shopQuarterlyUrl),
  image: companionImages.quarterly,
  imageAlt: 'Quarterly Review — Realign as life changes',
  priceLabel: digitalPrint(18, 32),
  cta: 'Choose Digital',
  event: 'checkout_started',
  print: {
    sku: 'alignment-quarterly-print',
    name: 'Printed edition',
    price: 32,
    checkoutUrl: checkout(shopQuarterlyPrintUrl),
  },
};

/** Clarity, Daily, Quarterly Review — not Reset, not the planner. */
export const alignmentTools = [clarityProduct, dailyProduct, quarterlyProduct];

export const toolsCollection = {
  sku: 'alignment-tools-collection',
  title: 'The Alignment Tools Collection',
  tagline: 'Clarity + Daily + Quarterly Review',
  body: 'Move through the full cycle: see what matters, practice what matters, and realign as life changes.',
  digital: {
    sku: 'alignment-tools-collection-digital',
    price: 54,
    checkoutUrl: checkout(shopCollectionUrl),
  },
  print: {
    sku: 'alignment-tools-collection-print',
    price: 89,
    checkoutUrl: checkout(shopCollectionPrintUrl),
  },
};

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
