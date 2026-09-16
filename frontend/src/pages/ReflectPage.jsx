import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, networkErrorUserMessage } from '../config/apiBase';
import { DOMAIN_LABELS, DOMAIN_ORDER } from '../constants/domains';

import { usePageTitle } from '../hooks/usePageTitle';
import { type } from '../config/siteType';

const LIBRARY = {
  IDENTITY: [
    'Write your one-sentence mission.',
    'Review your commitments against it.',
    'Say one true thing you would normally soften.',
  ],
  PURPOSE: [
    'Name what this season is for.',
    'Choose one meaningful task before the day starts.',
    'Revisit the season monthly.',
  ],
  MINDSET: [
    'Write the sentence you tell yourself when something fails.',
    'Ask where it came from.',
    'Replace it with the accurate version.',
  ],
  HABITS: [
    'Keep one repetition for thirty days.',
    'Anchor it to something already fixed.',
    'Note weekly what it makes easier.',
  ],
  ENVIRONMENT: [
    'Reset one surface each evening.',
    'A walk without the phone.',
    'One room that stays quiet.',
    'Phone outside the bedroom.',
  ],
  EXECUTION: [
    'Protect the good hour.',
    'Finish before starting.',
    'Sunday calendar review.',
    'Name tomorrow’s first task tonight.',
  ],
};

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ReflectPage() {
  const navigate = useNavigate();
  usePageTitle('Review — Alignment OS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [primaryDomain, setPrimaryDomain] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login?returnTo=/reflect', { replace: true });
      return;
    }
    Promise.all([
      axios.get(`${API_BASE}/assessment/result`, { headers: authHeaders() }).catch((e) => {
        if (e.response?.status === 404) return { data: null };
        throw e;
      }),
      axios.get(`${API_BASE}/habits/stats`, { headers: authHeaders() }).catch(() => ({ data: null })),
    ])
      .then(([resultRes, statsRes]) => {
        const fromScore = String(resultRes.data?.primaryDomain || '').toUpperCase();
        const fromHabits = String(statsRes.data?.habits?.[0]?.pillar || '').toUpperCase();
        const key = DOMAIN_ORDER.includes(fromScore) ? fromScore : fromHabits;
        setPrimaryDomain(DOMAIN_ORDER.includes(key) ? key : null);
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          navigate('/login?returnTo=/reflect', { replace: true });
          return;
        }
        if (e.response?.status !== 404) {
          setError(
            e.response?.data?.message ||
              (e.code === 'ERR_NETWORK' ? networkErrorUserMessage() : 'Could not load your primary gap.')
          );
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="font-display italic text-alignment-accent/45">Loading the library…</p>
      </div>
    );
  }

  const gapLabel = primaryDomain ? DOMAIN_LABELS[primaryDomain] : null;

  return (
    <div className="mx-auto w-full max-w-xl px-6 pb-28 pt-10 sm:pt-12">
      <p className={type.kicker}>Practice library</p>
      <h1 className={`mt-4 ${type.h1}`}>
        Few, and chosen.
      </h1>
      <p className={`mt-3 ${type.body}`}>
        One or two at a time. The system prescribes less, better.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 border-l-2 border-alignment-primary bg-alignment-surfaceSoft/80 px-5 py-5">
        {gapLabel ? (
          <p className="text-[16px] leading-relaxed text-alignment-accent/70">
            Your primary gap is <span className="font-semibold text-alignment-accent">{gapLabel}.</span> Start there, with
            one practice.{' '}
            <Link to="/practice" className="underline underline-offset-2 hover:text-alignment-accent">
              Begin today.
            </Link>
          </p>
        ) : (
          <p className="text-[16px] leading-relaxed text-alignment-accent/70">
            Take the Alignment Score to name your primary gap.{' '}
            <Link to="/assessment" className="underline underline-offset-2 hover:text-alignment-accent">
              Begin free.
            </Link>
          </p>
        )}
      </div>

      {DOMAIN_ORDER.map((key) => {
        const isFocus = key === primaryDomain;
        return (
          <section key={key} className="mt-10">
            <p
              className={`text-[10px] font-medium uppercase tracking-[0.2em] ${
                isFocus ? 'text-alignment-primary' : 'text-alignment-accent/40'
              }`}
            >
              {DOMAIN_LABELS[key]}
            </p>
            <ul className="mt-3 border-t border-alignment-accent/[0.10]">
              {LIBRARY[key].map((line) => (
                <li
                  key={line}
                  className="border-b border-alignment-accent/[0.10] py-4 text-[16px] leading-snug text-alignment-accent"
                >
                  {line}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
