import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCategoryProgress, sortQuestionsByDomainOrder } from '../utils/assessmentCategory';
import { DOMAIN_ORDER, DOMAIN_LABELS, PILLAR_INTRO } from '../constants/domains';
import { diagRun } from '../constants/diagnosticTheme';
import { API_BASE } from '../config/apiBase';
import { domainScoresToDisplayPct } from '../utils/domainScores';
import { buildGuestPreviewPayload } from '../utils/assessmentPreview';
const DRAFT_KEY = 'alignment_assessment_draft';
/** Handoff to /results after submit (score + strain + email gate); cleared when read */
const FRESH_RESULT_KEY = 'alignment_os_fresh_result';

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function saveDraft(assessmentId, answers) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ assessmentId, answers }));
  } catch (_) {}
}

function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch (_) {}
}

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [restoredFromDraft, setRestoredFromDraft] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  /** Logged-out preview: API /preview payload + email gate before domain bars */
  const [guestPreview, setGuestPreview] = useState(null);
  const [guestUnlocked, setGuestUnlocked] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestLeadError, setGuestLeadError] = useState(null);
  const [guestLeadSubmitting, setGuestLeadSubmitting] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`${API_BASE}/assessment/active`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        let data = res.data;
        const qList = Array.isArray(data?.questions) ? data.questions : [];
        if (data?.id && qList.length === 0) {
          const retry = await axios.get(`${API_BASE}/assessment/active`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            params: { _: Date.now() },
          });
          data = retry.data;
        }
        setAssessment({
          ...data,
          questions: Array.isArray(data?.questions) ? data.questions : [],
        });

        const draft = loadDraft();
        if (token && draft && draft.assessmentId === data?.id && draft.answers && typeof draft.answers === 'object') {
          setAnswers(draft.answers);
          setRestoredFromDraft(true);
          const total = Array.isArray(data?.questions) ? data.questions.length : 0;
          if (total > 0) setCurrentIndex(total);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          setError('Sign in to submit. Use Log in in the menu or paste a token via the key icon.');
        } else if (err.response?.status === 404) {
          setError('No assessment is available right now. Please try again later.');
        } else if (err.code === 'ERR_NETWORK') {
          setError('Cannot reach the server. Make sure the backend is running.');
        } else {
          setError(err.response?.data?.message || 'Failed to load assessment.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, []);

  /** Pillar-by-pillar order (Identity → … → Execution) so the flow matches the six domains. */
  const questions = useMemo(
    () => sortQuestionsByDomainOrder(assessment?.questions ?? []),
    [assessment?.questions]
  );

  const totalQuestions = questions.length;

  const currentQuestion = questions[currentIndex] ?? null;
  const isLastQuestion = totalQuestions > 0 && currentIndex === totalQuestions - 1;
  const isReviewStep = totalQuestions > 0 && currentIndex >= totalQuestions;

  const categoryMeta = useMemo(
    () => (questions.length ? getCategoryProgress(questions, currentIndex) : null),
    [questions, currentIndex]
  );

  const isFirstQuestionInPillar =
    currentQuestion &&
    (currentIndex === 0 || questions[currentIndex]?.pillar !== questions[currentIndex - 1]?.pillar);

  const pillarDomainOrdinal =
    currentQuestion && DOMAIN_ORDER.indexOf(currentQuestion.pillar) >= 0
      ? DOMAIN_ORDER.indexOf(currentQuestion.pillar) + 1
      : 1;

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: Number(value) }));
  };

  const goNext = () => {
    if (isLastQuestion) {
      setCurrentIndex(totalQuestions);
    } else if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const resetGuestPreview = () => {
    setGuestPreview(null);
    setGuestUnlocked(false);
    setGuestEmail('');
    setGuestLeadError(null);
  };

  const handleRevealScore = async () => {
    if (!assessment || !questions.length) return;
    const allAnswered = questions.every((q) => answers[q.id] != null);
    if (!allAnswered) return;
    setPreviewLoading(true);
    setError(null);
    try {
      const responses = questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id],
      }));
      try {
        const res = await axios.post(`${API_BASE}/assessment/preview`, {
          assessmentId: assessment.id,
          responses,
        });
        setGuestPreview(res.data);
      } catch (err) {
        const missingRoute = err.response?.status === 404;
        if (missingRoute) {
          setGuestPreview(buildGuestPreviewPayload(questions, answers));
        } else {
          throw err;
        }
      }
      saveDraft(assessment.id, answers);
      setGuestUnlocked(false);
      setGuestLeadError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not calculate your score.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleGuestUnlockEmail = async (e) => {
    e.preventDefault();
    setGuestLeadError(null);
    if (!guestEmail.trim()) {
      setGuestLeadError('Enter your email');
      return;
    }
    setGuestLeadSubmitting(true);
    try {
      await axios.post(`${API_BASE}/lead`, {
        email: guestEmail.trim(),
        source: 'diagnostic-assessment-preview',
      });
      setGuestUnlocked(true);
    } catch (err) {
      setGuestLeadError(err.response?.data?.message || 'Could not save. Try again.');
    } finally {
      setGuestLeadSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assessment) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Sign in to save your score to your account. Your answers stay on this device until you submit.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const responses = questions
        .filter((q) => answers[q.id] != null)
        .map((q) => ({
          questionId: q.id,
          value: answers[q.id],
        }));

      const res = await axios.post(
        `${API_BASE}/assessment/submit`,
        {
          assessmentId: assessment.id,
          responses,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      clearDraft();
      try {
        sessionStorage.setItem(FRESH_RESULT_KEY, JSON.stringify({ ...res.data, _freshSubmission: true }));
      } catch (_) {}
      navigate('/results?fresh=1', { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const flowTotal = totalQuestions > 0 ? totalQuestions : 24;
  const progressFillPct =
    loading || !totalQuestions ? 0 : isReviewStep ? 100 : (currentIndex / totalQuestions) * 100;
  const progressLeftLabel = loading || !totalQuestions ? 0 : isReviewStep ? totalQuestions : currentIndex;

  const showRunChrome = !error;
  const inFlow = !loading && assessment && totalQuestions > 0 && !error;

  return (
    <div
      className={`w-full min-h-[calc(100vh-6rem)] ${
        showRunChrome ? diagRun.page : 'bg-alignment-surface text-alignment-accent'
      }`}
    >
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
      {showRunChrome && (
        <div className="max-w-2xl mx-auto">
          <p
            className={`text-center text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.28em] ${diagRun.kicker}`}
          >
            Alignment OS
          </p>
          <h1 className="mt-6 font-display text-[1.65rem] sm:text-[2rem] md:text-[2.25rem] font-medium text-alignment-accent leading-tight text-center tracking-tight">
            Your Alignment Score is waiting.
          </h1>
          <p className={`mt-4 text-center text-sm sm:text-base ${diagRun.muted}`}>
            {flowTotal} questions · 6 domains · 12 minutes · Free forever
          </p>

          <div className="mt-10">
            <div className={`relative h-px sm:h-[3px] rounded-full overflow-hidden ${diagRun.barTrack}`}>
              <div
                className={`absolute left-0 top-0 h-full ${diagRun.barFill} transition-all duration-500 ease-out rounded-full`}
                style={{
                  width: `${Math.min(100, progressFillPct)}%`,
                }}
              />
            </div>
            <div className={`flex justify-between mt-2 text-[11px] tabular-nums uppercase tracking-wider ${diagRun.subtle}`}>
              <span>{progressLeftLabel}</span>
              <span>{flowTotal}</span>
            </div>
          </div>

          {!localStorage.getItem('accessToken') && !loading && totalQuestions > 0 && (
            <p className={`mt-8 text-center text-xs ${diagRun.muted} max-w-md mx-auto leading-relaxed`}>
              On the last step you can reveal your score for free.{' '}
              <Link to="/login?returnTo=/assessment" className="underline decoration-alignment-accent/20 hover:decoration-alignment-accent/50">
                Sign in
              </Link>{' '}
              anytime to save results to your dashboard.
            </p>
          )}
          {restoredFromDraft && !loading && totalQuestions > 0 && (
            <p className={`mt-4 text-center text-xs ${diagRun.muted} max-w-lg mx-auto`}>
              Your answers were restored from this device. Continue to review and submit.
            </p>
          )}
        </div>
      )}

      {loading && showRunChrome && (
        <p className={`mt-10 ${diagRun.muted} text-center max-w-2xl mx-auto text-sm`}>Loading questions…</p>
      )}

      {loading && !showRunChrome && <p className="mt-8 text-alignment-accent/70">Loading...</p>}

      {error && (
        <div
          className={`mt-6 text-sm max-w-2xl mx-auto ${
            showRunChrome ? diagRun.errorBox : 'rounded-2xl px-4 py-3 bg-red-50 border border-red-200 text-red-900'
          }`}
        >
          {error}
        </div>
      )}

      {!loading && !assessment && !error && (
        <div className={`mt-10 ${diagRun.emptySurface} p-8 text-center`}>
          <p className="text-lg font-medium text-alignment-accent">No assessment available right now</p>
          <p className={`mt-2 text-sm ${diagRun.muted} max-w-md mx-auto`}>
            There isn’t an active assessment to show. Try again later or open your dashboard.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90"
            >
              Go to Dashboard
            </Link>
            <a
              href="/"
              className="rounded-full border border-alignment-accent/15 bg-alignment-surface px-5 py-2.5 text-sm font-medium text-alignment-accent/70 hover:text-alignment-accent hover:bg-alignment-accent/[0.03]"
            >
              Home
            </a>
          </div>
        </div>
      )}

      {!loading && assessment && totalQuestions === 0 && !error && (
        <div className={`mt-10 ${diagRun.emptySurface} p-6 text-center`}>
          <p className="font-medium text-alignment-accent">We couldn&apos;t load the 24 questions.</p>
          <p className={`mt-1 text-sm ${diagRun.muted}`}>
            Reload this page after restarting the API (so the latest code runs). If it persists, confirm{' '}
            <code className="text-xs bg-alignment-accent/[0.06] px-1 rounded">DATABASE_URL</code> points at your Postgres DB, then run{' '}
            <code className="text-xs bg-alignment-accent/[0.06] px-1 rounded">npx prisma migrate deploy</code> and{' '}
            <code className="text-xs bg-alignment-accent/[0.06] px-1 rounded">npx prisma db seed</code> in the API folder.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-sm font-medium text-alignment-accent underline underline-offset-2 hover:text-alignment-accent/80"
            >
              Reload page
            </button>
            <Link to="/dashboard" className="text-sm font-medium text-alignment-accent/70 hover:text-alignment-accent">
              Back to Dashboard →
            </Link>
          </div>
        </div>
      )}

      {!loading && assessment && totalQuestions > 0 && !isReviewStep && currentQuestion && inFlow && (
        <div className="max-w-2xl mx-auto mt-10 animate-fade-in" key={currentIndex}>
          {isFirstQuestionInPillar && (
            <div className={`mb-10 ${diagRun.domainCard} px-5 py-5 sm:px-6 sm:py-6`}>
              <p className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] ${diagRun.domainKicker}`}>
                Domain {pillarDomainOrdinal} of {DOMAIN_ORDER.length}
              </p>
              <p className={`mt-3 font-display text-xl sm:text-2xl font-medium leading-tight ${diagRun.domainTitle}`}>
                {categoryMeta?.label ?? DOMAIN_LABELS[currentQuestion.pillar] ?? currentQuestion.pillar}
              </p>
              {PILLAR_INTRO[currentQuestion.pillar] && (
                <p className={`mt-2 text-sm leading-relaxed ${diagRun.domainBody}`}>
                  {PILLAR_INTRO[currentQuestion.pillar]}
                </p>
              )}
            </div>
          )}
          <p className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] ${diagRun.category}`}>
            {(categoryMeta?.label ?? DOMAIN_LABELS[currentQuestion.pillar] ?? 'Question').toUpperCase()} ·{' '}
            {categoryMeta?.indexInGroup ?? '—'} OF {categoryMeta?.groupSize ?? '—'}
          </p>
          <p className={`mt-8 font-display text-xl sm:text-2xl md:text-[1.65rem] font-medium leading-snug ${diagRun.question}`}>
            {currentQuestion.text}
          </p>

          <p
            className={`mt-6 text-xs sm:text-sm ${diagRun.likertHint} text-center max-w-lg mx-auto leading-relaxed`}
            id={`likert-hint-${currentQuestion.id}`}
          >
            Likert scale: choose 1 (Strongly Disagree) through 5 (Strongly Agree).
          </p>

          <div className="mt-8">
            {(() => {
              const q = currentQuestion;
              const scaleLabels =
                q.scaleMin === 0 && q.scaleMax === 4
                  ? ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                  : q.scaleMin === 1 && q.scaleMax === 5
                    ? ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                    : null;
              return (
                <>
                  <div
                    className="grid grid-cols-5 gap-2 sm:gap-4 w-full max-w-xl mx-auto"
                    role="group"
                    aria-labelledby={`likert-hint-${q.id}`}
                  >
                    {Array.from({ length: q.scaleMax - q.scaleMin + 1 }).map((_, i) => {
                      const value = q.scaleMin + i;
                      const isSelected = answers[q.id] === value;
                      const displayNum = q.scaleMin === 0 && q.scaleMax === 4 ? value + 1 : value;
                      const lab = scaleLabels ? scaleLabels[i] : null;
                      return (
                        <div key={value} className="flex flex-col items-center gap-2 sm:gap-3">
                          <button
                            type="button"
                            onClick={() => handleChange(q.id, value)}
                            className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full text-sm font-semibold transition-all duration-200 ${
                              isSelected ? diagRun.likertActive : diagRun.likertIdle
                            }`}
                          >
                            {displayNum}
                          </button>
                          {lab && (
                            <span className={`text-[8px] sm:text-[9px] leading-tight text-center ${diagRun.likertCaption}`}>
                              {lab}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className={`flex justify-between mt-8 max-w-xl mx-auto text-[10px] sm:text-xs uppercase tracking-wider ${diagRun.scaleEnds}`}
                  >
                    <span>Strongly Disagree</span>
                    <span>Strongly Agree</span>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="mt-12 flex items-center justify-between gap-4">
            <span className={`text-sm tabular-nums ${diagRun.footerCount}`}>
              {currentIndex + 1} / {totalQuestions}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={answers[currentQuestion.id] == null}
              className={`inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                answers[currentQuestion.id] == null ? diagRun.primaryBtnDisabled : `${diagRun.primaryBtn}`
              }`}
            >
              {isLastQuestion ? 'Review & submit →' : 'Continue →'}
            </button>
          </div>
          {currentIndex > 0 && (
            <div className="mt-6 text-center">
              <button type="button" onClick={goPrev} className={`text-sm ${diagRun.ghostLink}`}>
                ← Previous
              </button>
            </div>
          )}
        </div>
      )}

      {!loading && assessment && totalQuestions > 0 && isReviewStep && inFlow && (
        <div className="max-w-2xl mx-auto mt-12 animate-fade-in space-y-10">
          <div className={`${diagRun.reviewCard} p-8 sm:p-10 text-center`}>
            <p className="text-lg font-medium text-alignment-accent">You&apos;ve answered all {totalQuestions} questions.</p>
            <p className={`mt-2 text-sm ${diagRun.reviewMuted}`}>
              {localStorage.getItem('accessToken')
                ? 'Submit to save your alignment score to your account.'
                : 'Reveal your score below, then enter your email to see the full six-domain breakdown.'}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <button
                type="button"
                onClick={() => {
                  resetGuestPreview();
                  setCurrentIndex(0);
                }}
                className={`text-sm ${diagRun.reviewLink} hover:underline`}
              >
                Start from first question
              </button>
              <span className="hidden sm:inline text-alignment-accent/15" aria-hidden>
                ·
              </span>
              <button
                type="button"
                onClick={() => {
                  resetGuestPreview();
                  setCurrentIndex(totalQuestions - 1);
                }}
                className={`text-sm ${diagRun.reviewLink} hover:underline`}
              >
                ← Back to last question
              </button>
            </div>
          </div>

          {localStorage.getItem('accessToken') ? (
            <form onSubmit={handleSubmit} className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className={`rounded-full px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  submitting ? diagRun.primaryBtnDisabled : diagRun.primaryBtn
                }`}
              >
                {submitting ? 'Submitting…' : 'Submit & view results'}
              </button>
            </form>
          ) : !guestPreview ? (
            <div className="text-center">
              <button
                type="button"
                onClick={handleRevealScore}
                disabled={previewLoading}
                className={`rounded-full px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  previewLoading ? diagRun.primaryBtnDisabled : diagRun.primaryBtn
                }`}
              >
                {previewLoading ? 'Calculating…' : 'Reveal my score'}
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="text-center">
                <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.28em] text-alignment-accent/45">
                  Alignment score
                </p>
                <p className="mt-4 font-display text-[3.5rem] sm:text-[4rem] font-medium leading-none tabular-nums text-alignment-accent">
                  {Math.round(Math.min(100, Math.max(0, Number(guestPreview.score) || 0)))}
                </p>
                <p className="mt-3 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-alignment-accent/40">Out of 100</p>
                <p className="mt-2 text-sm text-alignment-accent/55">{guestPreview.label}</p>
              </div>

              <div className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-6 py-8 text-center shadow-apple">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-alignment-accent/45">
                  Alignment type
                </p>
                <p className="mt-4 font-display text-xl sm:text-2xl font-medium text-alignment-accent">
                  {guestPreview.alignmentTypeTitle}
                </p>
                <p className="mt-3 text-sm text-alignment-accent/65 italic leading-relaxed">
                  {guestPreview.alignmentTypeSubtitle}
                </p>
              </div>

              <div className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-6 py-8 text-center shadow-apple">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-alignment-accent/45">
                  Primary strain
                </p>
                {guestPreview.primaryStrainLabel && (
                  <p className="mt-4 font-display text-2xl font-medium text-alignment-accent">{guestPreview.primaryStrainLabel}</p>
                )}
                <p className="mt-3 text-sm text-alignment-accent/60 italic leading-relaxed">
                  {guestPreview.primaryStrainDescription}
                </p>
              </div>

              {!guestUnlocked ? (
                <div className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-6 py-8 shadow-apple">
                  <h2 className="font-display text-xl font-medium text-alignment-accent text-center leading-snug">
                    See your full diagnostic
                  </h2>
                  <p className="mt-3 text-sm text-alignment-accent/55 text-center leading-relaxed">
                    Enter your email to unlock the six-domain breakdown. No spam — unsubscribe any time.
                  </p>
                  <form onSubmit={handleGuestUnlockEmail} className="mt-6 space-y-4">
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-alignment-accent/12 bg-apple-surface-muted px-4 py-3.5 text-sm text-alignment-accent placeholder:text-alignment-accent/35 focus:border-alignment-accent/25 focus:bg-alignment-surface focus:outline-none focus:ring-2 focus:ring-alignment-accent/10"
                    />
                    {guestLeadError && <p className="text-sm text-red-600 text-center">{guestLeadError}</p>}
                    <button
                      type="submit"
                      disabled={guestLeadSubmitting}
                      className="w-full rounded-lg py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white bg-alignment-primary hover:bg-alignment-primary/90 disabled:opacity-50"
                    >
                      {guestLeadSubmitting ? 'Unlocking…' : 'Unlock full results →'}
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-5 py-8 shadow-apple">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/55 text-center">
                      Six domains
                    </p>
                    <p className="mt-1 text-xs text-alignment-accent/45 text-center mb-6">
                      Strength per domain (from your four answers in each).
                    </p>
                    <div className="space-y-4">
                      {DOMAIN_ORDER.map((key) => {
                        const v = guestPreview.pillarScores?.[key];
                        if (v == null) return null;
                        const pct = domainScoresToDisplayPct(guestPreview.pillarScores, key);
                        return (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-alignment-accent">{DOMAIN_LABELS[key]}</span>
                              <span className="text-alignment-accent/70 tabular-nums">{pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden bg-alignment-accent/[0.08]">
                              <div
                                className="h-full rounded-full bg-alignment-primary transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-6 py-6 text-center shadow-apple">
                    <p className="text-sm font-medium text-alignment-accent">Save this to your dashboard</p>
                    <p className="mt-2 text-sm text-alignment-accent/55">
                      Create a free account and submit once — your answers are kept in this browser until then.
                    </p>
                    <Link
                      to="/signup?returnTo=/assessment"
                      className="mt-5 inline-flex rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] bg-alignment-primary text-white hover:bg-alignment-primary/90"
                    >
                      Create free account →
                    </Link>
                    <p className="mt-4 text-xs text-alignment-accent/45">
                      Already have an account?{' '}
                      <Link to="/login?returnTo=/assessment" className="font-medium text-alignment-accent underline underline-offset-2">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      </div>
    </div>
  );
}
