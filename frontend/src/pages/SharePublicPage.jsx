import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { SitePageFooter, pillPrimary } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';

export default function SharePublicPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE}/public/share/${encodeURIComponent(token)}`, {
          timeout: 15000,
        });
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'This link is invalid or has no results yet.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className={type.page}>
      <SiteMarketingHeader />

      <main className="flex-1 max-w-lg mx-auto px-6 py-12 w-full">
        {loading && <p className={type.body}>Loading…</p>}
        {error && (
          <div className="rounded-2xl border border-alignment-accent/15 bg-alignment-surface px-5 py-4 text-sm text-alignment-accent">
            {error}
          </div>
        )}
        {data && !error && (
          <div className="text-center py-8">
            <p className={type.kicker}>Alignment snapshot</p>
            <h1 className={`mt-6 ${type.h1}`}>{data.displayName}</h1>
            {data.archetype && (
              <p className={`mt-3 ${type.body}`}>{data.archetype}</p>
            )}
            <div className="mt-8 flex flex-col items-center gap-1">
              <span className="font-display text-4xl sm:text-5xl font-medium tabular-nums text-alignment-accent">
                {typeof data.aqScore === 'number' ? Math.round(data.aqScore) : '—'}
              </span>
              <span className={type.muted}>AQ</span>
            </div>
            {data.primaryDomain && (
              <p className={`mt-6 ${type.body}`}>
                Primary focus: <span className="text-alignment-accent font-medium">{data.primaryDomain}</span>
              </p>
            )}
            <Link to="/signup" className={`${pillPrimary} mt-10`}>
              Get your own results
            </Link>
          </div>
        )}
      </main>
      <SitePageFooter />
    </div>
  );
}
