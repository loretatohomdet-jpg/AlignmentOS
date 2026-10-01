import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, networkErrorUserMessage } from '../config/apiBase';
import { insightFromResult, planFromInsight } from '../config/domainInsight';
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

  const doneCount = habits.filter((h) => h.completedToday).length;
  const streak = habits.reduce((max, h) => Math.max(max, Number(h.streak) || 0), 0);
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 pb-20 pt-8 sm:pt-12">
      {claimNote ? (
        <p
          className="mb-6 rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-sm text-alignment-accent/90 leading-relaxed"
          role="status"
        >
          {claimNote}
        </p>
      ) : null}
      {error ? (
        <p className="mb-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-alignment-accent/55">{todayLabel}</p>
          <h1 className={`mt-2 ${type.h1}`}>My Plan</h1>
          <p className="mt-2 font-display text-lg text-alignment-accent">Choose what matters now.</p>
        </div>
        <p className="shrink-0 rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-2 text-sm text-alignment-accent">
          This week
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.7fr)] lg:items-start">
        <div>
          <section className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface/80 px-5 py-6 sm:px-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-alignment-accent/55">Your primary focus</p>
            <h2 className="mt-3 font-display text-2xl font-medium text-alignment-accent leading-snug">{plan.focusTitle}</h2>
            <p className="mt-2 text-sm text-alignment-accent/90 leading-relaxed">{plan.focusBody}</p>
            <p className="mt-3 text-sm text-alignment-accent/65">From {plan.label}.</p>
          </section>

          <section className="mt-8">
            <h2 className="font-display text-xl font-medium text-alignment-accent">Supporting priorities</h2>
            <ul className="mt-4 space-y-3">
              {plan.priorities.map((item) => (
                <li key={item.id} className="flex items-center gap-3 rounded-xl border border-alignment-accent/10 bg-white px-4 py-3">
                  <button
                    type="button"
                    disabled={!habits.some((h) => h.id === item.id) || item.completedToday || completingId === item.id}
                    onClick={() => markDone(item.id)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      item.completedToday
                        ? 'border-alignment-primary bg-alignment-primary text-white'
                        : 'border-alignment-accent/25 text-transparent'
                    } disabled:opacity-60`}
                    aria-label={item.completedToday ? `${item.title} held` : `Mark ${item.title} done`}
                  >
                    <span aria-hidden className="text-[11px]">✓</span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-alignment-accent">{item.title}</p>
                    <p className="text-sm text-alignment-accent/65">{item.cadence}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-2xl border border-alignment-accent/10 bg-alignment-surface/70 px-5 py-5">
            <h2 className="font-display text-xl font-medium text-alignment-accent">What can wait</h2>
            <p className="mt-3 text-sm text-alignment-accent/90 leading-relaxed">{plan.whatCanWait}</p>
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <section className="rounded-2xl border border-alignment-accent/10 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-medium text-alignment-accent">This week</h2>
              <Link to="/practice#assigned-practice" className="text-sm text-alignment-accent/70 hover:text-alignment-accent">
                Open Daily →
              </Link>
            </div>
            {plan.practice?.title ? (
              <p className="mt-4 text-sm text-alignment-accent">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-alignment-accent/55">Practice</span>
                <span className="mt-1 block font-medium">{plan.practice.title}</span>
              </p>
            ) : null}
            <p className="mt-4 text-sm text-alignment-accent/80">
              {habits.length ? `${doneCount} of ${habits.length} completed` : 'Practices appear here once Daily is open.'}
            </p>
            {streak > 0 ? <p className="mt-1 text-sm text-alignment-accent/80">{streak} day streak</p> : null}
          </section>

          <section className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface/80 px-5 py-6">
            <p className="font-display text-lg leading-snug text-alignment-accent">Less noise. More of what matters.</p>
            {plan.why ? <p className="mt-3 text-sm text-alignment-accent/75 leading-relaxed">{plan.why}</p> : null}
          </section>

          <section className="rounded-2xl border border-alignment-accent/10 bg-white p-5">
            <h2 className="font-display text-lg font-medium text-alignment-accent">Need a reset?</h2>
            <p className="mt-2 text-sm text-alignment-accent/80 leading-relaxed">
              If things feel off, return to your Alignment Map and adjust your focus.
            </p>
            <Link to="/alignment-map" className={`${pillPrimary} mt-5`}>
              Open My Map →
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
