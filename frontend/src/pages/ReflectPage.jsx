import { useMemo, useState } from 'react';

function loadSaved() {
  try {
    const raw = localStorage.getItem('savedReflections');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function saveAll(items) {
  localStorage.setItem('savedReflections', JSON.stringify(items));
}

export default function ReflectPage() {
  const [mode, setMode] = useState('hub'); // hub | weekly | quarterly | saved
  const [weekly1, setWeekly1] = useState('');
  const [weekly2, setWeekly2] = useState('');
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [saved, setSaved] = useState(() => loadSaved());

  const sortedSaved = useMemo(() => {
    return [...saved].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [saved]);

  const persist = (entry) => {
    const next = [{ ...entry, id: crypto?.randomUUID?.() ?? String(Date.now()) }, ...saved];
    setSaved(next);
    saveAll(next);
  };

  if (mode === 'weekly') {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">Weekly Reflection</h1>
          <button onClick={() => setMode('hub')} className="text-sm font-medium text-alignment-accent hover:underline">Back</button>
        </div>

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
            onClick={() => {
              persist({ type: 'Weekly', createdAt: new Date().toISOString(), answers: [weekly1.trim(), weekly2.trim()] });
              setWeekly1('');
              setWeekly2('');
              setMode('saved');
            }}
            className="w-full rounded-full bg-alignment-primary text-white py-3.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors"
          >
            Save
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
          <button onClick={() => setMode('hub')} className="text-sm font-medium text-alignment-accent hover:underline">Back</button>
        </div>

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
            onClick={() => {
              persist({ type: 'Quarterly', createdAt: new Date().toISOString(), answers: [q1.trim(), q2.trim()] });
              setQ1('');
              setQ2('');
              setMode('saved');
            }}
            className="w-full rounded-full bg-alignment-primary text-white py-3.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors"
          >
            Save
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
          <button onClick={() => setMode('hub')} className="text-sm font-medium text-alignment-accent hover:underline">Back</button>
        </div>

        <div className="mt-8 rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 sm:p-8">
          {sortedSaved.length === 0 ? (
            <p className="text-alignment-accent/70">No reflections yet.</p>
          ) : (
            <div className="space-y-4">
              {sortedSaved.map((r) => (
                <div key={r.id} className="rounded-2xl bg-alignment-accent/[0.04] border border-alignment-accent/5 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-alignment-accent">{r.type} reflection</p>
                    <p className="text-xs text-alignment-accent/70">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-alignment-accent">
                    {(r.answers || []).filter(Boolean).map((a, idx) => (
                      <p key={idx} className="leading-relaxed">{a}</p>
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
        <button
          type="button"
          onClick={() => setMode('saved')}
          className="text-sm font-medium text-alignment-accent hover:underline"
        >
          View saved reflections →
        </button>
      </div>
    </div>
  );
}

