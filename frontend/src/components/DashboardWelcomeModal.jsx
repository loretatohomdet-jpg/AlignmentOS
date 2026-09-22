import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type } from '../config/siteType';
import { pillPrimary } from './HomeMarketingChrome';

function stepsFor({ hasScore }) {
  if (!hasScore) {
    return [
      {
        n: '01',
        title: 'Take the diagnostic',
        body: 'Twelve minutes. This fills your map and names three practices.',
        to: '/assessment',
      },
      {
        n: '02',
        title: 'Open Practice',
        body: 'Three rooms: morning, midday, close. What you write is saved.',
        to: '/practice',
      },
      {
        n: '03',
        title: 'See your map',
        body: 'It fills from the diagnostic. Score and history stay on Dashboard.',
        to: '/dashboard',
      },
    ];
  }
  return [
    {
      n: '01',
      title: 'Open Practice',
      body: 'Three rooms. Do them in order. What you write is saved.',
      to: '/practice',
    },
    {
      n: '02',
      title: 'See your results',
      body: 'Score and map live on the Dashboard — one record, not a separate menu.',
      to: '/dashboard',
    },
    {
      n: '03',
      title: 'Review when you need a line',
      body: 'A small library. Not the day, and not the record.',
      to: '/reflect',
    },
  ];
}

/**
 * First-visit welcome overlay for /dashboard — uses Alignment OS palette (ivory / olive / ink).
 */
export default function DashboardWelcomeModal({ open, onDismiss, hasScore = false, hasHabits = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onDismiss]);

  if (!open) return null;

  const steps = stepsFor({ hasScore });

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-alignment-deep/50 backdrop-blur-lg backdrop-saturate-150 supports-[backdrop-filter]:bg-alignment-deep/35"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dashboard-welcome-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-alignment-accent/12 bg-alignment-foundation shadow-apple-lg px-6 py-8 sm:px-10 sm:py-10 animate-fade-in">
        <p className={type.kicker}>Two places, every day</p>

        <h2 id="dashboard-welcome-title" className={`mt-6 ${type.h2}`}>
          {hasHabits ? 'Your practices are installed.' : hasScore ? 'Your score is in.' : 'Here is the loop.'}
        </h2>
        <p className="mt-3 font-display text-[1.35rem] sm:text-[1.5rem] font-medium text-alignment-primary leading-snug">
          Practice holds the day. This page holds the record.
        </p>

        <div className="mt-10 border-t border-alignment-accent/10">
          {steps.map((step) => (
            <Link
              key={step.n}
              to={step.to}
              onClick={onDismiss}
              className="flex gap-4 sm:gap-6 py-5 border-b border-alignment-accent/10 last:border-b-0 transition-colors hover:bg-alignment-surface/80 -mx-2 px-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-foundation"
            >
              <span className="shrink-0 text-sm font-medium tabular-nums text-alignment-primary w-8 pt-0.5">
                {step.n}
              </span>
              <div className="min-w-0 text-left">
                <p className="text-sm font-medium text-alignment-accent font-sans">{step.title}</p>
                <p className="mt-1 text-xs sm:text-sm text-alignment-accent/90 leading-relaxed font-sans">{step.body}</p>
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className={`${pillPrimary} mt-10 w-full`}
        >
          Enter dashboard <span aria-hidden className="ml-2">→</span>
        </button>
        <p className="mt-4 text-center text-[10px] sm:text-[11px] text-alignment-accent/75">
          You will not see this again after dismissing.
        </p>
      </div>
    </div>
  );
}
