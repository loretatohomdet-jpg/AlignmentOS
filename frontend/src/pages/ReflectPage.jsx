import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, networkErrorUserMessage } from '../config/apiBase';
import { DOMAIN_LABELS, DOMAIN_ORDER } from '../constants/domains';
import { pillPrimary } from '../components/HomeMarketingChrome';
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

const WEEKLY_PROMPTS = [
  'What worked well this week?',
  'What was challenging?',
  'What will you do differently next week?',
];

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
  const [answers, setAnswers] = useState(['', '', '']);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const saveReview = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await axios.post(
        `${API_BASE}/me/reflections`,
        { type: 'WEEKLY', answers },
        { headers: authHeaders() }
      );
      setSaved(true);
      setAnswers(['', '', '']);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this review.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="font-display font-medium text-alignment-accent/65">Loading review…</p>
      </div>
    );
  }

  const gapLabel = primaryDomain ? DOMAIN_LABELS[primaryDomain] : null;

  return (
    <div className="mx-auto w-full max-w-xl px-6 pb-16 pt-10 sm:pt-12">
      <p className={type.kicker}>Weekly Review</p>
      <h1 className={`mt-4 ${type.h1}`}>Reflect. Adjust. Keep going.</h1>
      <p className={`mt-3 ${type.body}`}>
        {gapLabel
          ? `Your primary gap is ${gapLabel}. Notice what helped this week — then return to My Plan.`
          : 'Step back once a week. Keep what helped. Adjust what did not.'}
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={saveReview} className="mt-10 space-y-6">
        {WEEKLY_PROMPTS.map((prompt, i) => (
          <div key={prompt}>
            <label className="block text-sm font-medium text-alignment-accent mb-2">
              {i + 1}. {prompt}
            </label>
            <textarea
              rows={3}
              value={answers[i]}
              onChange={(e) =>
                setAnswers((prev) => {
                  const next = [...prev];
                  next[i] = e.target.value;
                  return next;
                })
              }
              className="w-full rounded-xl border border-alignment-accent/12 bg-apple-surface-muted px-4 py-3 text-sm text-alignment-accent focus:outline-none focus:ring-2 focus:ring-alignment-accent/10"
            />
          </div>
        ))}
        <button type="submit" disabled={saving} className={`${pillPrimary} disabled:opacity-50`}>
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save Review →'}
        </button>
      </form>

      <p className="mt-8 text-sm text-alignment-accent/90">
        <Link to="/plan" className="underline underline-offset-2 hover:text-alignment-accent">
          Open My Plan
        </Link>
        {' · '}
        <Link to="/practice" className="underline underline-offset-2 hover:text-alignment-accent">
          Open Daily
        </Link>
      </p>

      <div className="mt-16 border-t border-alignment-accent/[0.08] pt-12">
        <p className={type.kicker}>Practice library</p>
        <h2 className={`mt-4 ${type.h2}`}>Few, and chosen.</h2>
        <p className={`mt-3 ${type.body}`}>Lines to return to when you need one — not the day itself.</p>

        {DOMAIN_ORDER.map((key) => {
          const isFocus = key === primaryDomain;
          return (
            <section key={key} className="mt-10">
              <p
                className={`text-[10px] font-medium uppercase tracking-[0.2em] ${
                  isFocus ? 'text-alignment-primary' : 'text-alignment-accent/70'
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
    </div>
  );
}
