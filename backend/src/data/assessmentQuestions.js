/**
 * 24 diagnostic questions (v1.0): Q1–4 Identity … Q21–24 Execution.
 * Likert 1–5: Strongly Disagree (1) → Strongly Agree (5). Order must match spec.
 */

const PILLAR_MAP = {
  identity: 'IDENTITY',
  purpose: 'PURPOSE',
  mindset: 'MINDSET',
  habits: 'HABITS',
  environment: 'ENVIRONMENT',
  execution: 'EXECUTION',
};
const TYPE_MAP = { standard: 'STANDARD' };

const QUESTIONS_JSON = [
  // Domain I — Identity (Q1–4)
  { id: 'i1', pillar: 'identity', text: 'I have a clear sense of who I am and what I stand for.', type: 'standard' },
  { id: 'i2', pillar: 'identity', text: 'My decisions consistently reflect my core values.', type: 'standard' },
  { id: 'i3', pillar: 'identity', text: 'I rarely feel pressure to become someone I am not.', type: 'standard' },
  { id: 'i4', pillar: 'identity', text: 'I regularly reflect on the kind of person I am becoming.', type: 'standard' },
  // Domain II — Purpose (Q5–8)
  { id: 'p1', pillar: 'purpose', text: 'I know what matters most in my life right now.', type: 'standard' },
  { id: 'p2', pillar: 'purpose', text: 'My work and commitments align with my deeper calling.', type: 'standard' },
  { id: 'p3', pillar: 'purpose', text: 'I have a clear direction for this season of life.', type: 'standard' },
  { id: 'p4', pillar: 'purpose', text: 'My long-term goals reflect what truly matters to me.', type: 'standard' },
  // Domain III — Mindset (Q9–12)
  { id: 'm1', pillar: 'mindset', text: 'My internal dialogue supports growth rather than fear.', type: 'standard' },
  { id: 'm2', pillar: 'mindset', text: 'I believe my life has meaningful direction.', type: 'standard' },
  { id: 'm3', pillar: 'mindset', text: 'I rarely feel paralysed by self-doubt.', type: 'standard' },
  { id: 'm4', pillar: 'mindset', text: 'I approach challenges with confidence and perspective.', type: 'standard' },
  // Domain IV — Habits (Q13–16)
  { id: 'h1', pillar: 'habits', text: 'My habits strengthen my physical, mental, and spiritual health.', type: 'standard' },
  { id: 'h2', pillar: 'habits', text: 'I have a system that supports consistent behaviour.', type: 'standard' },
  { id: 'h3', pillar: 'habits', text: 'I maintain habits long enough to see real results.', type: 'standard' },
  { id: 'h4', pillar: 'habits', text: 'My daily routines reinforce the person I want to become.', type: 'standard' },
  // Domain V — Environment (Q17–20)
  { id: 'e1', pillar: 'environment', text: 'I have clear boundaries that protect my energy.', type: 'standard' },
  { id: 'e2', pillar: 'environment', text: 'I manage digital inputs and media intentionally.', type: 'standard' },
  { id: 'e3', pillar: 'environment', text: 'My workspace supports focus and clarity.', type: 'standard' },
  { id: 'e4', pillar: 'environment', text: 'My relationships actively encourage my growth.', type: 'standard' },
  // Domain VI — Execution (Q21–24)
  { id: 'x1', pillar: 'execution', text: 'I regularly review and adjust my commitments.', type: 'standard' },
  { id: 'x2', pillar: 'execution', text: 'I plan my week with intention.', type: 'standard' },
  { id: 'x3', pillar: 'execution', text: 'I consistently complete high-priority tasks.', type: 'standard' },
  { id: 'x4', pillar: 'execution', text: 'I follow through on important commitments.', type: 'standard' },
];

function toPrismaQuestion(assessmentId, q, order) {
  return {
    assessmentId,
    text: q.text,
    order,
    scaleMin: 1,
    scaleMax: 5,
    pillar: PILLAR_MAP[q.pillar],
    questionType: TYPE_MAP[q.type],
  };
}

function getQuestionsForSeed(assessmentId) {
  return QUESTIONS_JSON.map((q, i) => toPrismaQuestion(assessmentId, q, i + 1));
}

module.exports = { QUESTIONS_JSON, getQuestionsForSeed, PILLAR_MAP, TYPE_MAP };
