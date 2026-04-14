import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import BrandLogo from '../components/BrandLogo';
import { API_BASE } from '../config/apiBase';

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
    <div className="min-h-screen bg-alignment-surface flex flex-col">
      <header className="border-b border-alignment-accent/[0.06] px-6 py-4 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary">
          <BrandLogo compact iconHeightPx={32} />
        </Link>
        <Link
          to="/assessment"
          className="text-sm font-medium text-alignment-accent/80 hover:text-alignment-accent"
        >
          Take the diagnostic
        </Link>
      </header>

      <main className="flex-1 max-w-lg mx-auto px-6 py-12 w-full">
        {loading && <p className="text-alignment-accent/70">Loading…</p>}
        {error && (
          <div className="rounded-2xl border border-alignment-accent/15 bg-alignment-surface px-5 py-4 text-sm text-alignment-accent">
            {error}
          </div>
        )}
        {data && !error && (
          <div className="rounded-3xl border border-alignment-accent/10 bg-alignment-surface shadow-apple p-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-alignment-accent/45">Alignment snapshot</p>
            <p className="mt-4 text-lg font-semibold text-alignment-accent">{data.displayName}</p>
            {data.archetype && (
              <p className="mt-2 text-sm text-alignment-accent/80">{data.archetype}</p>
            )}
            <div className="mt-8 flex flex-col items-center gap-1">
              <span className="text-4xl font-semibold tabular-nums text-alignment-accent">
                {typeof data.aqScore === 'number' ? Math.round(data.aqScore) : '—'}
              </span>
              <span className="text-xs uppercase tracking-wider text-alignment-accent/50">AQ</span>
            </div>
            {data.primaryDomain && (
              <p className="mt-6 text-sm text-alignment-accent/70">
                Primary focus: <span className="text-alignment-accent font-medium">{data.primaryDomain}</span>
              </p>
            )}
            <Link
              to="/signup"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-alignment-primary text-white text-sm font-medium px-6 py-3 hover:bg-alignment-primary/90"
            >
              Get your own results
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
