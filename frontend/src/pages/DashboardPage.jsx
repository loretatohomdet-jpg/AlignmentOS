import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormationModal, { shouldShowFormationModal } from '../components/FormationModal';
import DashboardWelcomeModal from '../components/DashboardWelcomeModal';
import LoginModal from '../components/LoginModal';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { API_BASE } from '../config/apiBase';

const FALLBACK_PROMPT = {
  title: 'Set one intention for the day',
  description: 'Take a moment to write down your single most important priority before you begin.',
};

const PILLAR_LABELS = {
  IDENTITY: 'Identity',
  PURPOSE: 'Purpose',
  MINDSET: 'Mindset',
  HABITS: 'Habits',
  ENVIRONMENT: 'Environment',
  EXECUTION: 'Execution',
};

function HabitRow({ habit, onComplete, token, API_BASE }) {
  const [completing, setCompleting] = useState(false);
  const handleDone = async () => {
    if (completing) return;
    setCompleting(true);
    try {
      await axios.post(`${API_BASE}/habits/complete`, { activeHabitId: habit.id }, { headers: { Authorization: `Bearer ${token}` } });
      onComplete?.();
    } catch (_) {}
    setCompleting(false);
  };
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-alignment-accent/5 last:border-0">
      <div>
        <p className="font-medium text-alignment-accent">{habit.title}</p>
        {habit.description && <p className="text-sm text-alignment-accent/70 mt-0.5">{habit.description}</p>}
        <span className="inline-block mt-1 text-xs text-alignment-accent/70 rounded-full bg-alignment-surface px-2 py-0.5">Level {habit.level}</span>
      </div>
      <button
        type="button"
        onClick={handleDone}
        disabled={completing}
        className="shrink-0 rounded-full bg-alignment-primary text-white px-4 py-2 text-sm font-medium hover:bg-alignment-primary/90 disabled:opacity-50"
      >
        {completing ? '…' : 'Done'}
      </button>
    </div>
  );
}

const TODAY_RESPONSE_KEY = (habitId, dateStr) => `today_response_${habitId}_${dateStr}`;

function TodayPracticeCard({ habit, fallback, onComplete, token, API_BASE, focusPillar }) {
  const prompt = habit || fallback;
  const todayStr = new Date().toISOString().slice(0, 10);
  const storageKey = habit ? TODAY_RESPONSE_KEY(habit.id, todayStr) : null;
  const [response, setResponse] = useState(() => {
    if (!storageKey || typeof window === 'undefined') return '';
    try {
      return localStorage.getItem(storageKey) || '';
    } catch (_) {
      return '';
    }
  });
  const [completing, setCompleting] = useState(false);
  const [showCompleteMoment, setShowCompleteMoment] = useState(false);

  const saveResponse = (value) => {
    setResponse(value);
    if (storageKey) {
      try {
        if (value.trim()) localStorage.setItem(storageKey, value.trim());
        else localStorage.removeItem(storageKey);
      } catch (_) {}
    }
  };

  const handleDone = async () => {
    if (completing || !habit) return;
    setCompleting(true);
    try {
      await axios.post(`${API_BASE}/habits/complete`, { activeHabitId: habit.id }, { headers: { Authorization: `Bearer ${token}` } });
      setShowCompleteMoment(true);
      onComplete?.();
    } catch (_) {}
    setCompleting(false);
  };

  if (showCompleteMoment) {
    return (
      <div className="rounded-2.5xl bg-alignment-surface border border-alignment-accent/[0.06] shadow-apple p-8 sm:p-12 text-center animate-fade-in">
        <p className="text-2xl sm:text-3xl font-semibold text-alignment-accent tracking-tight">Complete.</p>
        <p className="mt-2 text-alignment-accent/70">Order was restored today.</p>
        <button
          type="button"
          onClick={() => setShowCompleteMoment(false)}
          className="mt-6 rounded-full bg-alignment-primary text-white px-6 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors"
        >
          Return to Today
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2.5xl bg-alignment-surface border border-alignment-accent/[0.06] shadow-apple p-6 sm:p-8">
      {focusPillar && (
        <span className="inline-block rounded-full bg-alignment-accent/5 text-alignment-accent text-sm font-medium px-3 py-1 mb-4">
          {focusPillar}
        </span>
      )}
      <p className="text-xs font-medium text-alignment-accent/70 uppercase tracking-wider mb-3">Your practice</p>
      <p className="text-lg font-semibold text-alignment-accent tracking-tight">{prompt.title}</p>
      {prompt.description && <p className="mt-2 text-alignment-accent/70 text-sm">{prompt.description}</p>}
      {habit ? (
        <>
          <label htmlFor="today-practice-response" className="mt-4 block text-sm font-medium text-alignment-accent">
            Your response (optional)
          </label>
          <textarea
            id="today-practice-response"
            value={response}
            onChange={(e) => saveResponse(e.target.value)}
            placeholder="e.g. Ship the proposal, or have one calm conversation with my team."
            rows={3}
            className="mt-2 w-full rounded-xl border border-alignment-accent/[0.08] bg-alignment-surface px-4 py-3 text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/10 outline-none transition-all resize-none"
          />
          <button
            type="button"
            onClick={handleDone}
            disabled={completing}
            className="mt-4 rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 disabled:opacity-50 transition-colors"
          >
            {completing ? '…' : 'Mark done'}
          </button>
          <p className="mt-3 text-xs text-alignment-accent/70">One aligned action is enough.</p>
        </>
      ) : (
        <Link to="/assessment" className="mt-4 inline-block rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors">
          Take the assessment to get habits
        </Link>
      )}
    </div>
  );
}

function ScoreGauge({ score, label }) {
  const value = score != null ? Math.min(100, Math.max(0, score)) : 0;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36 sm:w-40 sm:h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="58%"
            outerRadius="100%"
            data={[
              { name: 'Max', value: 100, fill: 'rgba(110,113,88,0.12)' },
              { name: 'Score', value, fill: '#6E7158' },
            ]}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar background dataKey="value" cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl sm:text-3xl font-semibold text-alignment-accent tracking-tight">
            {score != null ? score.toFixed(0) : '—'}
          </span>
        </div>
      </div>
      {label && <p className="mt-1 text-sm text-alignment-accent/70">{label}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => !!localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(() => !!localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [habits, setHabits] = useState([]);
  const [habitStats, setHabitStats] = useState(null);
  const [error, setError] = useState(null);
  const [showFormation, setShowFormation] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  const token = localStorage.getItem('accessToken');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (!authed) {
      setLoading(false);
      return;
    }

    const t = localStorage.getItem('accessToken');
    if (!t) {
      setAuthed(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchDashboard = async () => {
      try {
        const [meRes, resultRes, historyRes, habitsRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE}/me`, { headers: authHeaders }),
          axios.get(`${API_BASE}/assessment/result`, { headers: authHeaders }).catch(() => ({ data: null })),
          axios.get(`${API_BASE}/assessment/history`, { headers: authHeaders }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/habits/active`, { headers: authHeaders }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/habits/stats`, { headers: authHeaders }).catch(() => ({ data: null })),
        ]);
        setUser(meRes.data);
        setResult(resultRes.data ?? null);
        setScoreHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
        setHabits(Array.isArray(habitsRes.data) ? habitsRes.data : []);
        setHabitStats(statsRes.data ?? null);
        const res = resultRes.data ?? null;
        const stats = statsRes.data ?? null;
        if (shouldShowFormationModal(res?.score, stats?.totalDaysWithActivity)) {
          setShowFormation(true);
        }
      } catch (err) {
        setError(err.response?.status === 401 ? null : (err.response?.data?.message || 'Something went wrong'));
        if (err.response?.status === 401) {
          try {
            localStorage.removeItem('accessToken');
          } catch (_) {}
          setAuthed(false);
          setUser(null);
          setResult(null);
          setScoreHistory([]);
          setHabits([]);
          setHabitStats(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [authed]);

  useEffect(() => {
    if (loading) return;
    try {
      if (localStorage.getItem('alignment_os_dashboard_welcome_dismissed') !== '1') {
        setWelcomeOpen(true);
      }
    } catch (_) {
      setWelcomeOpen(true);
    }
  }, [loading]);

  useEffect(() => {
    if (!welcomeOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [welcomeOpen]);

  const dismissWelcome = () => {
    try {
      localStorage.setItem('alignment_os_dashboard_welcome_dismissed', '1');
    } catch (_) {}
    setWelcomeOpen(false);
  };

  if (!authed) {
    return (
      <>
        <LoginModal
          open
          onClose={() => navigate('/', { replace: true })}
          returnTo="/dashboard"
          onLoggedIn={() => setAuthed(true)}
        />
        <div className="min-h-[min(50vh,420px)]" aria-hidden />
      </>
    );
  }

  if (!loading && !user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-alignment-accent/70">Unable to load your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-alignment-accent/70">Loading...</p>
      </div>
    );
  }

  const firstName = user?.name?.split(/\s+/)[0] || 'there';
  const todayStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  const primaryHabit = habits[0] ?? null;
  const lastTakenAt = result?.createdAt ? new Date(result.createdAt) : null;
  const daysSinceAssessment = lastTakenAt ? Math.floor((Date.now() - lastTakenAt.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isQuarterlyDue = daysSinceAssessment !== null && daysSinceAssessment >= 90;

  const refreshHabits = async () => {
    try {
      const res = await axios.get(`${API_BASE}/habits/active`, { headers: authHeaders });
      setHabits(Array.isArray(res.data) ? res.data : []);
    } catch (_) {}
  };

  const nextStep = !result
    ? { label: 'Take the assessment', to: '/assessment', cta: 'Start →', isHabit: false }
    : habits.length > 0
      ? { label: primaryHabit.title, to: null, cta: 'Mark done', isHabit: true }
      : { label: 'View your results and insights', to: '/results', cta: 'View →', isHabit: false };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
      <DashboardWelcomeModal open={welcomeOpen} onDismiss={dismissWelcome} />

      {error && (
        <div className="mb-6 rounded-2xl bg-alignment-surface border border-alignment-accent/15 px-4 py-3 text-sm text-alignment-accent">
          {error}
        </div>
      )}

      {user && (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-2 animate-fade-in">
            <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">
              Hi, {firstName}
            </h1>
            <p className="text-sm text-alignment-accent/70">{todayStr}</p>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-alignment-surface px-3 py-1 text-xs font-medium text-alignment-accent capitalize">
              {user.plan?.toLowerCase() ?? 'free'} plan
            </span>
            {(user.plan === 'FREE' || !user.plan) && (
              <Link
                to="/pricing"
                className="text-sm font-medium text-alignment-accent hover:underline"
              >
                Upgrade
              </Link>
            )}
          </div>

          <div className="mt-8 lg:mt-10 space-y-6 lg:space-y-8 animate-slide-up">
            {/* Row 1: three columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 xl:gap-8 lg:items-stretch">
              <section className="min-h-0">
                <TodayPracticeCard
                  habit={primaryHabit}
                  fallback={FALLBACK_PROMPT}
                  onComplete={refreshHabits}
                  token={token}
                  API_BASE={API_BASE}
                  focusPillar={result?.primaryDomain ? PILLAR_LABELS[result.primaryDomain] || result.primaryDomain : null}
                />
              </section>

              <section className="rounded-2.5xl bg-alignment-surface border border-alignment-accent/[0.06] shadow-apple p-6 sm:p-8 flex flex-col items-center justify-between gap-4 h-full min-h-0">
                <div className="w-full text-center lg:text-left">
                  <p className="text-xs font-medium text-alignment-accent/70 uppercase tracking-wider mb-1">Alignment Score</p>
                  <p className="text-alignment-accent/70 text-sm">Your AQ score from your last assessment.</p>
                </div>
                <ScoreGauge score={result?.score} label={result?.label} />
                {result ? (
                  <Link to="/results" className="text-sm font-medium text-alignment-accent hover:underline shrink-0">
                    View details →
                  </Link>
                ) : (
                  <Link to="/assessment" className="text-sm font-medium text-alignment-accent hover:underline shrink-0">
                    Take assessment →
                  </Link>
                )}
              </section>

              <section className="rounded-2.5xl border border-alignment-accent/20 bg-alignment-accent/5 p-6 flex flex-col justify-between h-full min-h-[11rem]">
                <div>
                  <p className="text-xs font-medium text-alignment-accent/70 uppercase tracking-wider mb-2">Next Step</p>
                  <p className="font-medium text-alignment-accent">{nextStep.label}</p>
                </div>
                {nextStep.isHabit ? (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!primaryHabit) return;
                      try {
                        await axios.post(`${API_BASE}/habits/complete`, { activeHabitId: primaryHabit.id }, { headers: authHeaders });
                        await refreshHabits();
                      } catch (_) {}
                    }}
                    className="mt-4 w-full rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors lg:mt-5"
                  >
                    {nextStep.cta}
                  </button>
                ) : (
                  <Link
                    to={nextStep.to}
                    className="mt-4 block w-full text-center rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors lg:mt-5"
                  >
                    {nextStep.cta}
                  </Link>
                )}
              </section>
            </div>

            {/* Row 2: three columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 xl:gap-8 lg:items-stretch">
              <section className="rounded-2.5xl bg-alignment-surface border border-alignment-accent/[0.06] shadow-apple p-6 sm:p-8 flex flex-col h-full min-h-0">
                <h2 className="text-sm font-semibold text-alignment-accent tracking-tight mb-4">Score over time</h2>
                {scoreHistory.length > 0 ? (
                  <>
                    <div className="h-44 sm:h-48 lg:h-52 flex-1 min-h-[11rem]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={scoreHistory.map((s) => ({
                            ...s,
                            date: new Date(s.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: s.createdAt?.slice?.(0, 4) !== new Date().getFullYear().toString() ? '2-digit' : undefined,
                            }),
                            fullDate: new Date(s.createdAt).toLocaleString(),
                          }))}
                          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6E7158" stopOpacity={0.22} />
                              <stop offset="100%" stopColor="#6E7158" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,46,38,0.06)" vertical={false} />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: 'rgba(44,46,38,0.45)' }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 11, fill: 'rgba(44,46,38,0.45)' }}
                            tickLine={false}
                            axisLine={false}
                            width={28}
                          />
                          <Tooltip
                            content={({ active, payload }) =>
                              active && payload?.[0] ? (
                                <div className="rounded-lg bg-alignment-surface border border-alignment-accent/10 shadow-apple px-3 py-2 text-sm">
                                  <p className="font-medium text-alignment-accent">{payload[0].payload.fullDate}</p>
                                  <p className="text-alignment-accent font-medium">Score: {Number(payload[0].value).toFixed(1)}</p>
                                </div>
                              ) : null
                            }
                          />
                          <Area type="monotone" dataKey="score" stroke="#6E7158" strokeWidth={2} fill="url(#scoreGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="mt-2 text-xs text-alignment-accent/70">
                      {scoreHistory.length} result{scoreHistory.length !== 1 ? 's' : ''}
                    </p>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col justify-center py-6">
                    <p className="text-sm text-alignment-accent/60">No history yet — take the assessment to establish a baseline.</p>
                    <Link
                      to="/assessment"
                      className="mt-4 inline-flex text-sm font-medium text-alignment-accent hover:underline"
                    >
                      Start assessment →
                    </Link>
                  </div>
                )}
              </section>

              <section className="rounded-2.5xl border border-alignment-accent/20 bg-alignment-accent/5 p-6 flex flex-col justify-between h-full min-h-[11rem]">
                {isQuarterlyDue ? (
                  <>
                    <div>
                      <p className="text-xs font-medium text-alignment-accent/70 uppercase tracking-wider mb-2">Quarterly reassessment</p>
                      <p className="text-sm text-alignment-accent/70 leading-relaxed">
                        It’s been about 3 months since your last check-in. Retake to measure progress and adjust habits.
                      </p>
                    </div>
                    <Link
                      to="/assessment"
                      className="mt-4 w-full text-center rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors"
                    >
                      Take quarterly assessment →
                    </Link>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-xs font-medium text-alignment-accent/70 uppercase tracking-wider mb-2">Weekly review</p>
                      <p className="text-sm text-alignment-accent/70 leading-relaxed">Reflect on what held and what drifted — about 10 minutes.</p>
                    </div>
                    <Link
                      to="/reflect"
                      className="mt-4 w-full text-center rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors"
                    >
                      Do it now
                    </Link>
                  </>
                )}
              </section>

              <section className="rounded-2.5xl bg-alignment-surface border border-alignment-accent/[0.06] shadow-apple p-6 flex flex-col h-full min-h-0">
                <h2 className="text-sm font-semibold text-alignment-accent tracking-tight">Other micro-habits</h2>
                <p className="text-alignment-accent/70 text-xs mt-1 mb-4">Small steps today. One habit at a time.</p>
                {habits.length > 1 ? (
                  <div className="space-y-0 flex-1 min-h-0 overflow-y-auto max-h-[280px] lg:max-h-none">
                    {habits.slice(1).map((h) => (
                      <HabitRow
                        key={h.id}
                        habit={h}
                        onComplete={refreshHabits}
                        token={token}
                        API_BASE={API_BASE}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-alignment-accent/55 flex-1">
                    More habits appear after your assessment. Your primary practice is in the first column.
                  </p>
                )}
              </section>
            </div>

            {/* Row 3: two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 xl:gap-8 lg:items-stretch">
              <div className="rounded-2.5xl bg-alignment-surface border border-alignment-accent/[0.06] shadow-apple p-5 sm:p-6">
                <p className="text-xs font-medium text-alignment-accent/70 uppercase tracking-wider mb-4">Your path</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <Link
                    to="/assessment"
                    className="rounded-xl border border-alignment-accent/[0.06] bg-apple-surface-muted p-4 hover:shadow-apple transition-shadow"
                  >
                    <span className="inline-flex h-9 w-9 rounded-full bg-alignment-accent/5 text-alignment-accent items-center justify-center text-sm font-semibold">
                      1
                    </span>
                    <p className="mt-3 font-medium text-alignment-accent text-sm">Assessment</p>
                    <p className="mt-1 text-xs text-alignment-accent/70">24 questions, 5–7 min</p>
                  </Link>
                  <Link
                    to="/results"
                    className="rounded-xl border border-alignment-accent/[0.06] bg-apple-surface-muted p-4 hover:shadow-apple transition-shadow"
                  >
                    <span className="inline-flex h-9 w-9 rounded-full bg-alignment-accent/5 text-alignment-accent items-center justify-center text-sm font-semibold">
                      2
                    </span>
                    <p className="mt-3 font-medium text-alignment-accent text-sm">Results</p>
                    <p className="mt-1 text-xs text-alignment-accent/70">Score, pillars, archetype</p>
                  </Link>
                  <Link
                    to="/progress"
                    className="rounded-xl border border-alignment-accent/[0.06] bg-apple-surface-muted p-4 hover:shadow-apple transition-shadow"
                  >
                    <span className="inline-flex h-9 w-9 rounded-full bg-alignment-accent/5 text-alignment-accent items-center justify-center text-sm font-semibold">
                      3
                    </span>
                    <p className="mt-3 font-medium text-alignment-accent text-sm">Progress</p>
                    <p className="mt-1 text-xs text-alignment-accent/70">Track over time</p>
                  </Link>
                </div>
              </div>

              <div className="rounded-2.5xl border border-alignment-accent/[0.08] bg-alignment-surface px-6 py-8 shadow-apple flex flex-col justify-between h-full min-h-[11rem]">
                <div>
                  <p className="text-xs font-medium text-alignment-accent/70 uppercase tracking-wider mb-2">Go deeper</p>
                  <p className="text-lg font-semibold text-alignment-accent tracking-tight">Habit Engine & Journey</p>
                  <p className="mt-2 text-sm text-alignment-accent/60 leading-relaxed">
                    Daily tracking, weekly review, and structured formation — or the full 90-day architecture program.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    to="/pricing"
                    className="inline-flex rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors"
                  >
                    View pricing →
                  </Link>
                  <Link
                    to="/results"
                    className="inline-flex rounded-full border border-alignment-accent/15 bg-alignment-surface px-5 py-2.5 text-sm font-medium text-alignment-accent hover:bg-alignment-accent/5 transition-colors"
                  >
                    Latest results →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <FormationModal
            show={showFormation && !welcomeOpen}
            onClose={() => setShowFormation(false)}
            aqScore={result?.score}
            daysWithHabits={habitStats?.totalDaysWithActivity ?? 0}
          />
        </>
      )}
    </div>
  );
}
