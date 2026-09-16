import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, networkErrorUserMessage } from '../config/apiBase';
import { DOMAIN_LABELS, DOMAIN_ORDER } from '../constants/domains';
import { domainScoresToDisplayPct } from '../utils/domainScores';
import { collectLocalArchive, formatArchiveDay } from '../utils/engineStorage';
import { fetchRitualArchive } from '../utils/engineRitualsApi';
import { enginePrimaryBtn } from '../utils/engineUi';
import { usePageTitle } from '../hooks/usePageTitle';
import { type } from '../config/siteType';

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function filledText(value) {
  const t = String(value || '').trim();
  return t || null;
}

export default function JourneyPage() {
  const navigate = useNavigate();
  usePageTitle('Journey — Alignment OS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [hasPractices, setHasPractices] = useState(false);
  const [reflections, setReflections] = useState([]);
  const [ritualArchive, setRitualArchive] = useState([]);
  const [localArchive] = useState(() => collectLocalArchive());

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login?returnTo=/journey', { replace: true });
      return;
    }
    Promise.all([
      axios.get(`${API_BASE}/assessment/result`, { headers: authHeaders() }).catch(() => ({ data: null })),
      axios.get(`${API_BASE}/me/reflections`, { headers: authHeaders() }).catch(() => ({ data: [] })),
      axios.get(`${API_BASE}/habits/stats`, { headers: authHeaders() }).catch(() => ({ data: null })),
      fetchRitualArchive().catch(() => []),
    ])
      .then(([resultRes, reflectionRes, statsRes, ritualRows]) => {
        setResult(resultRes.data ?? null);
        setReflections(Array.isArray(reflectionRes.data) ? reflectionRes.data : []);
        setHasPractices(Array.isArray(statsRes.data?.habits) && statsRes.data.habits.length > 0);
        setRitualArchive(Array.isArray(ritualRows) ? ritualRows : []);
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          navigate('/login?returnTo=/journey', { replace: true });
          return;
        }
        setError(
          e.response?.data?.message ||
            (e.code === 'ERR_NETWORK' ? networkErrorUserMessage() : 'Could not load your journey.')
        );
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const hasScore = Boolean(result?.pillarScores || result?.score != null);
  const showBeginLoop = !hasScore && !hasPractices;
  const archive = useMemo(() => {
    const fromReflections = reflections.map((row) => ({
      id: `reflection-${row.id}`,
      day: String(row.createdAt || '').slice(0, 10),
      kind: row.type === 'WEEKLY' ? 'Weekly review' : row.type === 'QUARTERLY' ? 'Quarterly review' : 'Reflection',
      excerpt: Array.isArray(row.answers) ? filledText(row.answers.find(Boolean)) : null,
    }));
    const fromRituals = ritualArchive.map((row) => ({
      id: row.id,
      day: row.day,
      kind: row.kind,
      excerpt: filledText(row.excerpt),
    }));
    const seen = new Set(fromRituals.map((item) => `${item.day}|${item.kind}`));
    const fromLocal = localArchive.filter((item) => !seen.has(`${item.day}|${item.kind}`));
    return [...fromRituals, ...fromLocal, ...fromReflections]
      .filter((item) => item.day)
      .sort((a, b) => b.day.localeCompare(a.day));
  }, [localArchive, reflections, ritualArchive]);

  const latestExcerpt = archive[0]?.excerpt || null;

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="font-display italic text-alignment-accent/45">Loading your journey…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-6 pb-28 pt-10 sm:pt-12">
      <p className={type.kicker}>Your journey</p>
      <h1 className={`mt-4 ${type.h1}`}>
        What is forming.
      </h1>
      <p className="mt-3 text-[17px] text-alignment-accent/55 leading-relaxed">
        Growth, not streaks. The record is yours.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      )}

      {showBeginLoop && (
        <div className="mt-8 bg-alignment-surfaceSoft/80 px-5 py-6 sm:px-6">
          <p className={type.kicker}>Begin the loop</p>
          <p className="mt-3 text-[16px] leading-relaxed text-alignment-accent/70">
            Take the Alignment Score to set your starting point. Everything here shapes itself around your result, and in
            ninety days you will be able to see what changed.
          </p>
          <Link to="/assessment" className={`mt-5 ${enginePrimaryBtn}`}>
            Take the Alignment Score
          </Link>
        </div>
      )}

      <div className={`${showBeginLoop ? 'mt-3' : 'mt-8'} border-l-2 border-alignment-primary bg-alignment-surfaceSoft/80 px-5 py-5 sm:px-6`}>
        <p className="text-[16px] leading-relaxed text-alignment-accent/70">
          {latestExcerpt
            ? latestExcerpt
            : 'Nothing recorded yet. The archive begins with your first morning anchor — and it is never overwritten.'}
        </p>
      </div>

      <div className="mt-10 border-t border-alignment-accent/[0.08] pt-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/40">
          Six domains · latest
        </p>
        {hasScore && result?.pillarScores ? (
          <ul className="mt-5 space-y-0">
            {DOMAIN_ORDER.map((key) => {
              if (result.pillarScores[key] == null) return null;
              const pct = domainScoresToDisplayPct(result.pillarScores, key);
              return (
                <li
                  key={key}
                  className="flex items-baseline justify-between gap-4 border-b border-alignment-accent/[0.06] py-3 last:border-0"
                >
                  <span className="text-[15px] text-alignment-accent">{DOMAIN_LABELS[key]}</span>
                  <span className={`text-[13px] tabular-nums text-alignment-primary`}>{pct}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-[15px] leading-relaxed text-alignment-accent/45">
            Take the Alignment Score to see the six domains here.
          </p>
        )}
      </div>

      <div className="mt-10 border-t border-alignment-accent/[0.08] pt-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-accent/40">The archive</p>
        <p className="mt-4 text-[15px] leading-relaxed text-alignment-accent/45">
          Every reflection you have written, in order. Nothing is deleted.
        </p>
        {archive.length === 0 ? (
          <p className="mt-3 text-[15px] text-alignment-accent/45">Your archive is empty for now.</p>
        ) : (
          <ul className="mt-5 space-y-5">
            {archive.map((item) => (
              <li key={item.id}>
                <p className={type.kicker}>
                  {item.kind}
                  {' · '}
                  {formatArchiveDay(item.day)}
                </p>
                {item.excerpt && (
                  <p className="mt-2 font-display italic text-[1.15rem] leading-snug text-alignment-accent">
                    {item.excerpt}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
