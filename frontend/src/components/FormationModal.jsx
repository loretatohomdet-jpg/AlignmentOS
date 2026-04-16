import { useState, useEffect } from 'react';
import { formationExploreUrl } from '../config/externalLinks';

const DISMISS_KEY = 'formationModalDismissedAt';
const DISMISS_DAYS = 7;

export default function FormationModal({ show, onClose, aqScore, daysWithHabits }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!show);
  }, [show]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, new Date().toISOString());
    } catch (_) {}
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-alignment-deep/45" role="dialog" aria-modal="true" aria-labelledby="formation-title">
      <div className="rounded-2xl bg-alignment-surface border border-alignment-accent/10 shadow-xl max-w-md w-full p-6 sm:p-8">
        <h2 id="formation-title" className="text-xl font-semibold text-alignment-accent tracking-tight">
          You’ve built a foundation
        </h2>
        <p className="mt-3 text-alignment-accent/70 leading-relaxed">
          {daysWithHabits >= 14
            ? "You've been building alignment for 14+ days. Explore the Simplicity & Productivity Formation program for guided transformation and deeper practice."
            : "Your alignment could use deeper support. The Simplicity & Productivity Formation program offers guided transformation to close the gap."}
        </p>
        <p className="mt-4 text-xs text-alignment-accent/50 leading-relaxed">
          Partner programme — separate from your Alignment OS subscription; for deeper 1:1 and cohort formation support.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={formationExploreUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 text-center"
          >
            Go to Simplicity & Productivity
          </a>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-full bg-alignment-surface text-alignment-accent px-5 py-2.5 text-sm font-medium hover:bg-alignment-accent/5"
          >
            Remind me later
          </button>
        </div>
      </div>
    </div>
  );
}

export function shouldShowFormationModal(aqScore, totalDaysWithActivity) {
  try {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const d = new Date(dismissed);
      const now = new Date();
      if ((now - d) / (1000 * 60 * 60 * 24) < DISMISS_DAYS) return false;
    }
  } catch (_) {}
  return (typeof totalDaysWithActivity === 'number' && totalDaysWithActivity >= 14) || (typeof aqScore === 'number' && aqScore < 70);
}
