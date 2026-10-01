import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import AlignmentMapHex from '../components/AlignmentMapHex';
import { SitePageFooter, pillPrimary } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import { insightFromResult } from '../config/domainInsight';
import { DOMAIN_ORDER } from '../constants/domains';
import { API_BASE } from '../config/apiBase';
import { usePageTitle } from '../hooks/usePageTitle';
import { domainScoresToDisplayPct } from '../utils/domainScores';

const LABELS = {
  IDENTITY: 'Identity',
  PURPOSE: 'Purpose',
  MINDSET: 'Mindset',
  HABITS: 'Habits',
  ENVIRONMENT: 'Environment',
  EXECUTION: 'Follow-through',
};

function hasPillarScores(result) {
  return Boolean(result?.pillarScores && Object.keys(result.pillarScores).length);
}

function pctFor(result, pillar) {
  if (!hasPillarScores(result)) return null;
  return domainScoresToDisplayPct(result.pillarScores, pillar);
}

function monthLabel(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export default function AlignmentMapPage() {
  usePageTitle('Your Alignment Map — Alignment OS');
  const [loading, setLoading] = useState(() => typeof window !== 'undefined' && !!localStorage.getItem('accessToken'));
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState('current');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(`${API_BASE}/assessment/result`, { headers }).then((res) => res.data).catch(() => null),
      axios.get(`${API_BASE}/assessment/history`, { headers }).then((res) => (Array.isArray(res.data) ? res.data : [])).catch(() => []),
    ])
      .then(([latest, scores]) => {
        setResult(latest);
        setHistory(scores);
      })
      .finally(() => setLoading(false));
  }, []);

  const hasMap = hasPillarScores(result);
  const insight = insightFromResult(result);
  const strain = result?.primaryDomain || insight?.domain || null;
  const strainLabel = strain ? LABELS[strain] || result?.primaryStrainLabel : null;
  const score =
    result?.score != null && Number.isFinite(Number(result.score))
      ? Math.round(Math.max(0, Math.min(100, Number(result.score))))
      : null;
  const previous = history.length > 1 ? history[history.length - 2] : null;
  const previousScore = previous?.score != null ? Math.round(Number(previous.score)) : null;
  const delta = score != null && previousScore != null ? score - previousScore : null;
  const attention = (insight?.thin || result?.primaryStrainDescription || '').trim();

  return (
    <div className={`${type.page} overflow-x-hidden`}>
      <a href="#alignment-map-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="alignment-map-main" className="flex-1 w-full min-w-0 scroll-mt-16" tabIndex={-1}>
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h1 className={type.h1}>Your Alignment Map</h1>
              <p className="mt-3 font-display text-lg text-alignment-accent">See the whole picture.</p>
              <p className={`mt-2 ${type.body}`}>
                Your Alignment Map shows how your six areas work together. It helps you see what’s working, what’s getting in the way, and where to focus next.
              </p>
            </div>
            {hasMap ? (
              <p className="shrink-0 rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-2 text-sm text-alignment-accent">
                {monthLabel(result?.createdAt)}
              </p>
            ) : null}
          </div>

          {loading ? <p className="mt-12 text-alignment-accent/75">Loading the map…</p> : null}

          {!loading && !hasMap ? (
            <div className="mt-12 max-w-lg">
              <p className={type.body}>The map is empty until you take the assessment. Twelve minutes. Then each area has a score.</p>
              <Link to="/assessment" className={`${pillPrimary} mt-8`}>
                Take the assessment
              </Link>
            </div>
          ) : null}

          {!loading && hasMap ? (
            <>
              <div className="mt-8 flex gap-6 border-b border-alignment-accent/10">
                {[
                  ['current', 'Current'],
                  ['progress', 'Progress'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`pb-3 text-sm ${tab === id ? 'border-b-2 border-alignment-accent font-medium text-alignment-accent' : 'text-alignment-accent/60'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === 'current' ? (
                <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
                  <div className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface/60 p-4 sm:p-6">
                    <AlignmentMapHex result={result} />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="rounded-2xl border border-alignment-accent/10 bg-white p-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-alignment-accent/60">Your overall score</p>
                      <p className="mt-2 font-display text-4xl text-alignment-accent">
                        {score}
                        <span className="text-xl text-alignment-accent/50"> / 100</span>
                      </p>
                      {delta != null ? (
                        <p className="mt-2 text-sm text-alignment-accent/75">
                          {delta > 0 ? `+${delta}` : delta} from last assessment
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-alignment-accent/70">From this assessment.</p>
                      )}
                      <div className="mt-4 h-1.5 rounded-full bg-alignment-accent/10 overflow-hidden" aria-hidden>
                        <div className="h-full rounded-full bg-alignment-primary" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-alignment-primary/15 bg-alignment-primary/[0.08] p-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-alignment-primary">Your primary attention area</p>
                      <p className="mt-2 font-display text-2xl text-alignment-accent">{strainLabel}</p>
                      <p className={`mt-3 ${type.body}`}>{attention || 'This is the area to practise first.'}</p>
                      <Link to="/practice" className={`${pillPrimary} mt-5`}>
                        See suggested practices →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-alignment-accent/10 bg-white p-5 sm:p-6">
                  <h2 className={type.h3}>Your progress</h2>
                  {history.length < 2 ? (
                    <p className={`mt-3 ${type.body}`}>
                      This is your first map. Progress shows after you take the assessment again, so there is a previous result to compare.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {history.map((row) => (
                        <li key={row.createdAt} className="flex items-center justify-between gap-4 text-sm">
                          <span className="text-alignment-accent/75">{monthLabel(row.createdAt)}</span>
                          <span className="font-medium tabular-nums text-alignment-accent">{Math.round(Number(row.score))} / 100</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-alignment-accent/10 bg-white p-5 lg:col-span-1">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-alignment-accent/60">Your scores</p>
                  <ul className="mt-4 grid grid-cols-2 gap-3">
                    {DOMAIN_ORDER.map((pillar) => (
                      <li key={pillar}>
                        <p className="text-xs text-alignment-accent/65">{LABELS[pillar]}</p>
                        <p className="font-display text-xl text-alignment-accent">{pctFor(result, pillar)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-alignment-accent/10 bg-white p-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-alignment-accent/60">Where you stand</p>
                  <ul className="mt-4 space-y-3">
                    {DOMAIN_ORDER.map((pillar) => {
                      const pct = pctFor(result, pillar) ?? 0;
                      return (
                        <li key={pillar}>
                          <div className="flex justify-between text-xs text-alignment-accent/75">
                            <span>{LABELS[pillar]}</span>
                            <span className="tabular-nums">{pct}</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-alignment-accent/10 overflow-hidden">
                            <div className="h-full rounded-full bg-alignment-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="rounded-2xl border border-alignment-accent/10 bg-white p-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-alignment-accent/60">What’s next</p>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li><Link to="/results" className="text-alignment-accent hover:text-alignment-primary">View your personalized insights →</Link></li>
                    <li><Link to="/practice" className="text-alignment-accent hover:text-alignment-primary">Explore practices{strainLabel ? ` for ${strainLabel}` : ''} →</Link></li>
                    <li><Link to="/plan" className="text-alignment-accent hover:text-alignment-primary">Update your plan →</Link></li>
                    <li><Link to="/assessment" className="text-alignment-accent hover:text-alignment-primary">Retake assessment →</Link></li>
                  </ul>
                </div>
              </div>
            </>
          ) : null}
        </section>
      </main>
      <SitePageFooter />
    </div>
  );
}
