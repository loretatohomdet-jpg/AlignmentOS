import { DOMAIN_LABELS, DOMAIN_ORDER } from '../constants/domains';

/** Display labels for API pillar enums (assessment questions). */
export const PILLAR_DISPLAY = { ...DOMAIN_LABELS };

/**
 * Order questions by the six domains (then by `order`), so the flow always moves pillar-by-pillar.
 */
export function sortQuestionsByDomainOrder(questions) {
  if (!questions?.length) return [];
  const rank = (pillar) => {
    const i = DOMAIN_ORDER.indexOf(pillar);
    return i === -1 ? 999 : i;
  };
  return [...questions].sort((a, b) => {
    const ra = rank(a.pillar);
    const rb = rank(b.pillar);
    if (ra !== rb) return ra - rb;
    return (a.order ?? 0) - (b.order ?? 0);
  });
}

/**
 * Within-pillar progress for the question at `index` (e.g. Identity · 2 of 4).
 * Always returns an object for valid indices so the UI never hides questions when metadata is odd.
 */
export function getCategoryProgress(questions, index) {
  if (!questions?.length || index < 0 || index >= questions.length) return null;
  const q = questions[index];
  const pillar = q.pillar ?? 'UNKNOWN';
  const group = questions.filter((x) => (x.pillar ?? 'UNKNOWN') === pillar);
  const pos = group.findIndex((x) => x.id === q.id);
  const indexInGroup = pos >= 0 ? pos + 1 : 1;
  return {
    pillar,
    label: PILLAR_DISPLAY[pillar] || String(pillar),
    indexInGroup,
    groupSize: Math.max(group.length, 1),
  };
}
