const { prisma } = require('../prismaClient');
const { computeAQ } = require('./aqScore');
const { syncActiveHabits } = require('./habitAssignment');

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

async function saveAssessmentForUser(userId, assessmentId, responses) {
  const { computed } = await computeAssessmentFromResponses(assessmentId, responses);
  const { aqScore, pillarScores, primaryDomain, archetype, alignmentTypeTitle, alignmentTypeSubtitle } =
    computed;

  const scoreRecord = await prisma.$transaction(async (tx) => {
    await tx.response.deleteMany({ where: { userId, assessmentId } });
    await tx.response.createMany({
      data: responses.map((r) => ({
        userId,
        assessmentId,
        questionId: r.questionId,
        value: r.value,
      })),
    });
    return tx.alignmentIndexScore.create({
      data: { userId, assessmentId, score: aqScore },
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

  let habits = [];
  try {
    habits = await syncActiveHabits(userId, profile.id);
  } catch (assignErr) {
    console.error('Habit assignment failed:', assignErr.message);
  }

  return {
    score: aqScore,
    label: buildAlignmentLabel(aqScore),
    createdAt: scoreRecord.createdAt,
    pillarScores,
    primaryDomain,
    archetype,
    profileId: profile.id,
    alignmentTypeTitle,
    alignmentTypeSubtitle,
    primaryStrainLabel: primaryDomain ? DOMAIN_LABELS[primaryDomain] : null,
    primaryStrainDescription: 'Your primary structural gap — where habit installation begins.',
    habits,
  };
}

async function claimGuestDiagnostic(userId, email) {
  const existing = await prisma.alignmentProfile.findUnique({ where: { userId } });
  if (existing) return false;

  const leads = await prisma.lead.findMany({
    where: { email: String(email || '').trim().toLowerCase() },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });
  const lead = leads.find((row) => {
    const pending = row.pendingReport;
    return pending && pending.assessmentId && Array.isArray(pending.responses) && pending.responses.length;
  });
  if (!lead) return false;

  try {
    await saveAssessmentForUser(userId, lead.pendingReport.assessmentId, lead.pendingReport.responses);
    await prisma.lead.update({
      where: { id: lead.id },
      data: { pendingReport: null },
    });
    return true;
  } catch (err) {
    console.error('Claim guest diagnostic failed:', err.message);
    return false;
  }
}

module.exports = {
  DOMAIN_LABELS,
  buildAlignmentLabel,
  computeAssessmentFromResponses,
  saveAssessmentForUser,
  claimGuestDiagnostic,
};
