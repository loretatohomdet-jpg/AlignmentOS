import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE, networkErrorUserMessage } from '../config/apiBase';

const LOCAL_KEY = 'savedReflections';

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  return { Authorization: `Bearer ${token}` };
}

function loadLocalSaved() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

/** Maps legacy UI strings or API enums to POST body type. */
function typeApiFromLegacy(type) {
  const u = String(type || '').toUpperCase();
  if (u === 'WEEKLY' || type === 'Weekly') return 'WEEKLY';
  if (u === 'QUARTERLY' || type === 'Quarterly') return 'QUARTERLY';
  return null;
}

function typeDisplay(apiType) {
  return apiType === 'WEEKLY' ? 'Weekly' : 'Quarterly';
}

export default function ReflectPage() {
  const [mode, setMode] = useState('hub'); // hub | weekly | quarterly | saved
  const [weekly1, setWeekly1] = useState('');
  const [weekly2, setWeekly2] = useState('');
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchReflections = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setSaved([]);
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE}/me/reflections`, { headers: authHeaders() });
      const list = Array.isArray(data) ? data : [];

      if (list.length === 0) {
        const local = loadLocalSaved();
        if (local.length > 0) {
          let anyOk = false;
          for (const entry of local) {
            const t = typeApiFromLegacy(entry.type);
            if (!t || !Array.isArray(entry.answers)) continue;
            try {
              await axios.post(
                `${API_BASE}/me/reflections`,
                { type: t, answers: entry.answers },
                { headers: authHeaders() }
              );
              anyOk = true;
            } catch (_) {
              /* single row failure — keep trying others */
            }
          }
          if (anyOk) localStorage.removeItem(LOCAL_KEY);
          const { data: again } = await axios.get(`${API_BASE}/me/reflections`, { headers: authHeaders() });
          setSaved(Array.isArray(again) ? again : []);
        } else {
          setSaved([]);
        }
      } else {
        setSaved(list);
      }
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        (e.code === 'ERR_NETWORK' ? networkErrorUserMessage() : 'Could not load reflections.');
      setError(msg);
      setSaved([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReflections();
  }, [fetchReflections]);

  const sortedSaved = useMemo(() => {
    return [...saved].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [saved]);

  const persist = async (legacyType, answers) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    const type = typeApiFromLegacy(legacyType);
    if (!type) return false;
    setSaving(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `${API_BASE}/me/reflections`,
        { type, answers },
        { headers: authHeaders() }
      );
      setSaved((prev) => [data, ...prev]);
      return true;
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        (e.code === 'ERR_NETWORK' ? networkErrorUserMessage() : 'Could not save reflection.');
      setError(msg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const errorBanner =
    error && (
      <div
        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 mb-6"
        role="alert"
      >
        {error}
      </div>
    );

  if (mode === 'weekly') {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">Weekly Reflection</h1>
          <button type="button" onClick={() => setMode('hub')} className="text-sm font-medium text-alignment-accent hover:underline">
            Back
          </button>
        </div>

        {errorBanner}

        <div className="mt-8 rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 sm:p-8 space-y-5">
          <div>
            <p className="text-sm font-medium text-alignment-accent">Where did clarity feel natural this week?</p>
            <textarea
              value={weekly1}
              onChange={(e) => setWeekly1(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-alignment-accent focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all min-h-[96px]"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-alignment-accent">Where did resistance appear?</p>
            <textarea
              value={weekly2}
              onChange={(e) => setWeekly2(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-alignment-accent focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all min-h-[96px]"
            />
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              const ok = await persist('Weekly', [weekly1.trim(), weekly2.trim()]);
              if (ok) {
                setWeekly1('');
                setWeekly2('');
                setMode('saved');
              }
            }}
            className="w-full rounded-full bg-alignment-primary text-white py-3.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'quarterly') {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">Quarterly Reflection</h1>
          <button type="button" onClick={() => setMode('hub')} className="text-sm font-medium text-alignment-accent hover:underline">
            Back
          </button>
        </div>

        {errorBanner}

        <div className="mt-8 rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 sm:p-8 space-y-5">
          <div>
            <p className="text-sm font-medium text-alignment-accent">What has shifted since the last quarter?</p>
            <textarea
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-alignment-accent focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all min-h-[96px]"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-alignment-accent">What feels more ordered now? (optional)</p>
            <textarea
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-alignment-accent focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all min-h-[96px]"
            />
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              const ok = await persist('Quarterly', [q1.trim(), q2.trim()]);
              if (ok) {
                setQ1('');
                setQ2('');
                setMode('saved');
              }
            }}
            className="w-full rounded-full bg-alignment-primary text-white py-3.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'saved') {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">Saved Reflections</h1>
          <button type="button" onClick={() => setMode('hub')} className="text-sm font-medium text-alignment-accent hover:underline">
            Back
          </button>
        </div>

        {errorBanner}

        <div className="mt-8 rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 sm:p-8">
          {loading ? (
            <p className="text-alignment-accent/70">Loading…</p>
          ) : sortedSaved.length === 0 ? (
            <p className="text-alignment-accent/70">No reflections yet.</p>
          ) : (
            <div className="space-y-4">
              {sortedSaved.map((r) => (
                <div key={r.id} className="rounded-2xl bg-alignment-accent/[0.04] border border-alignment-accent/5 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-alignment-accent">{typeDisplay(r.type)} reflection</p>
                    <p className="text-xs text-alignment-accent/70">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-alignment-accent">
                    {(r.answers || []).filter(Boolean).map((a, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {a}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">Reflect</h1>
        <p className="text-sm text-alignment-accent/70">Integration.</p>
      </div>

      {errorBanner}

      {loading ? (
        <p className="mt-8 text-alignment-accent/70">Loading reflections…</p>
      ) : (
        <>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode('weekly')}
              className="rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 text-left hover:shadow-apple-lg transition-shadow"
            >
              <p className="font-medium text-alignment-accent">Weekly Reflection</p>
              <p className="mt-2 text-sm text-alignment-accent/70">Optional, visible, and private.</p>
            </button>
            <button
              type="button"
              onClick={() => setMode('quarterly')}
              className="rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 text-left hover:shadow-apple-lg transition-shadow"
            >
              <p className="font-medium text-alignment-accent">Quarterly Reflection</p>
              <p className="mt-2 text-sm text-alignment-accent/70">A quieter check-in every 3 months.</p>
            </button>
          </div>

          <div className="mt-6">
            <button type="button" onClick={() => setMode('saved')} className="text-sm font-medium text-alignment-accent hover:underline">
              View saved reflections →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
