import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import DiagnosticResultsSummary from '../components/DiagnosticResultsSummary';
import { diag, resultsUi } from '../constants/diagnosticTheme';
import { API_BASE } from '../config/apiBase';

const REQUEST_TIMEOUT_MS = 15000;
const FRESH_RESULT_KEY = 'alignment_os_fresh_result';

export default function ResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromFreshSubmit = searchParams.get('fresh') === '1';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [habits, setHabits] = useState([]);
  const [shareEmail, setShareEmail] = useState('');
  const [shareSending, setShareSending] = useState(false);
  const [shareMsg, setShareMsg] = useState(null);
  const [copyDone, setCopyDone] = useState(false);

  const clearFreshFlow = () => {
    try {
      sessionStorage.removeItem(FRESH_RESULT_KEY);
    } catch (_) {}
    navigate('/results', { replace: true });
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/assessment` : '';

  const fetchHabits = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/habits/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(Array.isArray(res.data) ? res.data : []);
    } catch (_) {
      setHabits([]);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      navigate('/login?returnTo=/results', { replace: true });
      return;
    }

    let handoff = null;
    try {
      const raw = sessionStorage.getItem(FRESH_RESULT_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        delete data._freshSubmission;
        handoff = data;
      }
    } catch (_) {}

    const fetchResult = async () => {
      setError(null);
      if (handoff) {
        setResult(handoff);
        setLoading(false);
      } else {
        setLoading(true);
      }
      const opts = {
        headers: { Authorization: `Bearer ${token}` },
        timeout: REQUEST_TIMEOUT_MS,
      };
      try {
        const [resultRes, historyRes] = await Promise.all([
          axios.get(`${API_BASE}/assessment/result`, opts),
          axios.get(`${API_BASE}/assessment/history`, opts).catch(() => ({ data: [] })),
        ]);
        setResult(resultRes.data);
        setScoreHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
        await fetchHabits();
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login?returnTo=/results', { replace: true });
          return;
        }
        if (!handoff) {
          const message =
            err.code === 'ECONNABORTED' || err.message?.includes('timeout')
              ? 'Request timed out. Check that the backend is running and try again.'
              : err.response?.data?.message || err.message || 'Failed to load result';
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [navigate, fetchHabits]);

  const lockResultsUntilEmail = fromFreshSubmit && !!result?.pillarScores;

  const handleShareSend = async (e) => {
    e.preventDefault();
    setShareMsg(null);
    if (!shareEmail.trim()) {
      setShareMsg('Enter an email');
      return;
    }
    setShareSending(true);
    try {
      await axios.post(`${API_BASE}/lead`, {
        email: shareEmail.trim(),
        source: 'results-share-invite',
      });
      setShareMsg('Thanks — we’ll follow up from this lead.');
      setShareEmail('');
    } catch (err) {
      setShareMsg(err.response?.data?.message || 'Could not send');
    } finally {
      setShareSending(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch (_) {}
  };

  if (!localStorage.getItem('accessToken')) {
    return null;
  }

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 ${resultsUi.wrap} min-h-[calc(100vh-6rem)]`}>
      <div className="max-w-6xl mx-auto w-full">
        {loading && !result && <p className={`${diag.muted} text-center`}>Loading...</p>}

        {!loading && error && !result && (
          <div className={`rounded-2xl px-4 py-3 text-sm ${diag.card} border ${diag.border} text-alignment-accent`}>{error}</div>
        )}

        {result && (
          <>
            <DiagnosticResultsSummary
              score={result.score}
              alignmentTypeTitle={result.alignmentTypeTitle}
              alignmentTypeSubtitle={result.alignmentTypeSubtitle}
              primaryStrainLabel={result.primaryStrainLabel}
              primaryStrainDescription={result.primaryStrainDescription}
              pillarScores={result.pillarScores}
              lockBreakdownUntilEmail={lockResultsUntilEmail}
              onEmailUnlock={clearFreshFlow}
            />

            {!lockResultsUntilEmail && (
              <div className="mt-10 lg:mt-12 space-y-6 lg:space-y-8">
                {/* Row 1: three columns (lg+) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 xl:gap-8 lg:items-stretch">
                  <section className={`${resultsUi.panel} flex flex-col h-full min-h-0`}>
                    <p className={resultsUi.label}>Your three structural habits</p>
                    <p className="mt-3 text-sm text-alignment-accent/55 italic leading-relaxed">
                      These three habits are drawn from your primary gap domain. Begin with one. Hold it for 21 days. Then add
                      the second.
                    </p>
                    <ul className="mt-6 space-y-4 flex-1">
                      {habits.length === 0 ? (
                        <li className="text-sm text-alignment-accent/45 border border-alignment-accent/[0.06] rounded-lg px-4 py-3 bg-apple-surface-muted">
                          —
                        </li>
                      ) : (
                        habits.slice(0, 3).map((h) => (
                          <li key={h.id} className="border border-alignment-accent/[0.08] rounded-lg px-4 py-3 bg-alignment-surface">
                            <span className="font-medium text-alignment-accent">{h.title}</span>
                            {h.description && <p className="mt-1 text-sm text-alignment-accent/55">{h.description}</p>}
                          </li>
                        ))
                      )}
                    </ul>
                  </section>

                  <section className={`${resultsUi.panel} flex flex-col h-full min-h-0`}>
                    <p className={resultsUi.label}>90-day projection</p>
                    {scoreHistory.length > 0 ? (
                      <div className="mt-4 xl:mt-5 h-44 sm:h-48 xl:h-52 flex-1 min-h-[11rem]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={scoreHistory.map((s) => ({
                              ...s,
                              date: new Date(s.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              }),
                              fullDate: new Date(s.createdAt).toLocaleString(),
                            }))}
                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="resultsScoreGradNeutral" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6E7158" stopOpacity={0.18} />
                                <stop offset="100%" stopColor="#6E7158" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,46,38,0.06)" vertical={false} />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 10, fill: 'rgba(44,46,38,0.45)' }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              domain={[0, 100]}
                              tick={{ fontSize: 10, fill: 'rgba(44,46,38,0.45)' }}
                              tickLine={false}
                              axisLine={false}
                              width={28}
                            />
                            <Tooltip
                              content={({ active, payload }) =>
                                active && payload?.[0] ? (
                                  <div className={`rounded-lg px-3 py-2 text-sm ${diag.card} border ${diag.border} shadow-apple text-alignment-accent`}>
                                    <p className="font-medium">{payload[0].payload.fullDate}</p>
                                    <p className="text-alignment-accent/80">Score: {Number(payload[0].value).toFixed(1)}</p>
                                  </div>
                                ) : null
                              }
                            />
                            <Area
                              type="monotone"
                              dataKey="score"
                              stroke="#6E7158"
                              strokeWidth={2}
                              fill="url(#resultsScoreGradNeutral)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="mt-4 xl:mt-5 h-2 rounded-full bg-alignment-accent/[0.06]" />
                    )}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className={resultsUi.label}>Score history</span>
                      <Link
                        to="/dashboard"
                        className="text-[10px] font-semibold uppercase tracking-[0.18em] text-alignment-accent/60 hover:text-alignment-accent"
                      >
                        Full map →
                      </Link>
                    </div>
                  </section>

                  <section className={`${resultsUi.panel} flex flex-col h-full justify-between`}>
                    <div>
                      <p className={resultsUi.label}>Weekly review</p>
                      <p className="mt-2 text-sm text-alignment-accent font-medium">10 minutes</p>
                      <p className="mt-2 text-xs text-alignment-accent/50 leading-relaxed">
                        Reflect on what held and what drifted.
                      </p>
                    </div>
                    <Link to="/reflect" className={`${resultsUi.btnPrimary} mt-5 w-full text-center`}>
                      Do it now
                    </Link>
                  </section>
                </div>

                {/* Row 2: three columns (lg+) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 xl:gap-8 lg:items-stretch">
                  <section className={`${resultsUi.panel} flex flex-col h-full justify-between`}>
                    <div>
                      <p className={resultsUi.label}>Retake</p>
                      <p className="mt-2 text-sm text-alignment-accent/60 leading-relaxed">
                        Every 90 days — habits recalibrate with your score.
                      </p>
                    </div>
                    <Link
                      to="/assessment"
                      className="mt-5 inline-flex text-[10px] font-semibold uppercase tracking-[0.18em] text-alignment-accent/60 hover:text-alignment-accent"
                    >
                      Retake diagnostic →
                    </Link>
                  </section>

                  <section className={`${resultsUi.panel} h-full flex flex-col`}>
                    <p className={resultsUi.label}>Who should know their score?</p>
                    <p className="mt-2 text-xs text-alignment-accent/50 leading-relaxed">
                      Add someone who might take the diagnostic next. We save this as a lead for follow-up — scores aren’t emailed
                      automatically yet.
                    </p>
                    <form onSubmit={handleShareSend} className="mt-4 flex flex-col gap-3 flex-1 min-h-0">
                      <input
                        type="email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        placeholder="their@email.com"
                        className={`${resultsUi.input} w-full bg-apple-surface-muted focus:bg-alignment-surface`}
                      />
                      <button type="submit" disabled={shareSending} className={`${resultsUi.btnPrimary} w-full`}>
                        {shareSending ? '…' : 'Send →'}
                      </button>
                    </form>
                    {shareMsg && <p className="mt-2 text-xs text-alignment-accent/50">{shareMsg}</p>}
                  </section>

                  <section className={`${resultsUi.panel} h-full flex flex-col`}>
                    <p className="font-display text-alignment-accent/55 italic text-left">Invite someone to the diagnostic</p>
                    <p className="mt-2 text-xs text-alignment-accent/45 leading-relaxed">
                      Share the free assessment link — not your personal score. (A shareable score card is on the roadmap.)
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Try the Alignment OS diagnostic — 12 minutes, free.')}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={resultsUi.btnOutline}
                      >
                        ↗ X / Twitter
                      </a>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Try the Alignment OS diagnostic (12 min, free): ${shareUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={resultsUi.btnOutline}
                      >
                        ↗ WhatsApp
                      </a>
                      <button type="button" onClick={copyLink} className={resultsUi.btnOutline}>
                        {copyDone ? 'Copied' : 'Copy link'}
                      </button>
                    </div>
                  </section>
                </div>

                {/* Row 3: two columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 xl:gap-8 lg:items-stretch">
                  <section className="rounded-xl border border-alignment-accent/[0.08] bg-alignment-surface px-6 py-8 shadow-apple h-full flex flex-col">
                    <h3 className={`${resultsUi.heading} text-xl sm:text-2xl`}>Ready to install the system?</h3>
                    <p className="mt-4 text-sm text-alignment-accent/60 leading-relaxed flex-1">
                      Habit Engine — daily tracking, weekly review, quarterly reset. Your habits stored, your score history
                      built, your formation compounding.
                    </p>
                    <p className="mt-4 text-alignment-accent font-medium">$12/month · $120/year</p>
                    <Link to="/pricing" className={`mt-6 inline-flex ${resultsUi.btnPrimary} px-8 py-3 self-start`}>
                      Activate the Habit Engine →
                    </Link>
                  </section>

                  <section className="rounded-xl border border-alignment-accent/[0.08] bg-alignment-surface px-6 py-8 shadow-apple h-full flex flex-col">
                    <p className={resultsUi.label}>For those ready to go further</p>
                    <h3 className={`mt-4 ${resultsUi.heading} text-xl sm:text-2xl`}>
                      Who are you becoming — and toward what?
                    </h3>
                    <p className="mt-4 text-sm text-alignment-accent/60 leading-relaxed flex-1">
                      Journey to Purpose — 90 days, 14 modules, complete life architecture. One time. Lifetime access.
                    </p>
                    <Link to="/pricing#journey-tier" className={`mt-6 inline-flex ${resultsUi.btnOutline} px-8 py-3 self-start`}>
                      Explore Journey to Purpose →
                    </Link>
                  </section>
                </div>

                {result.createdAt && (
                  <p className="text-center text-xs text-alignment-accent/45">
                    Result from {new Date(result.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {!loading && !error && !result && (
          <div className={`rounded-2xl border ${diag.border} ${diag.card} p-10 text-center shadow-apple`}>
            <p className="text-alignment-accent/60">No results yet.</p>
            <Link to="/assessment" className="mt-4 inline-block font-medium text-alignment-accent hover:underline">
              Take the assessment →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
