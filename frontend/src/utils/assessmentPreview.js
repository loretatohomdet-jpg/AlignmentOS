/**
 * Client-side AQ preview — must stay aligned with backend/src/services/aqScore.js
 * Used when POST /api/assessment/preview is unavailable (404 / old API).
 */
import { DOMAIN_LABELS } from '../constants/domains';

const SCORE_PILLARS = ['IDENTITY', 'PURPOSE', 'MINDSET', 'HABITS', 'ENVIRONMENT', 'EXECUTION'];

const ALIGNMENT_TYPES = [
  {
    title: 'The Integrated Person',
    subtitle:
      'You live with intention across all domains. The frontier now is depth and contribution.',
    match: (d) => SCORE_PILLARS.every((p) => d[p] >= 14),
  },
  {
    title: 'The Capable Builder',
    subtitle:
      'Execution is real. The foundation beneath it is still forming. The work now is depth, not more output.',
    match: (d) => d.EXECUTION >= 16 && d.IDENTITY <= 12 && d.PURPOSE <= 12,
  },
  {
    title: 'The Thoughtful Seeker',
    subtitle: 'You know who you are. The question this season is what that calls you toward.',
    match: (d) => d.IDENTITY >= 14 && d.PURPOSE <= 12,
  },
  {
    title: 'The Ordered Life',
    subtitle:
      'Your habits are genuine. The question is whether the structure serves what truly matters.',
    match: (d) => d.HABITS >= 16 && (d.IDENTITY <= 12 || d.PURPOSE <= 12),
  },
  {
    title: 'The Person Under Pressure',
    subtitle:
      'Environment and capacity are under pressure. This is a demanding season that calls for simplification.',
    match: (d) => d.ENVIRONMENT <= 11 && d.EXECUTION <= 11,
  },
];

const FALLBACK_TYPE = {
  title: 'The Developing Person',
  subtitle:
    'Multiple domains in active formation. Clarity and coherence are building. Beginning honestly is everything.',
};

function resolveAlignmentType(domainRaw) {
  for (const t of ALIGNMENT_TYPES) {
    if (t.match(domainRaw)) {
      return { title: t.title, subtitle: t.subtitle };
    }
  }
  return { title: FALLBACK_TYPE.title, subtitle: FALLBACK_TYPE.subtitle };
}

function computeAQ(responses, questionMeta) {
  const pillarSums = Object.fromEntries(SCORE_PILLARS.map((p) => [p, 0]));
  const pillarCounts = Object.fromEntries(SCORE_PILLARS.map((p) => [p, 0]));

  for (const r of responses) {
    const meta = questionMeta[r.questionId];
    if (!meta) continue;
    if (meta.questionType === 'PENALTY') continue;
    if (SCORE_PILLARS.includes(meta.pillar)) {
      pillarSums[meta.pillar] += r.value;
      pillarCounts[meta.pillar] += 1;
    }
  }

  for (const p of SCORE_PILLARS) {
    if (pillarCounts[p] !== 4) {
      throw new Error(`Expected 4 responses per domain; ${p} has ${pillarCounts[p]}`);
    }
  }

  const domainRaw = {};
  for (const p of SCORE_PILLARS) {
    domainRaw[p] = pillarSums[p];
  }

  const rawTotal = SCORE_PILLARS.reduce((acc, p) => acc + domainRaw[p], 0);
  const aqScore = Math.round((rawTotal / 120) * 100);

  const minRaw = Math.min(...SCORE_PILLARS.map((p) => domainRaw[p]));
  const primaryDomain = SCORE_PILLARS.find((p) => domainRaw[p] === minRaw) ?? null;

  const { title, subtitle } = resolveAlignmentType(domainRaw);

  return {
    aqScore,
    pillarScores: domainRaw,
    primaryDomain,
    archetype: title,
    alignmentTypeTitle: title,
    alignmentTypeSubtitle: subtitle,
  };
}

function buildAlignmentLabel(score) {
  const s = Number(score);
  if (s >= 90) return 'High coherence';
  if (s >= 75) return 'Strong alignment';
  if (s >= 60) return 'Moderate alignment';
  if (s >= 40) return 'Some structure, significant drift';
  return 'Significant misalignment';
}

/**
 * @param {Array<{ id: string, pillar: string, questionType?: string }>} questions
 * @param {Record<string, number>} answers questionId -> value
 * @returns {object} same shape as GET submit / preview API JSON
 */
export function buildGuestPreviewPayload(questions, answers) {
  const questionMeta = {};
  for (const q of questions) {
    questionMeta[q.id] = {
      pillar: q.pillar,
      questionType: q.questionType ?? 'STANDARD',
    };
  }

  const responses = questions.map((q) => ({
    questionId: q.id,
    value: answers[q.id],
  }));

  const computed = computeAQ(responses, questionMeta);
  const { aqScore, pillarScores, primaryDomain, alignmentTypeTitle, alignmentTypeSubtitle } = computed;

  return {
    score: aqScore,
    label: buildAlignmentLabel(aqScore),
    pillarScores,
    primaryDomain,
    archetype: alignmentTypeTitle,
    alignmentTypeTitle,
    alignmentTypeSubtitle,
    primaryStrainLabel: primaryDomain ? DOMAIN_LABELS[primaryDomain] : null,
    primaryStrainDescription: 'Your primary structural gap — where habit installation begins.',
  };
}
