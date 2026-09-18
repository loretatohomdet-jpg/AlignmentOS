import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { SitePageFooter, pillPrimary } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import { API_BASE } from '../config/apiBase';
import NotFoundPage from './NotFoundPage';

export default function ManagedPage() {
  const location = useLocation();
  const [page, setPage] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    setPage(undefined);
    axios
      .get(`${API_BASE}/public/pages/by-path`, { params: { path: location.pathname } })
      .then((res) => {
        if (!cancelled) setPage(res.data);
      })
      .catch(() => {
        if (!cancelled) setPage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!page) return undefined;
    const prev = document.title;
    document.title = `${page.title} — Alignment OS`;
    return () => {
      document.title = prev;
    };
  }, [page]);

  if (page === undefined) {
    return (
      <div className={type.page}>
        <SiteMarketingHeader />
        <main className="flex-1 px-6 py-16 text-alignment-accent/70">Loading…</main>
      </div>
    );
  }

  if (!page) {
    return (
      <div className={type.page}>
        <SiteMarketingHeader />
        <NotFoundPage />
        <SitePageFooter />
      </div>
    );
  }

  return (
    <div className={type.page}>
      <SiteMarketingHeader />
      <main className="flex-1 w-full scroll-mt-16">
        <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-16">
          {page.eyebrow ? <p className={type.kicker}>{page.eyebrow}</p> : null}
          <h1 className={`mt-6 ${type.h1} text-balance max-w-2xl`}>{page.headline || page.title}</h1>
          {page.subhead ? (
            <p className="mt-6 font-display italic text-xl sm:text-2xl text-alignment-primary leading-snug">
              {page.subhead}
            </p>
          ) : null}
          {page.body ? <p className={`mt-6 ${type.body} max-w-xl whitespace-pre-wrap`}>{page.body}</p> : null}
          {page.ctaHref && page.ctaLabel ? (
            <Link to={page.ctaHref} className={`${pillPrimary} mt-10 inline-flex`}>
              {page.ctaLabel}
            </Link>
          ) : null}
        </section>
      </main>
      <SitePageFooter />
    </div>
  );
}
