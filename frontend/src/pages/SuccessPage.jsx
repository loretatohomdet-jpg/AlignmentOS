import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { LOOP_PLACES, markJustPaid } from '../config/productLoop';
import { type } from '../config/siteType';
import { pillGhost, pillPrimary } from '../components/HomeMarketingChrome';

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function hasSavedScore(result) {
  return Boolean(result && (result.score != null || (result.pillarScores && Object.keys(result.pillarScores).length)));
}

/** After checkout, signup, or lead capture — one next step, not three competing doors. */
export default function SuccessPage() {
  const [params] = useSearchParams();
  const from = params.get('from') || '';
  const isCheckout = from === 'checkout';
  const [loading, setLoading] = useState(
    () => isCheckout && typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
  );
  const [hasScore, setHasScore] = useState(false);

  useEffect(() => {
    if (isCheckout) markJustPaid();
    if (!isCheckout || !authHeaders().Authorization) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    const read = async () => {
      const resultRes = await axios
        .get(`${API_BASE}/assessment/result`, { headers: authHeaders(), timeout: 5000 })
        .catch(() => ({ data: null }));
      if (cancelled) return;
      setHasScore(hasSavedScore(resultRes.data));
      setLoading(false);
    };
    read();
    return () => {
      cancelled = true;
    };
  }, [isCheckout]);

  const primary = isCheckout
    ? hasScore
      ? { to: '/practice', label: 'Begin Practice' }
      : { to: '/assessment', label: 'Take the diagnostic' }
    : { to: '/dashboard', label: 'Open your record' };

  const secondary = isCheckout
    ? { to: '/dashboard', label: 'See your record' }
    : { to: '/assessment', label: 'Diagnostic' };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center max-w-lg mx-auto">
      <p className={type.kicker}>{isCheckout ? 'Habit Engine' : 'Success'}</p>
      <h1 className={`mt-4 ${type.h1}`}>You&apos;re in</h1>
      <p className={`mt-4 ${type.body}`}>
        {isCheckout
          ? loading
            ? 'Payment received. Finding your next step…'
            : hasScore
              ? 'Payment received. Practice holds the day. Your score and map live on the Dashboard.'
              : 'Payment received. Take the diagnostic first — twelve minutes — so the map can fill. Then Practice holds the day.'
          : from === 'signup'
            ? 'Your account is ready. The Dashboard is your record. Practice is where the day is held.'
            : 'Next: sign in to save progress, or take the diagnostic if you haven’t yet.'}
      </p>

      {isCheckout && (
        <ul className="mt-8 w-full text-left space-y-4">
          {LOOP_PLACES.map((place) => (
            <li key={place.to}>
              <p className="text-sm font-medium text-alignment-accent">{place.label}</p>
              <p className="mt-0.5 text-sm text-alignment-accent/90 leading-relaxed">{place.body}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link to={primary.to} className={pillPrimary}>
          {primary.label}
        </Link>
        <Link to={secondary.to} className={pillGhost}>
          {secondary.label}
        </Link>
      </div>
    </div>
  );
}
