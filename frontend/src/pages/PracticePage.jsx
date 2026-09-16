import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, networkErrorUserMessage } from '../config/apiBase';
import { loadRituals, utcDayStamp } from '../utils/engineStorage';
import { pushHeldLocalRituals } from '../utils/engineRitualsApi';
import { usePageTitle } from '../hooks/usePageTitle';
import { type } from '../config/siteType';
import { pillGhost, pillPrimary } from '../components/HomeMarketingChrome';

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

export default function PracticePage() {
  const navigate = useNavigate();
  usePageTitle('Today — Alignment OS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [habits, setHabits] = useState([]);
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
  const morningHabitHeld = liveHabits && habits.some((h) => isMorningHabit(h) && h.completedToday);
  const morningHeld = Boolean(rituals.morning) || morningHabitHeld;

  const rooms = useMemo(
    () => [
      {
        id: 'morning',
        to: '/practice/morning',
        title: 'Morning anchor',
        note: 'Before the phone. Name the day.',
        held: morningHeld,
      },
      {
        id: 'midday',
        to: '/practice/midday',
        title: 'Midday pause',
        note: 'Notice the drift. Adjust once.',
        held: Boolean(rituals.midday),
      },
      {
        id: 'close',
        to: '/practice/close',
        title: 'Close the day',
        note: 'End it on purpose.',
        held: Boolean(rituals.close),
      },
    ],
    [morningHeld, rituals.close, rituals.midday]
  );

  const nextRoom = rooms.find((room) => !room.held);
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
    <div className="mx-auto w-full max-w-xl px-6 pb-16 pt-10 sm:pt-14">
      <p className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-alignment-accent/40">
        {dateLabel}
      </p>
      <h1 className={`mt-4 text-center ${type.h1}`}>{greeting}</h1>
      <p className="mt-3 text-center text-[15px] text-alignment-accent/55 leading-relaxed">
        The day has three rooms. Do them in order.
      </p>

      {error && (
        <p className="mt-8 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      )}

      {!liveHabits && (
        <div className="mt-10 rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-6 py-6 text-center">
          <p className="text-sm text-alignment-accent/65 leading-relaxed">
            Take the free diagnostic so these rooms can sit on your lowest domain.
          </p>
          <Link to="/assessment" className={`${pillGhost} mt-5`}>
            Begin the diagnostic
          </Link>
        </div>
      )}

      {nextRoom ? (
        <Link to={nextRoom.to} className={`mt-8 ${pillPrimary} w-full`}>
          {nextRoom.id === 'morning' ? 'Begin the morning anchor' : nextRoom.id === 'midday' ? 'Begin the midday pause' : 'Close the day'}
        </Link>
      ) : (
        <p className="mt-8 text-center text-sm text-alignment-accent/50">The day is held.</p>
      )}

      <ol className="mt-10 divide-y divide-alignment-accent/[0.08] border-t border-alignment-accent/[0.08]">
        {rooms.map((room, index) => (
          <li key={room.id}>
            <Link to={room.to} className="flex items-start gap-4 py-5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-alignment-accent/15 text-[11px] text-alignment-accent/45">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-lg font-medium text-alignment-accent">{room.title}</span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-alignment-accent/40">
                    {room.held ? 'Held' : nextRoom?.id === room.id ? 'Next' : 'Later'}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-alignment-accent/50 leading-relaxed">{room.note}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-center text-sm text-alignment-accent/45">
        <Link to="/reflect" className="underline underline-offset-2 hover:text-alignment-accent">
          Review
        </Link>
        {' · '}
        <Link to="/journey" className="underline underline-offset-2 hover:text-alignment-accent">
          Journey
        </Link>
      </p>
    </div>
  );
}
