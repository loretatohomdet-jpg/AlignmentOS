import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';

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
