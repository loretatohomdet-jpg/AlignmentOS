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

function WeekDots({ last7Days }) {
  return (
    <div className="flex items-center gap-1.5" aria-label="Last seven days">
      {(last7Days || []).map((d) => (
        <span
          key={d.date}
          title={d.date}
          className={`h-2 w-2 rounded-full ${d.done ? 'bg-alignment-primary' : 'bg-alignment-accent/15'}`}
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
    if (!paid || habit.completedToday || completingId) return;
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <p className="text-alignment-accent/70">Loading your habits…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-alignment-primary/80">Habit Engine</p>
      <h1 className="mt-3 text-headline font-semibold text-alignment-accent tracking-tight">Today’s structure</h1>
      <p className="mt-2 text-sm text-alignment-accent/70 leading-relaxed max-w-xl">
        Three practices from your lowest domain. The engine notices what is holding and what needs a smaller hold.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      )}

      {prompt && (
        <section className="mt-8 rounded-2xl border border-alignment-primary/20 bg-alignment-primary/[0.06] p-6 sm:p-7">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-primary">
            {prompt.kind === 'adjust' ? 'Needs adjustment' : prompt.kind === 'hold' ? 'Holding' : 'Prompt'}
          </p>
          <h2 className="mt-3 font-display text-xl sm:text-[1.35rem] font-medium text-alignment-accent tracking-tight">
            {prompt.title}
          </h2>
          <p className="mt-2 text-sm text-alignment-accent/75 leading-relaxed">{prompt.body}</p>
        </section>
      )}

      {!paid && (
        <div className="mt-6 rounded-2xl border border-alignment-accent/10 bg-alignment-surface p-6">
          <p className="font-medium text-alignment-accent">Tracking unlocks with Habit Engine</p>
          <p className="mt-2 text-sm text-alignment-accent/70 leading-relaxed">
            You can see the three prescribed habits. Daily check-in, weekly rhythm, and adjustment prompts activate with
            the $12/month plan.
          </p>
          <Link
            to="/pricing"
            className="mt-5 inline-flex rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90"
          >
            Activate
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {habits.length === 0 ? (
          <div className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface p-6 sm:p-8">
            <p className="font-medium text-alignment-accent">No habits assigned yet</p>
            <p className="mt-2 text-sm text-alignment-accent/70">Complete the diagnostic so three practices can be installed.</p>
            <Link
              to="/assessment"
              className="mt-5 inline-flex rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90"
            >
              Take diagnostic
            </Link>
          </div>
        ) : (
          habits.map((habit) => (
            <article
              key={habit.id}
              className={`rounded-2xl border bg-alignment-surface p-6 shadow-apple ${
                prompt?.habitId === habit.id ? 'border-alignment-primary/30' : 'border-alignment-accent/[0.06]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-alignment-accent/50">
                    {DOMAIN_LABELS[habit.pillar] || habit.pillar} · Level {habit.level}
                  </p>
                  <h3 className="mt-1.5 font-medium text-alignment-accent">{habit.title}</h3>
                  {habit.description && (
                    <p className="mt-1.5 text-sm text-alignment-accent/70 leading-relaxed">{habit.description}</p>
                  )}
                </div>
                {paid ? (
                  <button
                    type="button"
                    onClick={() => markDone(habit)}
                    disabled={habit.completedToday || completingId === habit.id}
                    className="shrink-0 rounded-full bg-alignment-primary text-white px-4 py-2 text-sm font-medium hover:bg-alignment-primary/90 disabled:opacity-50"
                  >
                    {habit.completedToday ? 'Held today' : completingId === habit.id ? '…' : 'Mark done'}
                  </button>
                ) : (
                  <Link
                    to="/pricing"
                    className="shrink-0 rounded-full bg-alignment-primary text-white px-4 py-2 text-sm font-medium hover:bg-alignment-primary/90"
                  >
                    Unlock
                  </Link>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <WeekDots last7Days={habit.last7Days} />
                <p className="text-xs text-alignment-accent/50 tabular-nums">
                  {habit.completedLast7}/7 this week
                  {habit.streak > 0 ? ` · ${habit.streak}-day streak` : ''}
                </p>
              </div>
            </article>
          ))
        )}
      </div>

      {paid && (
        <p className="mt-10 text-sm text-alignment-accent/60">
          <Link to="/reflect" className="font-medium text-alignment-accent hover:underline">
            Weekly review
          </Link>
          <span className="text-alignment-accent/35"> · </span>
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </p>
      )}
    </div>
  );
}
