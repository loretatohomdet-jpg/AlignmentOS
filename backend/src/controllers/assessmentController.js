const { ZodError } = require('zod');
const { prisma } = require('../prismaClient');
const { submitAssessmentSchema } = require('../validation/assessmentSchemas');
const { computeAQ, getAlignmentTypeSubtitle } = require('../services/aqScore');
const { assignHabits } = require('../services/habitAssignment');
const { resolveActiveAssessmentWithQuestions } = require('../services/assessmentEnsureQuestions');

const DOMAIN_LABELS = {
  IDENTITY: 'Identity',
  PURPOSE: 'Purpose',
  MINDSET: 'Mindset',
  HABITS: 'Habits',
  ENVIRONMENT: 'Environment',
  EXECUTION: 'Execution',
};

function buildAlignmentLabel(score) {
  const s = Number(score);
  if (s >= 90) return 'High coherence';
  if (s >= 75) return 'Strong alignment';
  if (s >= 60) return 'Moderate alignment';
  if (s >= 40) return 'Some structure, significant drift';
  return 'Significant misalignment';
}

/**
 * Load questions, validate responses, compute AQ (no DB writes). Used by submit and public preview.
 */
async function computeAssessmentFromResponses(assessmentId, responses) {
  const questions = await prisma.question.findMany({
    where: { assessmentId },
  });

  if (questions.length === 0) {
    const err = new Error('Assessment has no questions or does not exist');
    err.statusCode = 400;
    throw err;
  }

  const questionMap = new Map(questions.map((q) => [q.id, q]));

  const expectedIds = new Set(questions.map((q) => q.id));
  if (responses.length !== questions.length) {
    const err = new Error('Each question must be answered exactly once.');
    err.statusCode = 400;
    throw err;
  }
  const responseIds = new Set(responses.map((r) => r.questionId));
  if (responseIds.size !== questions.length || ![...expectedIds].every((id) => responseIds.has(id))) {
    const err = new Error('Each question must be answered exactly once.');
    err.statusCode = 400;
    throw err;
  }

  for (const r of responses) {
    const q = questionMap.get(r.questionId);
    if (!q) {
      const err = new Error(`Invalid questionId: ${r.questionId}`);
      err.statusCode = 400;
      throw err;
    }
    if (r.value < q.scaleMin || r.value > q.scaleMax) {
      const err = new Error(
        `Value for question ${r.questionId} must be between ${q.scaleMin} and ${q.scaleMax}`
      );
      err.statusCode = 400;
      throw err;
    }
  }

  const questionMeta = {};
  for (const q of questions) {
    questionMeta[q.id] = {
      scaleMin: q.scaleMin,
      scaleMax: q.scaleMax,
      pillar: q.pillar,
      questionType: q.questionType,
    };
  }
  const responsesForAQ = responses.map((r) => ({
    questionId: r.questionId,
    value: r.value,
  }));

  let computed;
  try {
    computed = computeAQ(
      responsesForAQ.map((r) => ({
        ...r,
        pillar: questionMap.get(r.questionId)?.pillar,
        questionType: questionMap.get(r.questionId)?.questionType,
      })),
      questionMeta
    );
  } catch (e) {
    if (e.code === 'INCOMPLETE_ASSESSMENT') {
      const err = new Error(e.message || 'All questions must be answered.');
      err.statusCode = 400;
      throw err;
    }
    throw e;
  }

  return { computed, questions };
}

async function getActiveAssessment(req, res, next) {
  try {
    const assessment = await resolveActiveAssessmentWithQuestions();
    const questions = await prisma.question.findMany({
      where: { assessmentId: assessment.id },
      orderBy: { order: 'asc' },
    });
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json({
      id: assessment.id,
      title: assessment.title,
      description: assessment.description,
      isActive: assessment.isActive,
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
      questions,
    });
  } catch (err) {
    next(err);
  }
}

async function previewAssessment(req, res, next) {
  try {
    const parsed = submitAssessmentSchema.parse(req.body);
    const { assessmentId, responses } = parsed;

    let payload;
    try {
      payload = await computeAssessmentFromResponses(assessmentId, responses);
    } catch (e) {
      if (e.statusCode === 400) {
        return res.status(400).json({ message: e.message });
      }
      throw e;
    }

    const { computed } = payload;
    const { aqScore, pillarScores, primaryDomain, archetype, alignmentTypeTitle, alignmentTypeSubtitle } =
      computed;

    const label = buildAlignmentLabel(aqScore);
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json({
      score: aqScore,
      label,
      pillarScores,
      primaryDomain,
      archetype,
      alignmentTypeTitle,
      alignmentTypeSubtitle,
      primaryStrainLabel: primaryDomain ? DOMAIN_LABELS[primaryDomain] : null,
      primaryStrainDescription:
        'Your primary structural gap — where habit installation begins.',
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: err.errors });
    }
    next(err);
  }
}

async function submitAssessment(req, res, next) {
  try {
    const parsed = submitAssessmentSchema.parse(req.body);
    const userId = req.user.sub;
    const { assessmentId, responses } = parsed;

    let payload;
    try {
      payload = await computeAssessmentFromResponses(assessmentId, responses);
    } catch (e) {
      if (e.statusCode === 400) {
        return res.status(400).json({ message: e.message });
      }
      throw e;
    }

    const { computed, questions } = payload;
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    const { aqScore, pillarScores, primaryDomain, archetype, alignmentTypeTitle, alignmentTypeSubtitle } =
      computed;

    const scoreRecord = await prisma.$transaction(async (tx) => {
      await tx.response.deleteMany({
        where: { userId, assessmentId },
      });

      await tx.response.createMany({
        data: responses.map((r) => ({
          userId,
          assessmentId,
          questionId: r.questionId,
          value: r.value,
        })),
      });

      return await tx.alignmentIndexScore.create({
        data: {
          userId,
          assessmentId,
          score: aqScore,
        },
      });
    });

    const profile = await prisma.alignmentProfile.upsert({
      where: { userId },
      create: {
        userId,
        assessmentId,
        aqScore,
        primaryDomain: primaryDomain ?? null,
        archetype: archetype ?? null,
        pillarScores: pillarScores ?? {},
      },
      update: {
        assessmentId,
        aqScore,
        primaryDomain: primaryDomain ?? null,
        archetype: archetype ?? null,
        pillarScores: pillarScores ?? {},
      },
    });

    const label = buildAlignmentLabel(aqScore);

    res.status(201).json({
      score: aqScore,
      label,
      createdAt: scoreRecord.createdAt,
      pillarScores,
      primaryDomain,
      archetype,
      profileId: profile.id,
      alignmentTypeTitle,
      alignmentTypeSubtitle,
      primaryStrainLabel: primaryDomain ? DOMAIN_LABELS[primaryDomain] : null,
      primaryStrainDescription:
        'Your primary structural gap — where habit installation begins.',
    });

    const profileId = profile.id;
    if (profileId) {
      setImmediate(() => {
        assignHabits(profileId, userId, []).catch(() => {});
      });
    }
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: err.errors });
    }
    next(err);
  }
}

async function getLatestResult(req, res, next) {
  try {
    const userId = req.user.sub;
    const { assessmentId } = req.query;

    const where = {
      userId,
      ...(assessmentId ? { assessmentId } : {}),
    };

    const latest = await prisma.alignmentIndexScore.findFirst({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (!latest) {
      return res.status(404).json({ message: 'No results found' });
    }

    const profile = await prisma.alignmentProfile.findUnique({
      where: { userId },
    });

    const label = buildAlignmentLabel(latest.score);
    const payload = {
      score: latest.score,
      label,
      createdAt: latest.createdAt,
      assessmentId: latest.assessmentId,
    };
    if (profile) {
      payload.alignmentTypeTitle = profile.archetype || 'The Developing Person';
      payload.alignmentTypeSubtitle = getAlignmentTypeSubtitle(profile.archetype);
      payload.pillarScores = profile.pillarScores;
      payload.primaryDomain = profile.primaryDomain;
      payload.archetype = profile.archetype;
      if (profile.primaryDomain && DOMAIN_LABELS[profile.primaryDomain]) {
        payload.primaryStrainLabel = DOMAIN_LABELS[profile.primaryDomain];
      }
      payload.primaryStrainDescription =
        'Your primary structural gap — where habit installation begins.';
    } else {
      payload.alignmentTypeTitle = 'The Developing Person';
      payload.alignmentTypeSubtitle = getAlignmentTypeSubtitle('The Developing Person');
    }
    res.json(payload);
  } catch (err) {
    next(err);
  }
}

async function getScoreHistory(req, res, next) {
  try {
    const userId = req.user.sub;
    const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
    const scores = await prisma.alignmentIndexScore.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { score: true, createdAt: true },
    });
    res.json(scores.reverse());
  } catch (err) {
    next(err);
  }
}

async function getReport(req, res, next) {
  try {
    const userId = req.user.sub;
    const profile = await prisma.alignmentProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      return res.status(404).json({ message: 'No alignment report found. Complete an assessment first.' });
    }
    const scores = profile.pillarScores && typeof profile.pillarScores === 'object'
      ? profile.pillarScores
      : {};
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const strengths = entries.slice(0, 2).map(([p, s]) => ({ pillar: p, score: s }));
    const gaps = entries.slice(-2).reverse().map(([p, s]) => ({ pillar: p, score: s }));
    res.json({
      aqScore: profile.aqScore,
      primaryDomain: profile.primaryDomain,
      archetype: profile.archetype,
      pillarScores: scores,
      strengths,
      gaps,
      createdAt: profile.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getActiveAssessment,
  previewAssessment,
  submitAssessment,
  getLatestResult,
  getScoreHistory,
  getReport,
};

