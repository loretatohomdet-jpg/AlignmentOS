import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import DomainPillarIcon from '../components/DomainPillarIcon';
import { pillGhost, pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import { DOMAIN_LABELS, DOMAIN_ORDER, PILLAR_INTRO } from '../constants/domains';
import { API_BASE } from '../config/apiBase';
import { domainScoresToDisplayPct } from '../utils/domainScores';
import { usePageTitle } from '../hooks/usePageTitle';

const MAP_NODES = [
  { pillar: 'IDENTITY', label: 'Identity', sub: 'Who you are', angle: -90 },
  { pillar: 'PURPOSE', label: 'Purpose', sub: 'What you are for', angle: -30 },
  { pillar: 'EXECUTION', label: 'Execution', sub: 'How you follow through', angle: 30 },
  { pillar: 'HABITS', label: 'Habits', sub: 'What you do daily', angle: 90 },
  { pillar: 'ENVIRONMENT', label: 'Environment', sub: 'What surrounds you', angle: 150 },
  { pillar: 'MINDSET', label: 'Mindset', sub: 'How you think', angle: 210 },
];

function hasPillarScores(result) {
  return Boolean(result?.pillarScores && Object.keys(result.pillarScores).length);
}

function pctFor(result, pillar) {
  if (!hasPillarScores(result)) return null;
  return domainScoresToDisplayPct(result.pillarScores, pillar);
}

function strainPillar(result) {
  if (result?.primaryDomain) return result.primaryDomain;
  if (!result?.primaryStrainLabel) return null;
  return DOMAIN_ORDER.find((p) => DOMAIN_LABELS[p] === result.primaryStrainLabel) || null;
}

function AlignmentMapHex({ result }) {
  const cx = 210;
  const cy = 210;
  const rHex = 118;
  const rNode = 132;
  const rLine = 108;
  const rad = (deg) => (deg * Math.PI) / 180;
  const pt = (deg, radius) => ({
    x: cx + radius * Math.cos(rad(deg)),
    y: cy + radius * Math.sin(rad(deg)),
  });
  const hexPoints = MAP_NODES.map((_, i) => {
    const p = pt(-90 + i * 60, rHex);
    return `${p.x},${p.y}`;
  }).join(' ');
  const strain = strainPillar(result);
  const scored = hasPillarScores(result);
  const score = result?.score != null ? Math.round(Number(result.score)) : null;

  return (
    <svg
      viewBox="-28 -20 476 460"
      className="w-full h-auto max-w-xl mx-auto text-alignment-accent"
      role="img"
      aria-label={
        score != null
          ? `Alignment map. Score ${score} out of 100. Primary strain ${result?.primaryStrainLabel || strain || ''}.`
          : 'Six domains arranged around Alignment OS.'
      }
    >
      <polygon
        points={hexPoints}
        className="fill-alignment-accent/[0.04] stroke-alignment-accent/[0.12]"
        strokeWidth="1"
      />
      {MAP_NODES.map((d) => {
        const p = pt(d.angle, rLine);
        return (
          <line
            key={`spoke-${d.pillar}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            className="stroke-alignment-accent/15"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        );
      })}
      <circle cx={cx} cy={cy} r="52" className="fill-white stroke-alignment-accent/[0.12]" strokeWidth="1" />
      {score != null ? (
        <>
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            className="fill-alignment-accent font-display"
            style={{ fontFamily: 'Georgia, ui-serif, serif', fontSize: 28 }}
          >
            {score}
          </text>
          <text
            x={cx}
            y={cy + 20}
            textAnchor="middle"
            className="fill-alignment-accent/50"
            style={{ fontSize: 9, letterSpacing: '0.16em' }}
          >
            SCORE
          </text>
        </>
      ) : (
        <>
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            className="fill-alignment-accent font-display italic"
            style={{ fontFamily: 'Georgia, ui-serif, serif', fontSize: 15 }}
          >
            Alignment
          </text>
          <text
            x={cx}
            y={cy + 18}
            textAnchor="middle"
            className="fill-alignment-accent"
            style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em' }}
          >
            OS
          </text>
        </>
      )}
      {MAP_NODES.map((d) => {
        const outer = pt(d.angle, rNode);
        const pct = pctFor(result, d.pillar);
        const fillOpacity = pct == null ? 0.12 : 0.12 + (pct / 100) * 0.72;
        const isStrain = strain === d.pillar;
        return (
          <g key={d.pillar}>
            {isStrain && (
              <circle cx={outer.x} cy={outer.y} r="22" fill="none" stroke="#6E7158" strokeWidth="1.5" />
            )}
            {scored ? (
              <circle cx={outer.x} cy={outer.y} r="16" fill="#6E7158" fillOpacity={fillOpacity} stroke="#6E7158" strokeOpacity="0.35" strokeWidth="1" />
            ) : (
              <>
                <circle cx={outer.x} cy={outer.y} r="16" className="fill-white stroke-alignment-accent/20" strokeWidth="1" />
                <circle cx={outer.x} cy={outer.y} r="5" className="fill-alignment-accent/45" />
              </>
            )}
          </g>
        );
      })}
      {MAP_NODES.map((d) => {
        const outer = pt(d.angle, rNode);
        const pct = pctFor(result, d.pillar);
        const isLeft = d.angle === 150 || d.angle === 210;
        const isRight = d.angle === -30 || d.angle === 30;
        const isTop = d.angle === -90;
        let x = outer.x - 58;
        let y = outer.y - 30;
        let align = 'text-center';
        if (isTop) {
          y = outer.y - 52;
        } else if (d.angle === 90) {
          y = outer.y + 20;
        } else if (isRight) {
          x = outer.x + 22;
          y = outer.y - 16;
          align = 'text-left';
        } else if (isLeft) {
          x = outer.x - 138;
          y = outer.y - 16;
          align = 'text-right';
        }
        return (
          <foreignObject key={`fo-${d.pillar}`} x={x} y={y} width="116" height="48">
            <div className={`${align} leading-tight px-1`}>
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-alignment-accent">{d.label}</p>
              <p className="mt-0.5 text-[8px] text-alignment-accent/80">{pct != null ? `${pct}%` : d.sub}</p>
            </div>
          </foreignObject>
        );
      })}
    </svg>
  );
}

export default function AlignmentMapPage() {
  usePageTitle('Alignment map — Alignment OS');
  const [loading, setLoading] = useState(() => typeof window !== 'undefined' && !!localStorage.getItem('accessToken'));
  const [result, setResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get(`${API_BASE}/assessment/result`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setResult(res.data ?? null))
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, []);

  const hasMap = hasPillarScores(result);
  const strain = strainPillar(result);
  const strainLabel = result?.primaryStrainLabel || (strain ? DOMAIN_LABELS[strain] : null);

  return (
    <div className={`${type.page} overflow-x-hidden`}>
      <a href="#alignment-map-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="alignment-map-main" className="flex-1 w-full min-w-0 scroll-mt-16" tabIndex={-1}>
        <section className="max-w-3xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-8 text-center">
          <p className={type.kicker}>Alignment map</p>
          <h1 className={`mt-6 ${type.h1} text-balance`}>
            {hasMap ? 'Where it holds. Where it strains.' : 'Six domains. One map.'}
          </h1>
          <p className={`mt-6 ${type.body} max-w-xl mx-auto`}>
            {hasMap
              ? 'This is the picture of your record — six domains from the diagnostic. Practice holds the day; this page does not.'
              : 'The map is empty until you take the diagnostic. Twelve minutes. Then your score sits on each domain.'}
          </p>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.08] bg-alignment-surface px-4 sm:px-8 py-10 sm:py-14 overflow-x-hidden">
          <div className="max-w-xl mx-auto min-w-0">
            {loading ? (
              <p className="text-center text-alignment-accent/75">Loading the map…</p>
            ) : (
              <AlignmentMapHex result={hasMap ? result : null} />
            )}
          </div>
          {hasMap && strainLabel && (
            <p className="mt-6 text-center text-sm text-alignment-accent/90">
              Primary strain · <span className="text-alignment-accent font-medium">{strainLabel}</span>
            </p>
          )}
        </section>

        <section className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <h2 className={type.h2}>The six domains</h2>
          <ul className="mt-8 space-y-4">
            {DOMAIN_ORDER.map((pillar) => {
              const pct = hasMap ? pctFor(result, pillar) : null;
              const isStrain = strain === pillar;
              return (
                <li
                  key={pillar}
                  className={`rounded-xl border bg-alignment-surface px-4 py-4 sm:px-5 ${
                    isStrain ? 'border-alignment-primary/35' : 'border-alignment-accent/[0.08]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <DomainPillarIcon pillar={pillar} className="h-6 w-6 shrink-0 text-alignment-primary mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-medium text-alignment-accent">
                          {DOMAIN_LABELS[pillar]}
                          {isStrain ? <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-alignment-primary">Strain</span> : null}
                        </p>
                        {pct != null && <span className="tabular-nums text-sm text-alignment-accent/85 shrink-0">{pct}%</span>}
                      </div>
                      <p className="mt-1 text-sm text-alignment-accent/90 leading-relaxed">{PILLAR_INTRO[pillar]}</p>
                      {pct != null && (
                        <div className="mt-3 h-1.5 rounded-full bg-alignment-accent/[0.08] overflow-hidden">
                          <div className="h-full rounded-full bg-alignment-primary" style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            {hasMap ? (
              <>
                <Link to="/practice" className={pillPrimary}>
                  Open Practice
                </Link>
                <Link to="/dashboard" className={pillGhost}>
                  Back to your record
                </Link>
              </>
            ) : (
              <>
                <Link to="/assessment" className={pillPrimary}>
                  Take the diagnostic
                </Link>
                <Link to="/dashboard" className={pillGhost}>
                  Your record
                </Link>
              </>
            )}
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
