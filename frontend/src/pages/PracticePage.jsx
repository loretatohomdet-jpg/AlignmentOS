import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, networkErrorUserMessage } from '../config/apiBase';
import { DOMAIN_LABELS } from '../constants/domains';
import { isPaidPlan } from '../utils/plan';

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function WeekDots({ last7Days, large }) {
  return (
    <div className="flex items-center gap-1.5" aria-label="Last seven days">
      {(last7Days || []).map((d) => (
        <span
          key={d.date}
          title={d.date}
          className={`rounded-full ${large ? 'h-2.5 w-2.5' : 'h-1.5 w-1.5'} ${
            d.done ? 'bg-alignment-primary' : 'bg-transparent ring-1 ring-inset ring-alignment-accent/20'
          }`}
        />
      ))}
    </div>
  );
}

export default function PracticePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paid, setPaid] = useState(false);
  const [habits, setHabits] = useState([]);
  const [prompt, setPrompt] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login?returnTo=/practice', { replace: true });
      return;
    }
    setError(null);
    try {
      const [meRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/me`, { headers: authHeaders() }),
        axios.get(`${API_BASE}/habits/stats`, { headers: authHeaders() }),
      ]);
      setPaid(isPaidPlan(meRes.data?.plan));
      setHabits(Array.isArray(statsRes.data?.habits) ? statsRes.data.habits : []);
      setPrompt(statsRes.data?.prompt || null);
    } catch (e) {
      if (e.response?.status === 401) {
        navigate('/login?returnTo=/practice', { replace: true });
        return;
      }
      setError(
        e.response?.data?.message ||
          (e.code === 'ERR_NETWORK' ? networkErrorUserMessage() : 'Could not load the Habit Engine.')
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const markDone = async (habit) => {
    if (habit.completedToday || completingId) return;
    setCompletingId(habit.id);
    try {
      await axios.post(`${API_BASE}/habits/complete`, { activeHabitId: habit.id }, { headers: authHeaders() });
      await load();
    } catch (e) {
      if (e.response?.status === 402) {
        navigate('/pricing');
        return;
      }
      setError(e.response?.data?.message || 'Could not save today’s practice.');
    } finally {
      setCompletingId(null);
    }
  };

  const focusId =
    prompt?.habitId || habits.find((h) => !h.completedToday)?.id || habits[0]?.id || null;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <p className="font-display italic text-alignment-accent/50">Loading today’s structure…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-alignment-primary/70">Today</p>
      <h1 className="mt-4 font-display text-[2rem] sm:text-[2.55rem] font-medium text-alignment-accent tracking-tight leading-[1.15]">
        Today’s structure
      </h1>
      <p className="mt-4 font-display italic text-lg text-alignment-primary/90 leading-snug max-w-md">
        Three practices. One hold.
      </p>

      {error && (
        <p className="mt-8 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      )}

      {prompt && (
        <section className="mt-12 border-l-[2px] border-alignment-primary pl-5 sm:pl-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-alignment-primary/80">
            {prompt.kind === 'adjust' ? 'Needs adjustment' : prompt.kind === 'hold' ? 'Holding' : 'Prompt'}
          </p>
          <h2 className="mt-3 font-display text-[1.45rem] sm:text-[1.7rem] font-medium text-alignment-accent tracking-tight leading-snug">
            {prompt.title}
          </h2>
          <p className="mt-3 text-sm text-alignment-accent/70 leading-relaxed max-w-lg">{prompt.body}</p>
        </section>
      )}

      {!paid && (
        <p className="mt-10 text-sm text-alignment-accent/55 leading-relaxed max-w-lg">
          Daily check-in is included.{' '}
          <Link to="/pricing" className="text-alignment-accent underline-offset-4 hover:underline">
            Weekly review is on the plan.
          </Link>
        </p>
      )}

      <div className="mt-12 space-y-3">
        {habits.length === 0 ? (
          <div className="py-2">
            <p className="font-display text-xl text-alignment-accent">No practices yet</p>
            <p className="mt-3 text-sm text-alignment-accent/65 leading-relaxed max-w-md">
              Finish the diagnostic while signed in. Three practices from your lowest domain will appear here.
            </p>
            <Link
              to="/assessment"
              className="mt-8 inline-flex rounded-sm bg-alignment-primary text-white text-[10px] font-medium uppercase tracking-[0.18em] px-6 py-3 hover:bg-alignment-primary/90"
            >
              Take diagnostic
            </Link>
          </div>
        ) : (
          habits.map((habit) => {
            const focused = habit.id === focusId;
            const held = habit.completedToday;
            return (
              <article
                key={habit.id}
                className={
                  focused
                    ? 'rounded-sm border border-alignment-accent/[0.08] bg-alignment-surfaceSoft px-6 py-8 sm:px-8 sm:py-10'
                    : 'rounded-sm px-1 py-5 sm:px-2 border-b border-alignment-accent/[0.06] last:border-b-0'
                }
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 max-w-xl">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-alignment-accent/40">
                      {DOMAIN_LABELS[habit.pillar] || habit.pillar}
                      {focused ? '' : ` · Level ${habit.level}`}
                    </p>
                    <h3
                      className={
                        focused
                          ? 'mt-2 font-display text-[1.45rem] sm:text-[1.65rem] font-medium text-alignment-accent tracking-tight leading-snug'
                          : 'mt-1.5 text-[0.95rem] font-medium text-alignment-accent/85'
                      }
                    >
                      {habit.title}
                    </h3>
                    {habit.description && focused && (
                      <p className="mt-3 text-sm text-alignment-accent/65 leading-relaxed">{habit.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => markDone(habit)}
                    disabled={held || completingId === habit.id}
                    className={
                      focused && !held
                        ? 'shrink-0 rounded-sm bg-alignment-primary text-white text-[10px] font-medium uppercase tracking-[0.16em] px-5 py-2.5 hover:bg-alignment-primary/90 disabled:opacity-50'
                        : 'shrink-0 rounded-sm border border-alignment-accent/15 text-alignment-accent/80 text-[10px] font-medium uppercase tracking-[0.16em] px-4 py-2 hover:border-alignment-primary/40 disabled:opacity-45'
                    }
                  >
                    {held ? 'Held' : completingId === habit.id ? '…' : 'Mark done'}
                  </button>
                </div>
                <div className={`flex flex-wrap items-center justify-between gap-3 ${focused ? 'mt-8' : 'mt-3'}`}>
                  <WeekDots last7Days={habit.last7Days} large={focused} />
                  <p className="text-[11px] text-alignment-accent/40 tabular-nums">
                    {habit.completedLast7}/7
                    {habit.streak > 0 ? ` · ${habit.streak}-day` : ''}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>

      <p className="mt-14 text-sm text-alignment-accent/45">
        {paid ? (
          <Link to="/reflect" className="text-alignment-accent/70 hover:text-alignment-accent hover:underline">
            Weekly review
          </Link>
        ) : (
          <Link to="/pricing" className="text-alignment-accent/70 hover:text-alignment-accent hover:underline">
            Weekly review
          </Link>
        )}
        <span className="mx-2 text-alignment-accent/25">·</span>
        <Link to="/dashboard" className="hover:text-alignment-accent hover:underline">
          Dashboard
        </Link>
      </p>
    </div>
  );
}
