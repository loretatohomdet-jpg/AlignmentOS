import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, networkErrorUserMessage } from '../config/apiBase';
import { loadRituals, utcDayStamp } from '../utils/engineStorage';
import { pushHeldLocalRituals } from '../utils/engineRitualsApi';
import { engineGhostBtn, engineHeldBtn, enginePrimaryBtn } from '../utils/engineUi';
import { usePageTitle } from '../hooks/usePageTitle';
import { type } from '../config/siteType';

const STARTER = [
  { id: 'starter-morning', title: 'Morning anchor — before the phone' },
  { id: 'starter-priority', title: 'One priority named before work begins' },
  { id: 'starter-screens', title: 'Screens down thirty minutes before sleep' },
];

const SEASON_THEME = 'Order the ordinary.';

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function greetingForHour(hour) {
  if (hour < 12) return 'Good morning.';
  if (hour < 17) return 'Good afternoon.';
  return 'Good evening.';
}

function formatEngineDate(date) {
  return date
    .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    .toUpperCase();
}

function isMorningHabit(habit) {
  return /morning|anchor/i.test(habit?.title || '');
}

function Checkbox({ checked }) {
  return (
    <span
      className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border ${
        checked ? 'border-alignment-accent bg-alignment-accent' : 'border-alignment-accent/25 bg-transparent'
      }`}
      aria-hidden
    >
      {checked ? (
        <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.2 4.8 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

export default function PracticePage() {
  const navigate = useNavigate();
  usePageTitle('Today — Alignment OS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [habits, setHabits] = useState([]);
  const [completingId, setCompletingId] = useState(null);
  const [now] = useState(() => new Date());
  const day = utcDayStamp(now);
  const [rituals, setRituals] = useState(() => loadRituals(day));

  const load = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login?returnTo=/practice', { replace: true });
      return;
    }
    setError(null);
    try {
      const statsRes = await axios.get(`${API_BASE}/habits/stats`, { headers: authHeaders() });
      setHabits(Array.isArray(statsRes.data?.habits) ? statsRes.data.habits : []);
      const held = await pushHeldLocalRituals(day);
      setRituals(held);
    } catch (e) {
      if (e.response?.status === 401) {
        navigate('/login?returnTo=/practice', { replace: true });
        return;
      }
      setError(
        e.response?.data?.message ||
          (e.code === 'ERR_NETWORK' ? networkErrorUserMessage() : 'Could not load today’s practices.')
      );
    } finally {
      setLoading(false);
    }
  }, [day, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const liveHabits = habits.length > 0;
  const rows = liveHabits ? habits : STARTER;
  const morningPending = rows.some((h) => isMorningHabit(h) && !h.completedToday);
  const allPracticesHeld = liveHabits && habits.every((h) => h.completedToday);

  const primary = useMemo(() => {
    if (!liveHabits) return { to: '/assessment', label: 'Take the Alignment Score' };
    if (morningPending) return { to: '/practice/morning', label: 'Begin the morning anchor' };
    if (!rituals.midday) return { to: '/practice/midday', label: 'Begin the midday pause' };
    if (!rituals.close) return { to: '/practice/close', label: 'Close the day' };
    return null;
  }, [liveHabits, morningPending, rituals.close, rituals.midday]);

  const dayHeld = allPracticesHeld && rituals.midday && rituals.close;

  const markDone = async (habit) => {
    if (isMorningHabit(habit)) {
      navigate('/practice/morning');
      return;
    }
    if (!liveHabits) {
      navigate('/assessment');
      return;
    }
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

  const greeting = useMemo(() => greetingForHour(now.getHours()), [now]);
  const dateLabel = useMemo(() => formatEngineDate(now), [now]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="font-display italic text-alignment-accent/45">Loading today…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-6 pb-28 pt-10 sm:pt-14">
      <p className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-alignment-accent/40">
        {dateLabel}
      </p>
      <h1 className={`mt-4 text-center ${type.h1}`}>
        {greeting}
      </h1>
      {!liveHabits && (
        <p className="mt-3 text-center text-[15px] text-alignment-accent/55 leading-relaxed">
          Take the Alignment Score to shape this around your season.
        </p>
      )}

      {error && (
        <p className="mt-8 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      )}

      <div className="mt-10 bg-alignment-surfaceSoft/80 px-6 py-7 sm:px-8">
        <p className={type.kicker}>This season’s theme</p>
        <p className="mt-3 font-display italic text-[1.45rem] sm:text-[1.6rem] leading-snug text-alignment-accent">
          {SEASON_THEME}
        </p>
      </div>

      {primary ? (
        <Link to={primary.to} className={`mt-6 ${enginePrimaryBtn}`}>
          {primary.label}
        </Link>
      ) : dayHeld ? (
        <p className="mt-6 text-center text-sm text-alignment-accent/50">The day is held.</p>
      ) : allPracticesHeld ? (
        <p className="mt-6 text-center text-sm text-alignment-accent/50">All three held today.</p>
      ) : null}

      {!liveHabits && (
        <Link to="/practice/morning" className={`mt-2.5 ${engineGhostBtn}`}>
          Or begin the morning anchor
        </Link>
      )}

      <div className="mt-10 border-t border-alignment-accent/[0.08] pt-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/40">Today’s practices</p>
        <ul className="mt-4 divide-y divide-alignment-accent/[0.08]">
          {rows.map((habit) => {
            const held = Boolean(habit.completedToday);
            return (
              <li key={habit.id}>
                <button
                  type="button"
                  onClick={() => markDone(habit)}
                  disabled={(!isMorningHabit(habit) && held) || completingId === habit.id}
                  className="flex w-full items-start gap-3 py-3.5 text-left disabled:opacity-70"
                >
                  <Checkbox checked={held} />
                  <span className={`text-[15px] leading-snug ${held ? 'text-alignment-accent/45 line-through' : 'text-alignment-accent'}`}>
                    {habit.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 space-y-2.5">
        {primary?.to !== '/practice/midday' && (
          <Link to="/practice/midday" className={rituals.midday ? engineHeldBtn : engineGhostBtn}>
            {rituals.midday ? 'Midday pause held' : 'Midday pause'}
          </Link>
        )}
        {primary?.to !== '/practice/close' && (
          <Link to="/practice/close" className={rituals.close ? engineHeldBtn : engineGhostBtn}>
            {rituals.close ? 'Day closed' : 'Close the day'}
          </Link>
        )}
      </div>
    </div>
  );
}
