import { Link } from 'react-router-dom';
import { DOMAIN_ORDER, DOMAIN_LABELS } from '../constants/domains';
import DomainPillarIcon from '../components/DomainPillarIcon';
import { diag } from '../constants/diagnosticTheme';

/** One-line description per domain — matches six-domain AQ model */
const DOMAIN_BLURBS = {
  IDENTITY: 'Who you are beneath roles and titles — values, narrative, and self-concept.',
  PURPOSE: 'Whether your daily work connects to a direction that feels meaningful.',
  MINDSET: 'Beliefs, focus, and inner dialogue that shape how you meet challenges.',
  HABITS: 'Repeated behaviors — rhythms, discipline, and how structure shows up.',
  ENVIRONMENT: 'Context around you: people, space, and systems that help or hinder.',
  EXECUTION: 'Follow-through, prioritization, and closing the loop on what matters.',
};

export default function DiagnosticPage() {
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  return (
    <div className={`max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16 ${diag.bg} min-h-[calc(100vh-6rem)] rounded-2xl sm:rounded-3xl`}>
      <div className="max-w-2xl mx-auto">
        <p className={`text-center text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.28em] ${diag.subtle}`}>Alignment OS</p>
        <h1 className="mt-5 font-display text-[1.75rem] sm:text-[2.25rem] md:text-[2.5rem] font-medium text-alignment-accent leading-tight text-center tracking-tight">
          The Alignment Diagnostic
        </h1>
        <p className={`mt-5 text-center text-base sm:text-lg ${diag.muted} leading-relaxed`}>
          A structured check-in across six domains of life and work. It measures how aligned your actions are with who you are
          and what matters — not how busy you are.
        </p>

        <div className="mt-10 rounded-2xl border border-alignment-accent/10 bg-alignment-surface shadow-apple p-6 sm:p-8">
          <p className="text-xs font-medium text-alignment-accent/70 uppercase tracking-wider">What to expect</p>
          <ul className="mt-4 text-sm text-alignment-accent/70 space-y-3">
            <li className="flex gap-3">
              <span className="text-alignment-accent font-medium shrink-0">24 questions</span>
              <span>Four per domain — enough to see patterns without fatigue.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-alignment-accent font-medium shrink-0">~12 minutes</span>
              <span>Most people finish in a single sitting; you can pause and return if you stay on the same device.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-alignment-accent font-medium shrink-0">Scale</span>
              <span>
                Each item uses a Likert scale: <strong className="text-alignment-accent font-medium">Strongly Disagree (1)</strong> through{' '}
                <strong className="text-alignment-accent font-medium">Strongly Agree (5)</strong> (shown as 1–5 in the UI).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-alignment-accent font-medium shrink-0">Privacy</span>
              <span>Your answers are sent only when you submit. Create a free account to save your score and unlock the full report.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-alignment-accent font-medium shrink-0">Cost</span>
              <span>
                <strong className="text-alignment-accent font-medium">Free forever</strong> for the diagnostic and your saved AQ summary.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <p className="text-xs font-medium text-alignment-accent/70 uppercase tracking-wider text-center">The six domains</p>
          <p className={`mt-2 text-sm ${diag.muted} text-center max-w-xl mx-auto`}>
            Your Alignment Quotient (AQ) blends all six. Your <strong className="text-alignment-accent font-medium">primary strain</strong> is the
            domain with the lowest score — where habit and structure matter most.
          </p>
          <ul className="mt-8 space-y-4">
            {DOMAIN_ORDER.map((key) => (
              <li
                key={key}
                className={`rounded-2xl border ${diag.border} bg-alignment-surface px-5 py-4 shadow-apple`}
              >
                <div className="flex gap-3 items-start">
                  <DomainPillarIcon pillar={key} className="w-6 h-6 shrink-0 text-alignment-accent/65 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-alignment-accent">{DOMAIN_LABELS[key]}</p>
                    <p className="mt-1.5 text-sm text-alignment-accent/65 leading-relaxed">{DOMAIN_BLURBS[key]}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-2xl border border-alignment-accent/10 bg-alignment-surface shadow-apple p-6 sm:p-8">
          <p className="text-xs font-medium text-alignment-accent/70 uppercase tracking-wider">After you submit</p>
          <ul className="mt-4 text-sm text-alignment-accent/70 space-y-3">
            <li>
              <strong className="text-alignment-accent font-medium">Your AQ score (0–100)</strong> — a whole-number summary of alignment across
              domains.
            </li>
            <li>
              <strong className="text-alignment-accent font-medium">Primary strain</strong> — the domain most asking for attention; where targeted
              habits tend to move the needle first.
            </li>
            <li>
              <strong className="text-alignment-accent font-medium">Email to see the full result</strong> — domain-by-domain breakdown, alignment
              type, and the rest of your diagnostic lives behind a simple email step (no spam; you can unsubscribe any time).
            </li>
            <li>
              You&apos;ll land on <strong className="text-alignment-accent font-medium">Results</strong> after submit — not back on this intro — so
              you always see your score and next steps in one place.
            </li>
          </ul>
        </div>

        {!hasToken && (
          <div className="mt-8 rounded-2xl bg-alignment-accent/[0.04] border border-alignment-accent/5 p-5">
            <p className="text-sm font-medium text-alignment-accent">Account to submit</p>
            <p className="mt-1 text-sm text-alignment-accent/70">
              You can work through every question now. To submit and save your AQ, sign in or create a free account — your answers can
              be held on this device until then.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link to="/signup?returnTo=/assessment" className="text-sm font-medium text-alignment-accent hover:underline">
                Sign up →
              </Link>
              <Link to="/login?returnTo=/assessment" className="text-sm font-medium text-alignment-accent/70 hover:text-alignment-accent">
                Sign in →
              </Link>
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
          <Link
            to="/assessment"
            className={`inline-flex justify-center items-center rounded-full px-8 py-3.5 text-sm font-semibold ${diag.btn} ${diag.btnHover} transition-colors`}
          >
            Begin diagnostic
          </Link>
          {hasToken && (
            <Link
              to="/results"
              className="inline-flex justify-center items-center rounded-full px-8 py-3.5 text-sm font-medium text-alignment-accent border border-alignment-accent/15 bg-alignment-surface hover:bg-apple-surface-muted transition-colors"
            >
              View my results
            </Link>
          )}
        </div>

        <p className={`mt-10 text-center text-xs ${diag.subtle}`}>
          Retake about every 90 days to pair with your quarterly reset — structure compounds when you measure it.
        </p>
      </div>
    </div>
  );
}
