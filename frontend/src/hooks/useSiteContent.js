import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { HOME_COPY_DEFAULTS, HOME_HERO_DEFAULTS, STALE_HOME_COPY, mergeHomeSections } from '../config/homeCopy';
import { mergePageSections, sectionConfigForPath } from '../config/pageSections';
import { resolveCmsImageUrl } from '../config/cmsMedia';

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
  if (cms?.sections && typeof cms.sections === 'object' && cms.sections.cmsEdited) return true;
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

const HERO_DEFAULTS = HOME_HERO_DEFAULTS;

function replaceStale(value, key, fallback) {
  if (typeof value !== 'string') return fallback;
  if (!value.trim()) return fallback === '' ? '' : fallback;
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
  for (const key of Object.keys({ ...HERO_DEFAULTS, ...HOME_COPY_DEFAULTS, ...STALE_HOME_COPY })) {
    if (!(key in merged)) continue;
    const fallback = HERO_DEFAULTS[key] ?? HOME_COPY_DEFAULTS[key];
    merged[key] = replaceStale(merged[key], key, fallback);
  }
  // Domain titles are fixed product names — never let bad CMS saves replace them.
  merged.domainIdentity = HOME_COPY_DEFAULTS.domainIdentity;
  merged.domainPurpose = HOME_COPY_DEFAULTS.domainPurpose;
  merged.domainMindset = HOME_COPY_DEFAULTS.domainMindset;
  merged.domainHabits = HOME_COPY_DEFAULTS.domainHabits;
  merged.domainEnvironment = HOME_COPY_DEFAULTS.domainEnvironment;
  merged.domainExecution = HOME_COPY_DEFAULTS.domainExecution;
  merged.domainIdentityTag = HOME_COPY_DEFAULTS.domainIdentityTag;
  merged.domainPurposeTag = HOME_COPY_DEFAULTS.domainPurposeTag;
  merged.domainMindsetTag = HOME_COPY_DEFAULTS.domainMindsetTag;
  merged.domainHabitsTag = HOME_COPY_DEFAULTS.domainHabitsTag;
  merged.domainEnvironmentTag = HOME_COPY_DEFAULTS.domainEnvironmentTag;
  merged.domainExecutionTag = HOME_COPY_DEFAULTS.domainExecutionTag;
  return merged;
}

/** Hero + sections for any path registered in pageSections.js */
export function marketingPageCopy(path, cms, heroDefaults) {
  const hero = pageCopy(cms, heroDefaults);
  const config = sectionConfigForPath(path);
  if (!config) return hero;
  const sections = wasEditedInAdmin(cms)
    ? mergePageSections(path, cms?.sections)
    : mergePageSections(path, null);
  return { ...hero, ...sections };
}

/** Site footer strings (stored on the homepage sections). */
export function siteFooterCopy(cms) {
  const sections = wasEditedInAdmin(cms) ? mergeHomeSections(cms?.sections) : mergeHomeSections(null);
  return {
    tagline: sections.footerTagline,
    copyright: sections.footerCopyright,
  };
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
    title: base.sku === 'alignment-reset' && row.name === 'Reset' ? base.title : row.name || base.title,
    name: row.name || base.name,
    kicker: row.kicker || base.kicker,
    tagline: row.tagline || base.tagline,
    body: row.body || base.body,
    image: resolveCmsImageUrl(row.image || base.image) || base.image,
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
