import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { mergeDraft, utcDayStamp } from '../utils/engineStorage';
import { fetchDayRituals, saveDayRitual } from '../utils/engineRitualsApi';
import { engineGhostBtn, enginePrimaryBtn, engineTextarea } from '../utils/engineUi';
import { usePageTitle } from '../hooks/usePageTitle';
import { type } from '../config/siteType';

function storageKey(day) {
  return `alignment_morning_anchor_${day}`;
}

function emptyDraft() {
  return { focus: '', oneThing: '', practice: '', faithful: '' };
}

function loadDraft(day) {
  try {
    const raw = localStorage.getItem(storageKey(day));
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? { ...emptyDraft(), ...parsed } : emptyDraft();
  } catch (_) {
    return emptyDraft();
  }
}

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const PRACTICE_HINT = {
  HABITS: 'Suggested for Habits: Keep one repetition for thirty days.',
  IDENTITY: 'Suggested for Identity: Name who you are becoming, in one line.',
  PURPOSE: 'Suggested for Purpose: One act that serves what this season is for.',
  MINDSET: 'Suggested for Mindset: Notice one thought. Choose the next one.',
  ENVIRONMENT: 'Suggested for Environment: Guard one input before noon.',
  EXECUTION: 'Suggested for Execution: Name the first move, not the whole plan.',
};

function FieldCard({ kicker, hint, value, onChange, italicPrompt, label }) {
  return (
    <div className="border border-alignment-accent/[0.10] bg-white px-5 py-5 sm:px-6 sm:py-6">
      {italicPrompt ? (
        <p className="font-display italic font-normal text-[1.35rem] sm:text-[1.5rem] leading-snug text-alignment-accent">
          {italicPrompt}
        </p>
      ) : (
        <p className={type.kicker}>{kicker}</p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        aria-label={label}
        className={engineTextarea}
      />
      {hint ? <p className="mt-3 text-[13px] text-alignment-accent/45 leading-relaxed">{hint}</p> : null}
    </div>
  );
}

export default function MorningAnchorPage() {
  const navigate = useNavigate();
  usePageTitle('Morning anchor — Alignment OS');
  const day = utcDayStamp();
  const [draft, setDraft] = useState(() => loadDraft(day));
  const [habitId, setHabitId] = useState(null);
  const [pillar, setPillar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(day), JSON.stringify(draft));
    } catch (_) {}
  }, [day, draft]);

  useEffect(() => {
    if (!hydrated) return undefined;
    const t = setTimeout(() => {
      const hasText = Object.values(draft).some((value) => String(value || '').trim());
      if (!hasText) return;
      saveDayRitual({ day, kind: 'morning', answers: draft, held: false }).catch(() => {});
    }, 1200);
    return () => clearTimeout(t);
  }, [day, draft, hydrated]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login?returnTo=/practice/morning', { replace: true });
      return;
    }
    Promise.all([
      axios.get(`${API_BASE}/habits/stats`, { headers: authHeaders() }).catch(() => ({ data: null })),
      fetchDayRituals(day).catch(() => null),
    ])
      .then(([statsRes, ritualsRes]) => {
        const habits = Array.isArray(statsRes.data?.habits) ? statsRes.data.habits : [];
        const morning = habits.find((h) => /morning|anchor/i.test(h.title || '')) || null;
        setHabitId(morning && !morning.completedToday ? morning.id : null);
        setPillar(morning?.pillar || habits[0]?.pillar || null);
        const serverAnswers = ritualsRes?.rituals?.morning?.answers;
        setDraft((prev) => mergeDraft(emptyDraft(), prev, serverAnswers));
      })
      .finally(() => setHydrated(true));
  }, [day, navigate]);

  const setField = (key) => (value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const hint = PRACTICE_HINT[pillar] || PRACTICE_HINT.HABITS;

  const holdMorning = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await saveDayRitual({ day, kind: 'morning', answers: draft, held: true });
    } catch (_) {
      /* draft stays on this device if the server is down */
    }
    try {
      if (habitId) {
        await axios.post(`${API_BASE}/habits/complete`, { activeHabitId: habitId }, { headers: authHeaders() });
      }
      navigate('/practice', { replace: true });
    } catch (err) {
      if (err.response?.status === 402) {
        navigate('/pricing');
        return;
      }
      setError(err.response?.data?.message || 'Could not hold this morning. Your words are saved here.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-6 pb-16 pt-10 sm:pt-12">
      <p className={type.kicker}>
        Morning anchor · about five minutes
      </p>
      <h1 className={`mt-4 ${type.h1}`}>
        Begin on purpose.
      </h1>
      <p className="mt-3 text-[17px] text-alignment-accent/55 leading-relaxed">
        Before the phone, before the inbox. Four short answers.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={holdMorning} className="mt-8 space-y-3">
        <FieldCard
          kicker="Today’s focus · one sentence"
          label="Today’s focus"
          value={draft.focus}
          onChange={setField('focus')}
        />
        <FieldCard
          kicker="The one thing — if only this gets done, the day counted"
          label="The one thing"
          value={draft.oneThing}
          onChange={setField('oneThing')}
        />
        <FieldCard
          kicker="Today’s practice · one small exercise"
          label="Today’s practice"
          hint={hint}
          value={draft.practice}
          onChange={setField('practice')}
        />
        <FieldCard
          italicPrompt="What would make today a faithful expression of what matters most?"
          label="A faithful expression of what matters most"
          value={draft.faithful}
          onChange={setField('faithful')}
        />

        <button type="submit" disabled={saving} className={`mt-4 ${enginePrimaryBtn}`}>
          {saving ? 'Holding…' : 'Hold this morning'}
        </button>
        <Link to="/practice" className={engineGhostBtn}>
          Back
        </Link>
      </form>
    </div>
  );
}
