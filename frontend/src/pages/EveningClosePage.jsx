import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mergeDraft, markRitualHeld, utcDayStamp } from '../utils/engineStorage';
import { fetchDayRituals, saveDayRitual } from '../utils/engineRitualsApi';
import { engineGhostBtn, enginePrimaryBtn, engineTextarea } from '../utils/engineUi';
import { usePageTitle } from '../hooks/usePageTitle';
import { type } from '../config/siteType';

function draftKey(day) {
  return `alignment_evening_close_${day}`;
}

function emptyDraft() {
  return { life: '', drift: '', carrying: '', tomorrow: '', gratitude: '' };
}

function loadDraft(day) {
  try {
    const raw = localStorage.getItem(draftKey(day));
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? { ...emptyDraft(), ...parsed } : emptyDraft();
  } catch (_) {
    return emptyDraft();
  }
}

function PromptCard({ prompt, value, onChange, label }) {
  return (
    <div className="border border-alignment-accent/[0.10] bg-white px-5 py-5 sm:px-6">
      <p className={type.kicker}>{prompt}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        aria-label={label}
        className={engineTextarea}
      />
    </div>
  );
}

function LabelCard({ kicker, value, onChange, label }) {
  return (
    <div className="border border-alignment-accent/[0.10] bg-white px-5 py-5 sm:px-6">
      <p className={type.kicker}>{kicker}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        aria-label={label}
        className={engineTextarea}
      />
    </div>
  );
}

export default function EveningClosePage() {
  const navigate = useNavigate();
  usePageTitle('Evening close — Alignment OS');
  const day = utcDayStamp();
  const [draft, setDraft] = useState(() => loadDraft(day));
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login?returnTo=/practice/close', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    try {
      localStorage.setItem(draftKey(day), JSON.stringify(draft));
    } catch (_) {}
  }, [day, draft]);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) return undefined;
    fetchDayRituals(day)
      .then((data) => {
        setDraft((prev) => mergeDraft(emptyDraft(), prev, data?.rituals?.close?.answers));
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, [day]);

  useEffect(() => {
    if (!hydrated) return undefined;
    const t = setTimeout(() => {
      const hasText = Object.values(draft).some((value) => String(value || '').trim());
      if (!hasText) return;
      saveDayRitual({ day, kind: 'close', answers: draft, held: false }).catch(() => {});
    }, 1200);
    return () => clearTimeout(t);
  }, [day, draft, hydrated]);

  const setField = (key) => (value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const closeTheDay = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveDayRitual({ day, kind: 'close', answers: draft, held: true });
    } catch (_) {
      /* local cache still closes the day if the server is down */
    }
    markRitualHeld(day, 'close');
    navigate('/practice', { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-xl px-6 pb-16 pt-10 sm:pt-12">
      <p className={type.kicker}>
        Evening close · five minutes
      </p>
      <h1 className={`mt-4 ${type.h1}`}>
        Close the day.
      </h1>
      <p className="mt-3 text-[17px] text-alignment-accent/90 leading-relaxed">
        So it stops following you into tomorrow.
      </p>

      <form onSubmit={closeTheDay} className="mt-8 space-y-3">
        <PromptCard prompt="What gave life today?" label="What gave life today" value={draft.life} onChange={setField('life')} />
        <PromptCard
          prompt="Where did I drift — and what pulled me?"
          label="Where did I drift"
          value={draft.drift}
          onChange={setField('drift')}
        />
        <PromptCard
          prompt="What am I carrying into tomorrow, and what am I setting down?"
          label="What I am carrying and setting down"
          value={draft.carrying}
          onChange={setField('carrying')}
        />
        <LabelCard kicker="Tomorrow’s first thing" label="Tomorrow’s first thing" value={draft.tomorrow} onChange={setField('tomorrow')} />
        <LabelCard kicker="One gratitude" label="One gratitude" value={draft.gratitude} onChange={setField('gratitude')} />

        <button type="submit" disabled={saving} className={`mt-2 ${enginePrimaryBtn}`}>
          {saving ? 'Closing…' : 'Close the day'}
        </button>
        <p className="mt-3 text-center text-[11px] text-alignment-accent/65">This is saved to your record.</p>
        <Link to="/practice" className={engineGhostBtn}>
          Back
        </Link>
      </form>
    </div>
  );
}
