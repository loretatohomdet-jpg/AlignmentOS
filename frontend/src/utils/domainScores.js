import { DOMAIN_ORDER } from '../constants/domains';

/**
 * v1.0 stores per-domain raw sums (4–20). Legacy profiles store 0–100 percentages.
 */
export function isRawDomainScoreObject(pillarScores) {
  if (!pillarScores || typeof pillarScores !== 'object') return false;
  const keys = DOMAIN_ORDER.filter((k) => pillarScores[k] != null);
  if (keys.length !== DOMAIN_ORDER.length) return false;
  return keys.every((k) => {
    const v = pillarScores[k];
    return Number.isFinite(v) && Number.isInteger(v) && v >= 4 && v <= 20;
  });
}

/** Map domain raw sum (4–20) to display percentage 0–100 */
export function domainRawToDisplayPct(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(((n - 4) / 16) * 100)));
}

/** Legacy profiles store 0–100 per domain; v1.0 stores raw 4–20 for all six keys */
export function domainScoresToDisplayPct(pillarScores, key) {
  const v = pillarScores?.[key];
  if (v == null || !Number.isFinite(Number(v))) return 0;
  if (isRawDomainScoreObject(pillarScores)) return domainRawToDisplayPct(v);
  return Math.max(0, Math.min(100, Math.round(Number(v))));
}
