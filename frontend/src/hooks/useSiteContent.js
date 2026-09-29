import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { HOME_COPY_DEFAULTS, mergeHomeSections } from '../config/homeCopy';

export function useSitePage(path) {
  const [page, setPage] = useState(null);

  useEffect(() => {
    if (!path) return undefined;
    let cancelled = false;
    axios
      .get(`${API_BASE}/public/pages/by-path`, { params: { path } })
      .then((res) => {
        if (!cancelled) setPage(res.data);
      })
      .catch(() => {
        if (!cancelled) setPage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return page;
}

function wasEditedInAdmin(cms) {
  if (!cms?.createdAt || !cms?.updatedAt) return false;
  return new Date(cms.updatedAt) - new Date(cms.createdAt) > 2000;
}

/** Overlay Admin copy after someone saves. Untouched seed rows keep the written fallback. */
export function pageCopy(cms, defaults) {
  const edited = wasEditedInAdmin(cms);
  const pick = (key) => {
    if (!edited) return defaults[key];
    const value = cms?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    return defaults[key];
  };
  return {
    eyebrow: pick('eyebrow'),
    headline: pick('headline'),
    subhead: pick('subhead'),
    body: pick('body'),
    ctaLabel: pick('ctaLabel'),
    ctaHref: pick('ctaHref'),
    title: pick('title'),
  };
}

const HERO_DEFAULTS = {
  headline: 'Know what matters. Make room for it.',
  subhead: 'See where your life is holding, where it is thin, and what deserves your attention now.',
  body: 'Free · 12 minutes · No account',
  ctaLabel: 'Take the Assessment',
  ctaHref: '/assessment',
};

/** Previous shipped homepage lines. An Admin save of these should still pick up the new path. */
const STALE_HOME_COPY = {
  headline: [
    'Know what matters. Know what to do next.',
    'See which part of your life is off, and start one practice for it.',
  ],
  subhead: ['A system for becoming whole.', 'You do not have to turn a score into a plan.'],
  body: [
    'Six domains. One Alignment Score. A clearer path forward.',
    'The assessment names the thin place. Alignment OS starts the practice.',
  ],
  ctaLabel: ['Take the free assessment'],
  quote: ['You need structure beneath the effort — not more effort.'],
  stepsHeading: ['Four steps. One system.'],
  step1: ['Diagnostic'],
  step2: ['Identity anchors'],
  step3: ['Habit engine'],
  step4: ['Weekly review'],
};

function replaceStale(value, key, fallback) {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  const stale = STALE_HOME_COPY[key];
  const list = Array.isArray(stale) ? stale : stale ? [stale] : [];
  if (list.includes(value.trim())) return fallback;
  return value.trim();
}

/** Hero fields + every other homepage interface string. */
export function homePageCopy(cms) {
  const hero = pageCopy(cms, HERO_DEFAULTS);
  const sections = wasEditedInAdmin(cms) ? mergeHomeSections(cms?.sections) : mergeHomeSections(null);
  const merged = { ...hero, ...sections };
  for (const key of Object.keys(STALE_HOME_COPY)) {
    if (!(key in merged)) continue;
    const fallback = HERO_DEFAULTS[key] ?? HOME_COPY_DEFAULTS[key];
    merged[key] = replaceStale(merged[key], key, fallback);
  }
  return merged;
}

export function useShopCatalog() {
  const [offers, setOffers] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE}/public/shop`)
      .then((res) => {
        if (!cancelled) setOffers(res.data);
      })
      .catch(() => {
        if (!cancelled) setOffers(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return offers;
}

export function mergeProduct(base, offers) {
  if (!base || !offers?.length) return base;
  const row = offers.find((offer) => offer.sku === base.sku);
  if (!row) return base;
  return {
    ...base,
    title: row.name || base.title,
    name: row.name || base.name,
    kicker: row.kicker || base.kicker,
    tagline: row.tagline || base.tagline,
    body: row.body || base.body,
    image: row.image || base.image,
    price: row.digitalPrice ?? base.price,
    checkoutUrl: row.digitalUrl || base.checkoutUrl,
    print: base.print
      ? {
          ...base.print,
          price: row.printPrice ?? base.print.price,
          checkoutUrl: row.printUrl || base.print.checkoutUrl,
        }
      : base.print,
    priceLabel:
      row.digitalPrice != null && row.printPrice != null
        ? `Digital — $${row.digitalPrice}  ·  Print — $${row.printPrice}`
        : base.priceLabel,
    hidden: row.isPublished === false,
  };
}
