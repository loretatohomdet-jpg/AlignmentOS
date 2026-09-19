import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import DomainPillarIcon from '../components/DomainPillarIcon';
import { pillGhost, pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import AlignmentMapHex from '../components/AlignmentMapHex';
import { DOMAIN_LABELS, DOMAIN_ORDER, PILLAR_INTRO } from '../constants/domains';
import { API_BASE } from '../config/apiBase';
import { usePageTitle } from '../hooks/usePageTitle';

function hasPillarScores(result) {
  return Boolean(result?.pillarScores && Object.keys(result.pillarScores).length);
}

function strainPillar(result) {
  if (result?.primaryDomain) return result.primaryDomain;
  if (!result?.primaryStrainLabel) return null;
  return DOMAIN_ORDER.find((p) => DOMAIN_LABELS[p] === result.primaryStrainLabel) || null;
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
