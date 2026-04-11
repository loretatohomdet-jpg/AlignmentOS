/**
 * Guarantees GET /assessment/active returns an assessment with questions when the DB allows it.
 * Handles: empty catalog, partial rows (re-seed if no responses), createMany failures, broken active rows.
 */

const { prisma } = require('../prismaClient');
const { getQuestionsForSeed } = require('../data/assessmentQuestions');

const EXPECTED_COUNT = 24;

const includeQuestions = {
  questions: {
    orderBy: { order: 'asc' },
  },
};

async function loadAssessment(assessmentId) {
  return prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: includeQuestions,
  });
}

async function insertAllQuestions(assessmentId) {
  const rows = getQuestionsForSeed(assessmentId);
  try {
    await prisma.question.createMany({ data: rows });
  } catch (err) {
    for (const row of rows) {
      try {
        await prisma.question.create({ data: row });
      } catch (e) {
        if (e.code !== 'P2002') throw e;
      }
    }
  }
}

/**
 * If there are some questions but not 24 and no responses yet, reset and re-seed.
 */
async function repairIfOrphanPartial(assessmentId) {
  const n = await prisma.question.count({ where: { assessmentId } });
  if (n === 0 || n >= EXPECTED_COUNT) return;
  const responses = await prisma.response.count({ where: { assessmentId } });
  if (responses > 0) return;
  await prisma.question.deleteMany({ where: { assessmentId } });
  await insertAllQuestions(assessmentId);
}

async function ensureQuestions(assessmentId) {
  await repairIfOrphanPartial(assessmentId);
  const n = await prisma.question.count({ where: { assessmentId } });
  if (n === 0) {
    await insertAllQuestions(assessmentId);
  }
}

async function deactivateAllActive() {
  await prisma.assessment.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });
}

async function createNewActiveWithQuestions() {
  const created = await prisma.assessment.create({
    data: {
      title: 'Alignment Assessment',
      description:
        'Twenty-four questions (1–5 scale) across six domains: Identity, Purpose, Mindset, Habits, Environment, and Execution.',
      isActive: true,
    },
  });
  await insertAllQuestions(created.id);
  return loadAssessment(created.id);
}

/**
 * @returns {Promise<import('@prisma/client').Assessment & { questions: import('@prisma/client').Question[] }>}
 */
async function resolveActiveAssessmentWithQuestions() {
  const assessments = await prisma.assessment.findMany({
    where: { isActive: true },
    include: includeQuestions,
  });

  let chosen =
    assessments.length === 0
      ? null
      : [...assessments].sort((a, b) => {
          const byCount = b.questions.length - a.questions.length;
          if (byCount !== 0) return byCount;
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        })[0];

  if (!chosen) {
    await deactivateAllActive();
    return createNewActiveWithQuestions();
  }

  await ensureQuestions(chosen.id);
  let assessment = await loadAssessment(chosen.id);

  if (!assessment) {
    await deactivateAllActive();
    return createNewActiveWithQuestions();
  }

  const qLen = assessment.questions?.length ?? 0;
  if (qLen === 0) {
    await deactivateAllActive();
    assessment = await createNewActiveWithQuestions();
  }

  return assessment;
}

module.exports = {
  resolveActiveAssessmentWithQuestions,
  includeQuestions,
  EXPECTED_COUNT,
};
