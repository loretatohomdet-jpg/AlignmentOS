import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, networkErrorUserMessage } from '../config/apiBase';
import { insightFromResult, planFromInsight } from '../config/domainInsight';
import { formationTeachableUrl } from '../config/externalLinks';
import { type } from '../config/siteType';
import { pillPrimary, pillGhost } from '../components/HomeMarketingChrome';
import { usePageTitle } from '../hooks/usePageTitle';
import { consumeClaimNote } from '../utils/guestClaim';

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function PlanPage() {
  const navigate = useNavigate();
  usePageTitle('My Plan — Alignment OS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimNote, setClaimNote] = useState('');
  const [result, setResult] = useState(null);
  const [habits, setHabits] = useState([]);
  const [completingId, setCompletingId] = useState(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login?returnTo=/plan', { replace: true });
      return;
    }
    setError(null);
    try {
      const [resultRes, habitsRes] = await Promise.all([
        axios.get(`${API_BASE}/assessment/result`, { headers: authHeaders() }).catch((e) => {
          if (e.response?.status === 404) return { data: null };
          throw e;
        }),
        axios.get(`${API_BASE}/habits/stats`, { headers: authHeaders() }).catch(() => ({ data: null })),
      ]);
      setResult(resultRes.data);
      setHabits(Array.isArray(habitsRes.data?.habits) ? habitsRes.data.habits : []);
    } catch (e) {
      if (e.response?.status === 401) {
        navigate('/login?returnTo=/plan', { replace: true });
        return;
      }
      setError(
        e.response?.data?.message ||
          (e.code === 'ERR_NETWORK' ? networkErrorUserMessage() : 'Could not load your plan.')
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    setClaimNote(consumeClaimNote());
    load();
  }, [load]);

  const insight = insightFromResult(result, habits[0]);
  const plan = planFromInsight(insight, habits);

  const markDone = async (activeHabitId) => {
    if (!activeHabitId || completingId) return;
    setCompletingId(activeHabitId);
    try {
      await axios.post(`${API_BASE}/habits/complete`, { activeHabitId }, { headers: authHeaders() });
      setHabits((list) => list.map((h) => (h.id === activeHabitId ? { ...h, completedToday: true } : h)));
    } catch (e) {
      setError(e.response?.data?.message || 'Could not mark this practice done.');
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="font-display font-medium text-alignment-accent/65">Loading your plan…</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className={type.kicker}>My Plan</p>
        <h1 className={`mt-4 ${type.h1}`}>Your plan starts with the assessment.</h1>
        <p className={`mt-4 ${type.body}`}>
          {claimNote ||
            error ||
            'Take the free diagnostic. It names the thin place and builds this plan for you.'}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/assessment" className={pillPrimary}>
            Take the Assessment
          </Link>
          {claimNote ? (
            <Link to="/login?returnTo=/plan" className={pillGhost}>
              Sign in with report email
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-20 pt-10 sm:pt-14">
      {claimNote ? (
        <p
          className="mb-6 rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-sm text-alignment-accent/90 leading-relaxed"
          role="status"
        >
          {claimNote}
        </p>
      ) : null}
      <p className={type.kicker}>My Plan</p>
      <h1 className={`mt-4 ${type.h1}`}>A calmer, more aligned you.</h1>
      <p className={`mt-4 ${type.body}`}>
        One focus. A few key priorities. A simpler path forward — from {plan.label}.
      </p>

      {error ? (
        <p className="mt-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      ) : null}

      <section className="mt-10 rounded-2xl border border-alignment-primary/20 bg-alignment-primary/[0.08] px-6 py-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-primary">Primary focus</p>
        <h2 className="mt-3 font-display text-2xl font-medium text-alignment-accent leading-snug">{plan.focusTitle}</h2>
        <p className="mt-3 text-sm text-alignment-accent/90 leading-relaxed">{plan.focusBody}</p>
      </section>

      <section className="mt-10">
        <p className={type.kicker}>This week</p>
        <h2 className={`mt-3 ${type.h2}`}>Supporting priorities</h2>
        <ul className="mt-6 divide-y divide-alignment-accent/[0.08] border-t border-b border-alignment-accent/[0.08]">
          {plan.priorities.map((item) => (
            <li key={item.id} className="flex items-start gap-4 py-5">
              <button
                type="button"
                disabled={!habits.some((h) => h.id === item.id) || item.completedToday || completingId === item.id}
                onClick={() => markDone(item.id)}
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  item.completedToday
                    ? 'border-alignment-primary bg-alignment-primary text-white'
                    : 'border-alignment-accent/20 text-transparent'
                } disabled:opacity-60`}
                aria-label={item.completedToday ? `${item.title} held` : `Mark ${item.title} done`}
              >
                <span aria-hidden>✓</span>
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-alignment-accent">{item.title}</p>
                <p className="mt-1 text-sm text-alignment-accent/75 leading-relaxed">{item.cadence}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-6 py-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/65">What can wait</p>
        <p className="mt-3 text-sm text-alignment-accent/90 leading-relaxed">{plan.whatCanWait}</p>
      </section>

      <section className="mt-10 rounded-2xl border border-alignment-accent/10 bg-alignment-surfaceSoft/90 px-6 py-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-primary">Why this matters</p>
        <p className="mt-3 text-sm text-alignment-accent/90 leading-relaxed">{plan.why}</p>
        <p className="mt-4 font-display text-lg font-medium text-alignment-accent leading-snug">
          Less noise. More of what matters.
        </p>
      </section>

      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        <Link to="/practice#assigned-practice" className={pillPrimary}>
          Open Daily →
        </Link>
        <a
          href={formationTeachableUrl({ domain: plan.domain })}
          target="_blank"
          rel="noopener noreferrer"
          className={pillGhost}
        >
          Go deeper in Formation
        </a>
      </div>
    </div>
  );
}
