import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { FRESH_RESULT_KEY, markSnapshotContinued } from '../config/productLoop';
import { insightFromResult } from '../config/domainInsight';
import { type } from '../config/siteType';
import { pillPrimary } from '../components/HomeMarketingChrome';
import { usePageTitle } from '../hooks/usePageTitle';
import { consumeClaimNote } from '../utils/guestClaim';

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function readHandoff() {
  try {
    const raw = sessionStorage.getItem(FRESH_RESULT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    delete data._freshSubmission;
    return data;
  } catch (_) {
    return null;
  }
}

/**
 * After the Assessment: name what they saw, then open Alignment OS —
 * without dumping the whole product or a pricing page.
 */
export default function SnapshotPage() {
  const navigate = useNavigate();
  usePageTitle('Your Alignment Snapshot — Alignment OS');
  const [result, setResult] = useState(() => readHandoff());
  const [loading, setLoading] = useState(!readHandoff());
  const [error, setError] = useState(null);
  const [claimNote, setClaimNote] = useState('');

  useEffect(() => {
    setClaimNote(consumeClaimNote());
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login?returnTo=/snapshot', { replace: true });
      return undefined;
    }

    let cancelled = false;
    axios
      .get(`${API_BASE}/assessment/result`, { headers: authHeaders(), timeout: 8000 })
      .then((res) => {
        if (cancelled) return;
        if (res.data) setResult(res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 401) {
          navigate('/login?returnTo=/snapshot', { replace: true });
          return;
        }
        if (!readHandoff()) {
          setError(err.response?.data?.message || 'Could not load your snapshot.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const score =
    result?.score != null && Number.isFinite(Number(result.score))
      ? Math.round(Math.max(0, Math.min(100, Number(result.score))))
      : null;
  const strain = result?.primaryStrainLabel || null;
  const insight = insightFromResult(result);
  const attention = (insight?.thin || result?.primaryStrainDescription || '').trim();
  const typeTitle = result?.alignmentTypeTitle || null;
  const practice = insight?.practice;

  const continueIntoOs = () => {
    markSnapshotContinued();
  };

  if (loading && !result) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className="font-display font-medium text-alignment-accent/65">Loading your snapshot…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className={type.kicker}>Alignment Snapshot</p>
        <h1 className={`mt-4 ${type.h1}`}>No snapshot yet.</h1>
        <p className={`mt-4 ${type.body}`}>
          {claimNote || error || 'Take the Assessment. This page is what comes after.'}
        </p>
        <Link to="/assessment" className={`${pillPrimary} mt-10`}>
          Take the Assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-6 pb-20 pt-12 sm:pt-16">
      {claimNote ? (
        <p
          className="mb-6 rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-sm text-alignment-accent/90 leading-relaxed text-center"
          role="status"
        >
          {claimNote}
        </p>
      ) : null}
      <p className={`${type.kicker} text-center`}>Assessment result</p>
      <h1 className={`mt-5 text-center ${type.h1}`}>Your Alignment Snapshot</h1>

      <div className="mt-10 text-center">
        <p className="font-display text-[4rem] sm:text-[4.5rem] font-medium leading-none tabular-nums text-alignment-accent tracking-tight">
          {score ?? '—'}
        </p>
        <p className="mt-4 text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.22em] text-alignment-accent/70">
          Alignment Score · out of 100
        </p>
        {typeTitle ? (
          <p className="mt-8 font-display font-medium text-xl sm:text-2xl text-alignment-accent leading-snug">
            {typeTitle}
          </p>
        ) : null}
        {strain ? (
          <p className="mt-3 font-display text-lg sm:text-xl text-alignment-primary leading-snug">
            {strain}
          </p>
        ) : null}
      </div>

      <section className="mt-14 border-t border-alignment-accent/[0.08] pt-10">
        <h2 className={type.h2}>This is the thin place.</h2>
        <p className={`mt-4 ${type.body}`}>
          {attention
            ? attention
            : strain
              ? `${strain} is the thin place. The practice starts there.`
              : 'The lowest domain is the thin place. The practice starts there.'}
        </p>
        {insight?.why ? <p className={`mt-4 ${type.body}`}>{insight.why}</p> : null}
      </section>

      <section className="mt-14 border-t border-alignment-accent/[0.08] pt-10">
        <p className={type.kicker}>Your plan</p>
        <h2 className={`mt-4 ${type.h2}`}>{practice?.title || 'One focus, already chosen'}</h2>
        <p className={`mt-4 ${type.body}`}>
          {practice?.description ||
            'My Plan holds the focus from this snapshot. Daily carries the practice. You do not set it up yourself.'}
        </p>
      </section>

      <div className="mt-12 flex justify-center">
        <Link to="/plan" onClick={continueIntoOs} className={pillPrimary}>
          Open My Plan
        </Link>
      </div>
    </div>
  );
}
