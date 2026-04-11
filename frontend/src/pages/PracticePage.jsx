import { useMemo, useState } from 'react';

const FILTERS = ['All', 'Identity', 'Purpose', 'Mindset', 'Habits', 'Environment', 'Execution'];

const PRACTICES = [
  { id: 'stillness', pillar: 'Habits', title: 'Stillness Before Action', duration: '2 min', description: 'No phone, no screen. Just breathe.' },
  { id: 'single-priority', pillar: 'Purpose', title: 'Single Priority', duration: '3 min', description: 'Write your single most important priority for today.' },
  { id: 'one-value', pillar: 'Identity', title: 'One Value', duration: '2–5 min', description: 'Name one value you want to honor today.' },
  { id: 'reduce-distraction', pillar: 'Environment', title: 'Reduce One Distraction', duration: '5 min', description: 'Make one small change that protects attention.' },
];

export default function PracticePage() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const visible = useMemo(() => {
    if (filter === 'All') return PRACTICES;
    return PRACTICES.filter((p) => p.pillar === filter);
  }, [filter]);

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="text-sm font-medium text-alignment-accent hover:underline"
        >
          ← Back
        </button>

        <div className="mt-6 rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-alignment-accent/70">{selected.pillar}</span>
            <span className="text-alignment-accent/70">·</span>
            <span className="text-xs font-medium text-alignment-accent/70">{selected.duration}</span>
          </div>
          <h1 className="mt-2 text-title font-semibold text-alignment-accent tracking-tight">{selected.title}</h1>
          <p className="mt-3 text-alignment-accent/70 leading-relaxed">{selected.description}</p>

          <div className="mt-6 rounded-2xl bg-alignment-accent/[0.04] border border-alignment-accent/5 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-alignment-accent/70">Suggested use</p>
            <p className="mt-1 text-sm text-alignment-accent">Best practiced in the morning.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.setItem('todayPracticeOverride', JSON.stringify(selected));
              window.location.href = '/dashboard';
            }}
            className="mt-6 w-full rounded-full bg-alignment-primary text-white px-6 py-3 text-sm font-medium hover:bg-alignment-primary/90 transition-colors"
          >
            Use today
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">Practice</h1>
        <p className="text-sm text-alignment-accent/70">Structure without pressure.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              filter === f
                ? 'bg-alignment-accent/5 text-alignment-accent border-alignment-accent/20'
                : 'bg-alignment-surface text-alignment-accent border-alignment-accent/10 hover:bg-alignment-accent/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        {visible.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p)}
            className="text-left rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 hover:shadow-apple-lg transition-shadow"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-alignment-accent">{p.title}</p>
              <span className="text-xs text-alignment-accent/70">{p.duration}</span>
            </div>
            <p className="mt-2 text-sm text-alignment-accent/70 line-clamp-2">{p.description}</p>
            <div className="mt-3">
              <span className="inline-flex items-center rounded-full bg-alignment-surface px-3 py-1 text-xs font-medium text-alignment-accent">
                {p.pillar}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

