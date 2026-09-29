import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DOMAIN_ORDER, DOMAIN_LABELS } from '../constants/domains';
import DomainPillarIcon from './DomainPillarIcon';
import { domainScoresToDisplayPct } from '../utils/domainScores';
import { diag, resultsUi } from '../constants/diagnosticTheme';
import { API_BASE } from '../config/apiBase';
import { pillPrimary } from './HomeMarketingChrome';

const DEFAULT_SCORE_REVEALS =
  'The lowest domain is the thin place. The practice below is already chosen for it.';

/**
 * Results: score → thin place → why → one practice already started.
 * Palette: alignment foundation / surface / accent (site-wide).
 */
export default function DiagnosticResultsSummary({
  score,
  alignmentTypeTitle = 'The Developing Person',
  alignmentTypeSubtitle = 'Multiple domains in active formation.',
  primaryStrainLabel,
  primaryStrainDescription = 'Your primary structural gap — where habit installation begins.',
  whatThisMeans,
  whatScoreReveals = DEFAULT_SCORE_REVEALS,
  insight = null,
  pillarScores,
  lockBreakdownUntilEmail = false,
  onEmailUnlock,
}) {
  const [unlocked, setUnlocked] = useState(!lockBreakdownUntilEmail);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [emailed, setEmailed] = useState(false);

  const n = Number(score);
  const hasScore = score != null && Number.isFinite(n);
  const displayPct = hasScore ? Math.round(Math.max(0, Math.min(100, n))) : null;
  const meaningBody = whatThisMeans ?? insight?.thin ?? primaryStrainDescription;
  const whyBody = insight?.why || whatScoreReveals;
  const practice = insight?.practice;

  const showExtended = !lockBreakdownUntilEmail || unlocked;
  const showEmailGate = lockBreakdownUntilEmail && !unlocked && pillarScores;

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Enter your email');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.post(
        `${API_BASE}/assessment/email-report`,
        {
          email: email.trim(),
          source: 'diagnostic-results',
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setUnlocked(true);
      setEmailed(Boolean(res.data?.emailed));
      onEmailUnlock?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center pt-2 pb-2 max-w-xl mx-auto">
        <p className={resultsUi.label}>Your Alignment Score</p>
        <p className="mt-5 sm:mt-6 font-display text-[4rem] sm:text-[4.5rem] font-medium leading-none tabular-nums text-alignment-accent tracking-tight">
          {displayPct ?? '—'}
        </p>
        <div className="mx-auto mt-5 h-2 w-40 max-w-[12rem] rounded-full bg-alignment-primary/35" aria-hidden />
        <p className="mt-5 text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.22em] text-alignment-accent/70">out of 100</p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-0 overflow-hidden rounded-xl border border-alignment-accent/[0.08] bg-alignment-surface shadow-apple max-w-2xl mx-auto">
        <div className="min-w-0 border-r border-alignment-accent/[0.08] p-4 sm:p-6 text-center">
          <p className={resultsUi.label}>Alignment type</p>
          <p className="mt-4 font-display text-base sm:text-xl text-alignment-accent leading-snug break-words">{alignmentTypeTitle || '—'}</p>
        </div>
        <div className="min-w-0 p-4 sm:p-6 text-center">
          <p className={resultsUi.label}>Primary strain</p>
          <p className="mt-4 font-display text-base sm:text-xl text-alignment-accent leading-snug break-words">{primaryStrainLabel || '—'}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={`${resultsUi.panel} h-full`}>
          <p className={resultsUi.label}>What this means</p>
          <p className="mt-4 text-sm text-alignment-accent/90 leading-relaxed">{meaningBody?.trim() ? meaningBody : '—'}</p>
        </div>

        <div className={`${resultsUi.panel} h-full`}>
          <p className={resultsUi.label}>What the score reveals</p>
          <p className="mt-4 text-sm text-alignment-accent/90 leading-relaxed">{whyBody?.trim() ? whyBody : '—'}</p>
        </div>
      </div>

      {showEmailGate && (
        <div className="mt-12 sm:mt-14">
          <h2 className={`${resultsUi.heading} text-xl sm:text-2xl text-center leading-snug`}>See your full diagnostic.</h2>
          <p className="mt-5 text-sm text-alignment-accent/90 text-center leading-relaxed px-1">
            Enter your email to unlock your domain breakdown. We’ll send this report to your inbox.
          </p>
          <form onSubmit={handleUnlock} className="mt-9 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              className="w-full rounded-xl border border-alignment-accent/12 bg-apple-surface-muted px-4 py-4 text-sm text-alignment-accent placeholder:text-alignment-accent/45 focus:border-alignment-accent/25 focus:bg-alignment-surface focus:outline-none focus:ring-2 focus:ring-alignment-accent/10 transition-colors"
            />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className={`${pillPrimary} w-full disabled:opacity-50`}
            >
              {submitting ? 'Sending…' : 'Email my results →'}
            </button>
          </form>
          <p className="mt-5 text-center text-[11px] text-alignment-accent/70 leading-relaxed">
            No spam. Unsubscribe any time. We never share your email.
          </p>
          <p className="mt-10 text-center text-sm text-alignment-accent/90">
            Returning user?{' '}
            <Link to="/dashboard" className="font-medium text-alignment-accent underline underline-offset-2 hover:text-alignment-accent/80">
              Open your Dashboard →
            </Link>
          </p>
        </div>
      )}

      {showExtended && emailed && (
        <p className="mt-10 text-sm text-alignment-accent/90 text-center leading-relaxed">
          We sent this diagnostic to {email.trim()}.
        </p>
      )}

      {showExtended && pillarScores && typeof pillarScores === 'object' && (
        <div className="mt-10 grid grid-cols-1 xl:grid-cols-2 gap-5 xl:gap-6 xl:items-start">
          <div className={`${resultsUi.panel} h-full`}>
            <p className={`${resultsUi.label} text-center xl:text-left`}>Six domains</p>
            <p className="mt-2 text-xs text-alignment-accent/65 text-center xl:text-left mb-6 xl:mb-8">
              Domain strength shown as 0–100% (from your four answers in each domain).
            </p>
            <div className="space-y-5">
              {DOMAIN_ORDER.map((key) => {
                const v = pillarScores[key];
                if (v == null) return null;
                const pct = domainScoresToDisplayPct(pillarScores, key);
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center gap-2 text-sm mb-1.5">
                      <span className="font-medium text-alignment-accent flex items-center gap-2 min-w-0">
                        <DomainPillarIcon pillar={key} className="w-5 h-5 shrink-0 text-alignment-accent/85" />
                        <span className="truncate">{DOMAIN_LABELS[key]}</span>
                      </span>
                      <span className="text-alignment-accent/90 tabular-nums shrink-0">{pct.toFixed(0)}%</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${diag.barTrack}`}>
                      <div
                        className={`h-full rounded-full ${diag.barFill} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${resultsUi.panel} h-full flex flex-col`}>
            <p className={resultsUi.label}>Your practice</p>
            <p className="mt-3 text-sm text-alignment-accent/90 leading-relaxed">
              Chosen from {primaryStrainLabel || 'your lowest domain'}. It is already started.
            </p>
            {practice?.title ? (
              <>
                <p className="mt-6 font-display text-xl font-medium text-alignment-accent leading-snug">{practice.title}</p>
                {practice.description ? (
                  <p className="mt-3 text-sm text-alignment-accent/90 leading-relaxed flex-1">{practice.description}</p>
                ) : (
                  <div className="flex-1" />
                )}
              </>
            ) : (
              <p className="mt-6 text-sm text-alignment-accent/90 leading-relaxed flex-1">
                Finish the assessment while signed in and this practice is installed for you.
              </p>
            )}
            <Link to="/plan" className={`${pillPrimary} mt-6 self-start`}>
              Open My Plan →
            </Link>
          </div>
        </div>
      )}

      {showExtended && lockBreakdownUntilEmail && (
        <div className={`${resultsUi.panel} mt-8 text-center`}>
          <p className={resultsUi.label}>Next step</p>
          <p className="mt-4 font-display text-xl sm:text-2xl font-medium text-alignment-accent">
            {practice?.title || 'Your practice is ready'}
          </p>
          <p className="mt-3 text-sm text-alignment-accent/90 leading-relaxed">
            {practice?.title
              ? `My Plan holds this focus. ${practice.title} is waiting in Daily.`
              : 'Open My Plan — the focus and practice are already started.'}
          </p>
          <Link to="/plan" className={`${pillPrimary} mt-6`}>
            Open My Plan →
          </Link>
        </div>
      )}
    </div>
  );
}
