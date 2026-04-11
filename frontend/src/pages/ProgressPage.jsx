import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { domainScoresToDisplayPct } from '../utils/domainScores';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { API_BASE } from '../config/apiBase';

export default function ProgressPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);

  const token = localStorage.getItem('accessToken');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (!token) {
      setLoading(false);
      navigate('/login?returnTo=/progress', { replace: true });
      return;
    }
    const fetch = async () => {
      setLoading(true);
      try {
        const [resultRes, historyRes] = await Promise.all([
          axios.get(`${API_BASE}/assessment/result`, { headers: authHeaders }).catch(() => ({ data: null })),
          axios.get(`${API_BASE}/assessment/history`, { headers: authHeaders }).catch(() => ({ data: [] })),
        ]);
        setResult(resultRes.data ?? null);
        setScoreHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login?returnTo=/progress', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [navigate, token]);

  const chartData = scoreHistory
    .map((s) => ({
      ...s,
      date: new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: s.createdAt?.slice?.(0, 4) !== String(new Date().getFullYear()) ? '2-digit' : undefined }),
      fullDate: new Date(s.createdAt).toLocaleString(),
      score: Number(s.score),
    }))
    .reverse();

  if (!localStorage.getItem('accessToken')) return null;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <p className="text-alignment-accent/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">Progress</h1>
      <p className="mt-2 text-alignment-accent/70">Awareness, not performance. Clarity over time.</p>

      <div className="mt-10 space-y-6">
        {/* Alignment Score — quarterly awareness */}
        <div className="rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 sm:p-8">
          <p className="text-sm font-medium text-alignment-accent/70 uppercase tracking-wider mb-2">Alignment Score</p>
          <p className="text-sm text-alignment-accent/70 mb-4">Clarity over time.</p>
          {chartData.length > 0 ? (
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
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
                          <p className="font-medium text-alignment-accent">
                            Score: {Number(payload[0].value).toFixed(1)}
                          </p>
                        </div>
                      ) : null
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6E7158"
                    strokeWidth={2}
                    dot={{ fill: '#6E7158', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 sm:h-64 flex flex-col items-center justify-center text-alignment-accent/70 text-center">
              <p>Take the assessment to start tracking your score.</p>
              <Link to="/assessment" className="mt-3 text-sm font-medium text-alignment-accent hover:underline">
                Take assessment →
              </Link>
            </div>
          )}
        </div>

        {/* Pillar direction — simple descriptors, no daily metrics */}
        {result?.pillarScores && typeof result.pillarScores === 'object' && (
          <div className="rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 sm:p-8">
            <p className="text-sm font-medium text-alignment-accent/70 uppercase tracking-wider mb-4">Pillar trends</p>
            <div className="space-y-3">
              {['IDENTITY', 'PURPOSE', 'MINDSET', 'HABITS', 'ENVIRONMENT', 'EXECUTION'].map((key) => {
                const score = result.pillarScores[key];
                if (score == null) return null;
                const label = {
                  IDENTITY: 'Identity',
                  PURPOSE: 'Purpose',
                  MINDSET: 'Mindset',
                  HABITS: 'Habits',
                  ENVIRONMENT: 'Environment',
                  EXECUTION: 'Execution',
                }[key];
                const pct = domainScoresToDisplayPct(result.pillarScores, key);
                const prevRaw =
                  scoreHistory.length >= 2 ? scoreHistory[scoreHistory.length - 2]?.pillarScores?.[key] : null;
                const prevProfile = scoreHistory.length >= 2 ? scoreHistory[scoreHistory.length - 2]?.pillarScores : null;
                const prevPct =
                  prevRaw != null && prevProfile && typeof prevProfile === 'object'
                    ? domainScoresToDisplayPct(prevProfile, key)
                    : null;
                const dir = prevPct != null ? (pct > prevPct ? '↑' : pct < prevPct ? '↓' : '→') : '→';
                const descriptor = pct >= 70 ? 'steady' : pct >= 50 ? 'improving' : 'growth edge';
                return (
                  <div key={key} className="flex items-center justify-between gap-4 py-2 border-b border-alignment-accent/5 last:border-0">
                    <span className="font-medium text-alignment-accent">{label}</span>
                    <span className="text-alignment-accent/70 text-sm">{dir} {descriptor}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/results" className="text-sm font-medium text-alignment-accent hover:underline">
          View full results →
        </Link>
        <Link to="/assessment" className="text-sm font-medium text-alignment-accent hover:underline">
          Retake assessment →
        </Link>
      </div>
    </div>
  );
}
