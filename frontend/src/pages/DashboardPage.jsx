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
import { type } from '../config/siteType';
import { sawSnapshotContinue } from '../config/productLoop';

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
      {label && <p className="mt-1 text-sm text-alignment-accent/90">{label}</p>}
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
      if (
        localStorage.getItem('alignment_os_dashboard_welcome_dismissed') !== '1' &&
        !sawSnapshotContinue()
      ) {
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
        <p className="text-alignment-accent/90">Unable to load your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-alignment-accent/90">Loading...</p>
      </div>
    );
  }

  const firstName = user?.name?.split(/\s+/)[0] || 'there';
  const todayStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  const lastTakenAt = result?.createdAt ? new Date(result.createdAt) : null;
  const daysSinceAssessment = lastTakenAt ? Math.floor((Date.now() - lastTakenAt.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isQuarterlyDue = daysSinceAssessment !== null && daysSinceAssessment >= 90;

  const nextStep = !result
    ? { label: 'Take the assessment', to: '/assessment', cta: 'Start →' }
    : { label: 'The day has three rooms.', to: '/practice', cta: 'Open Practice →' };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
      <DashboardWelcomeModal
        open={welcomeOpen}
        onDismiss={dismissWelcome}
        hasScore={Boolean(result)}
        hasHabits={habits.length > 0}
      />

      {error && (
        <div className="mb-6 rounded-2xl bg-alignment-surface border border-alignment-accent/15 px-4 py-3 text-sm text-alignment-accent">
          {error}
        </div>
      )}

      {user && (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-2 animate-fade-in">
            <h1 className={`${type.h1} tracking-tight`}>
              Hi, {firstName}
            </h1>
            <p className="text-sm text-alignment-accent/90">{todayStr}</p>
          </div>
          <p className="mt-3 text-sm text-alignment-accent/90 leading-relaxed max-w-xl">
            Practice holds the day. This page holds the record — your score and map.
          </p>
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

          {habitStats?.engineActive && habitStats?.prompt && (
            <div className="mt-6 rounded-2xl border border-alignment-primary/20 bg-alignment-primary/[0.06] p-5 sm:p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-primary">
                Today’s hold
              </p>
              <p className="mt-2 font-medium text-alignment-accent">{habitStats.prompt.title}</p>
              <p className="mt-1 text-sm text-alignment-accent/90 leading-relaxed">{habitStats.prompt.body}</p>
              <Link to="/practice" className="mt-3 inline-block text-sm font-medium text-alignment-accent hover:underline">
                Open Practice →
              </Link>
            </div>
          )}

          <div className="mt-8 lg:mt-10 space-y-6 lg:space-y-8 animate-slide-up">
            {/* Row 1: three columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 xl:gap-8 lg:items-stretch">
              <section className="rounded-2.5xl bg-alignment-surface border border-alignment-accent/[0.06] shadow-apple p-6 sm:p-8 flex flex-col justify-between h-full min-h-0">
                <div>
                  <p className="text-xs font-medium text-alignment-accent/65 uppercase tracking-wider mb-2">The day</p>
                  <p className="font-medium text-alignment-accent">Morning, midday, close.</p>
                  <p className="mt-2 text-sm text-alignment-accent/90 leading-relaxed">
                    Write here in Practice. It is saved when you hold a room.
                  </p>
                </div>
                <Link
                  to="/practice"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90"
                >
                  Open Practice →
                </Link>
              </section>

              <section className="rounded-2.5xl bg-alignment-surface border border-alignment-accent/[0.06] shadow-apple p-6 sm:p-8 flex flex-col items-center justify-between gap-4 h-full min-h-0">
                <div className="w-full text-center lg:text-left">
                  <p className="text-xs font-medium text-alignment-accent/65 uppercase tracking-wider mb-1">Alignment Score</p>
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
                  <p className="text-xs font-medium text-alignment-accent/65 uppercase tracking-wider mb-2">Next Step</p>
                  <p className="font-medium text-alignment-accent">{nextStep.label}</p>
                </div>
                <Link
                    to={nextStep.to}
                    className="mt-4 block w-full text-center rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors lg:mt-5"
                  >
                    {nextStep.cta}
                  </Link>
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
                            tick={{ fontSize: 11, fill: 'rgba(44,46,38,0.65)' }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 11, fill: 'rgba(44,46,38,0.65)' }}
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
                    <p className="mt-2 text-xs text-alignment-accent/90">
                      {scoreHistory.length} result{scoreHistory.length !== 1 ? 's' : ''}
                    </p>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col justify-center py-6">
                    <p className="text-sm text-alignment-accent/90">No history yet — take the assessment to establish a baseline.</p>
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
                      <p className="text-xs font-medium text-alignment-accent/65 uppercase tracking-wider mb-2">Quarterly reassessment</p>
                      <p className="text-sm text-alignment-accent/90">Retake to measure progress</p>
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
                      <p className="text-xs font-medium text-alignment-accent/65 uppercase tracking-wider mb-2">Today</p>
                      <p className="text-sm text-alignment-accent/90">Morning, midday, close.</p>
                    </div>
                    <Link
                      to="/practice"
                      className="mt-4 w-full text-center rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors"
                    >
                      Open Practice
                    </Link>
                  </>
                )}
              </section>

              <section className="rounded-2.5xl bg-alignment-surface border border-alignment-accent/[0.06] shadow-apple p-6 flex flex-col h-full min-h-0">
                <h2 className="text-sm font-semibold text-alignment-accent tracking-tight">Your map</h2>
                <p className="mt-3 text-sm text-alignment-accent/90 leading-relaxed flex-1">
                  {result
                    ? 'Six domains from the diagnostic. This is the picture of your record.'
                    : 'Empty until you take the diagnostic. Twelve minutes. Then it fills.'}
                </p>
                {result ? (
                  <>
                    <Link to="/alignment-map" className="mt-4 text-sm font-medium text-alignment-accent hover:underline">
                      Open the map →
                    </Link>
                    <Link to="/results" className="mt-2 text-sm font-medium text-alignment-accent hover:underline">
                      Full results →
                    </Link>
                    <Link to="/journey" className="mt-2 text-sm font-medium text-alignment-accent hover:underline">
                      What you have written →
                    </Link>
                  </>
                ) : (
                  <Link to="/assessment" className="mt-4 text-sm font-medium text-alignment-accent hover:underline">
                    Take the diagnostic →
                  </Link>
                )}
              </section>
            </div>

            {/* Archive */}
            <div className="rounded-2.5xl border border-alignment-accent/[0.08] bg-alignment-surface px-6 py-6 shadow-apple flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-alignment-accent/65 uppercase tracking-wider mb-1">The archive</p>
                <p className="font-medium text-alignment-accent">What you write in Practice is kept.</p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Link
                  to="/journey"
                  className="inline-flex rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 transition-colors"
                >
                  Open the archive →
                </Link>
                <Link
                  to="/alignment-map"
                  className="inline-flex rounded-full border border-alignment-accent/15 bg-alignment-surface px-5 py-2.5 text-sm font-medium text-alignment-accent hover:bg-alignment-accent/5 transition-colors"
                >
                  Map →
                </Link>
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
