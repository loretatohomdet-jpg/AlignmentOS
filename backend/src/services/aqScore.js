/**
 * Alignment OS diagnostic v1.0 — six domains × 4 questions, Likert 1–5 (all positively framed).
 * Domain raw score: sum of four answers (range 4–20).
 * Alignment Score: round(rawTotal / 120 × 100), rawTotal = sum of six domain scores (24–120).
 * Primary Gap: domain with minimum raw score; ties → first in SCORE_PILLARS order.
 * Alignment types: evaluated in fixed order on raw domain scores (not overall %).
 */

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
    subtitle:
      'You know who you are. The question this season is what that calls you toward.',
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

/** Title → subtitle for API responses when loading stored profile */
const ALIGNMENT_TYPE_SUBTITLE_BY_TITLE = Object.fromEntries(
  [...ALIGNMENT_TYPES, FALLBACK_TYPE].map((t) => [t.title, t.subtitle])
);

/**
 * @param {Record<string, number>} domainRaw - each SCORE_PILLARS key → sum 4–20
 */
function resolveAlignmentType(domainRaw) {
  for (const t of ALIGNMENT_TYPES) {
    if (t.match(domainRaw)) {
      return { title: t.title, subtitle: t.subtitle };
    }
  }
  return { title: FALLBACK_TYPE.title, subtitle: FALLBACK_TYPE.subtitle };
}

function getAlignmentTypeSubtitle(storedTitle) {
  if (!storedTitle) return FALLBACK_TYPE.subtitle;
  return ALIGNMENT_TYPE_SUBTITLE_BY_TITLE[storedTitle] ?? FALLBACK_TYPE.subtitle;
}

/**
 * @param {Array<{ questionId: string, value: number }>} responses
 * @param {Object} questionMeta - map questionId -> { pillar, questionType }
 * @returns {{
 *   aqScore: number,
 *   pillarScores: Record<string, number>,
 *   primaryDomain: string | null,
 *   archetype: string | null,
 *   alignmentTypeTitle: string,
 *   alignmentTypeSubtitle: string,
 * }}
 */
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
      throw Object.assign(new Error(`Expected 4 responses per domain; ${p} has ${pillarCounts[p]}`), {
        code: 'INCOMPLETE_ASSESSMENT',
      });
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

function isRawDomainProfileScores(scores) {
  if (!scores || typeof scores !== 'object') return false;
  const present = SCORE_PILLARS.filter((k) => scores[k] != null);
  if (present.length !== SCORE_PILLARS.length) return false;
  return SCORE_PILLARS.every((k) => {
    const v = scores[k];
    return Number.isInteger(v) && v >= 4 && v <= 20;
  });
}

module.exports = {
  computeAQ,
  SCORE_PILLARS,
  resolveAlignmentType,
  getAlignmentTypeSubtitle,
  ALIGNMENT_TYPE_SUBTITLE_BY_TITLE,
  isRawDomainProfileScores,
};
