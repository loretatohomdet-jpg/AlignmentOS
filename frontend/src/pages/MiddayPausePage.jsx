import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mergeDraft, markRitualHeld, utcDayStamp } from '../utils/engineStorage';
import { fetchDayRituals, saveDayRitual } from '../utils/engineRitualsApi';
import { engineGhostBtn, enginePrimaryBtn, engineTextarea } from '../utils/engineUi';
import { usePageTitle } from '../hooks/usePageTitle';
import { type } from '../config/siteType';

function draftKey(day) {
  return `alignment_midday_pause_${day}`;
}

function emptyDraft() {
  return { notice: '', adjustment: '' };
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

export default function MiddayPausePage() {
  const navigate = useNavigate();
  usePageTitle('Midday pause — Alignment OS');
  const day = utcDayStamp();
  const [draft, setDraft] = useState(() => loadDraft(day));
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login?returnTo=/practice/midday', { replace: true });
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
        setDraft((prev) => mergeDraft(emptyDraft(), prev, data?.rituals?.midday?.answers));
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, [day]);

  useEffect(() => {
    if (!hydrated) return undefined;
    const t = setTimeout(() => {
      const hasText = Object.values(draft).some((value) => String(value || '').trim());
      if (!hasText) return;
      saveDayRitual({ day, kind: 'midday', answers: draft, held: false }).catch(() => {});
    }, 1200);
    return () => clearTimeout(t);
  }, [day, draft, hydrated]);

  const setField = (key) => (value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const saveAndContinue = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveDayRitual({ day, kind: 'midday', answers: draft, held: true });
    } catch (_) {
      /* local cache still holds the day if the server is down */
    }
    markRitualHeld(day, 'midday');
    navigate('/practice', { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-xl px-6 pb-16 pt-10 sm:pt-12">
      <p className={type.kicker}>
        Midday pause · two minutes
      </p>
      <h1 className={`mt-4 ${type.h1}`}>
        Still here?
      </h1>
      <p className="mt-3 text-[17px] text-alignment-accent/55 leading-relaxed">
        Three questions, one adjustment, then continue.
      </p>

      <form onSubmit={saveAndContinue} className="mt-8 space-y-3">
        <div className="border border-alignment-accent/[0.10] bg-white px-5 py-6 sm:px-6">
          <p className="font-display italic font-normal text-[1.35rem] sm:text-[1.5rem] leading-snug text-alignment-accent">
            Am I living the day I intended?
          </p>
          <p className="mt-3 font-display italic font-normal text-[1.25rem] sm:text-[1.4rem] leading-snug text-alignment-accent/45">
            What has distracted me?
          </p>
          <p className="mt-3 font-display italic font-normal text-[1.25rem] sm:text-[1.4rem] leading-snug text-alignment-accent/45">
            What deserves my attention now?
          </p>
          <textarea
            value={draft.notice}
            onChange={(e) => setField('notice')(e.target.value)}
            rows={3}
            aria-label="Midday notice"
            className={`${engineTextarea} mt-5`}
          />
        </div>

        <div className="border border-alignment-accent/[0.10] bg-white px-5 py-5 sm:px-6">
          <p className={type.kicker}>One adjustment</p>
          <textarea
            value={draft.adjustment}
            onChange={(e) => setField('adjustment')(e.target.value)}
            rows={2}
            aria-label="One adjustment"
            className={engineTextarea}
          />
        </div>

        <button type="submit" disabled={saving} className={`mt-2 ${enginePrimaryBtn}`}>
          {saving ? 'Saving…' : 'Save and continue'}
        </button>
        <Link to="/practice" className={engineGhostBtn}>
          Back
        </Link>
      </form>
    </div>
  );
}
