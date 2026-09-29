import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { insightFromResult } from '../config/domainInsight';
import { formationTeachableUrl } from '../config/externalLinks';
import { type } from '../config/siteType';
import { pillPrimary, pillGhost } from '../components/HomeMarketingChrome';
import { usePageTitle } from '../hooks/usePageTitle';

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function FormationPage() {
  const navigate = useNavigate();
  usePageTitle('Formation — Alignment OS');
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login?returnTo=/formation', { replace: true });
      return undefined;
    }
    let cancelled = false;
    axios
      .get(`${API_BASE}/assessment/result`, { headers: authHeaders() })
      .then((res) => {
        if (cancelled) return;
        setInsight(insightFromResult(res.data));
      })
      .catch((e) => {
        if (cancelled) return;
        if (e.response?.status === 401) {
          navigate('/login?returnTo=/formation', { replace: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const href = formationTeachableUrl({ domain: insight?.domain });
  const trackLabel = insight?.label || null;

  return (
    <div className="mx-auto w-full max-w-lg px-6 pb-20 pt-10 sm:pt-14">
      <p className={type.kicker}>Formation</p>
      <h1 className={`mt-4 ${type.h1}`}>Go deeper when you are ready.</h1>
      <p className={`mt-4 ${type.body}`}>
        Formation lives on Teachable — tracks for Identity, Purpose, Attention, Habits, Environment, and Stewardship.
        Lessons, reflection, practice, and resources are there. Alignment OS keeps the assessment, My Plan, and the day.
      </p>

      {trackLabel ? (
        <section className="mt-10 rounded-2xl border border-alignment-primary/20 bg-alignment-primary/[0.06] px-6 py-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-alignment-primary">Your thin place</p>
          <p className="mt-3 font-display text-xl font-medium text-alignment-accent leading-snug">
            {trackLabel}
          </p>
          <p className="mt-2 text-sm text-alignment-accent/90 leading-relaxed">
            Start the {trackLabel} track on Teachable. It matches what My Plan is holding.
          </p>
        </section>
      ) : (
        <p className={`mt-4 ${type.body}`}>
          When your plan names a thin place, open Formation and start the matching track.
        </p>
      )}

      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        <a href={href} target="_blank" rel="noopener noreferrer" className={pillPrimary}>
          {trackLabel ? `Open ${trackLabel} on Teachable →` : 'Open Formation on Teachable →'}
        </a>
        <Link to="/plan" className={pillGhost}>
          Back to My Plan
        </Link>
      </div>
    </div>
  );
}
