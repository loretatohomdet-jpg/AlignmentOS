import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    n: '01',
    title: 'Check your Habits tab',
    body: 'Three habits from your primary gap. Do one today.',
    to: '/practice',
  },
  {
    n: '02',
    title: 'Add your Identity Anchors',
    body: 'Three statements about who you are becoming.',
    to: '/profile',
  },
  {
    n: '03',
    title: 'Do your weekly review on Sunday',
    body: '10 minutes. The most important habit in the system.',
    to: '/reflect',
  },
];

const gold = {
  label: 'text-[#c4a574]',
  border: 'border-[#a68a4c]/50',
  num: 'text-[#b89a6a]',
  muted: 'text-[#9a8f7e]',
};

/**
 * First-visit welcome overlay for /dashboard.
 * Backdrop uses blur so the page behind reads as softly frosted.
 */
export default function DashboardWelcomeModal({ open, onDismiss }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-alignment-deep/50 backdrop-blur-lg backdrop-saturate-150 supports-[backdrop-filter]:bg-alignment-deep/35"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dashboard-welcome-title"
    >
      <div
        className={`relative w-full max-w-lg border ${gold.border} bg-[#1a1614] shadow-[0_12px_48px_rgba(44,46,38,0.45)] px-6 py-8 sm:px-10 sm:py-10 animate-fade-in`}
      >
        <p className={`text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.28em] ${gold.label}`}>
          Welcome to your dashboard
        </p>

        <h2 id="dashboard-welcome-title" className="mt-6 font-display text-[1.65rem] sm:text-[2rem] font-medium text-white leading-[1.2] tracking-tight">
          Your system is ready.
        </h2>
        <p className="mt-3 font-display text-[1.35rem] sm:text-[1.5rem] italic font-normal text-[#c4a574] leading-snug">
          Here is where to begin.
        </p>

        <div className={`mt-10 border-t border-white/[0.08]`}>
          {steps.map((step) => (
            <Link
              key={step.n}
              to={step.to}
              onClick={onDismiss}
              className={`flex gap-4 sm:gap-6 py-5 border-b border-white/[0.08] last:border-b-0 transition-colors hover:bg-alignment-surface/[0.04] -mx-2 px-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a574]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1614]`}
            >
              <span className={`shrink-0 text-sm font-medium tabular-nums ${gold.num} w-8 pt-0.5`}>{step.n}</span>
              <div className="min-w-0 text-left">
                <p className="text-sm font-medium text-white font-sans">{step.title}</p>
                <p className={`mt-1 text-xs sm:text-sm ${gold.muted} leading-relaxed font-sans`}>{step.body}</p>
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="mt-10 w-full inline-flex items-center justify-center rounded-sm bg-[#9D7936] text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] py-4 transition-colors hover:bg-[#8a6d31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a574] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1614]"
        >
          Enter dashboard <span aria-hidden className="ml-2">→</span>
        </button>
        <p className={`mt-4 text-center text-[10px] sm:text-[11px] ${gold.muted}`}>
          You will not see this again after dismissing.
        </p>
      </div>
    </div>
  );
}
