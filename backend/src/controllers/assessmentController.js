const { ZodError } = require('zod');
const { prisma } = require('../prismaClient');
const { submitAssessmentSchema, emailReportSchema } = require('../validation/assessmentSchemas');
const { getAlignmentTypeSubtitle } = require('../services/aqScore');
const { resolveActiveAssessmentWithQuestions } = require('../services/assessmentEnsureQuestions');
const { sendAssessmentReportEmail } = require('../services/assessmentReportEmail');
const { subscribeLeadQuietly } = require('../services/convertkit');
const {
  DOMAIN_LABELS,
  buildAlignmentLabel,
  computeAssessmentFromResponses,
  saveAssessmentForUser,
} = require('../services/persistAssessment');

function reportFromComputed(computed) {
  const { aqScore, pillarScores, primaryDomain, alignmentTypeTitle, alignmentTypeSubtitle } = computed;
  return {
    score: aqScore,
    label: buildAlignmentLabel(aqScore),
    alignmentTypeTitle,
    alignmentTypeSubtitle,
    primaryStrainLabel: primaryDomain ? DOMAIN_LABELS[primaryDomain] : null,
    primaryStrainDescription: 'Your primary structural gap — where habit installation begins.',
    pillarScores,
  };
}

function reportFromProfile(profile) {
  const scores = profile.pillarScores && typeof profile.pillarScores === 'object' ? profile.pillarScores : {};
  return {
    score: profile.aqScore,
    label: buildAlignmentLabel(profile.aqScore),
    alignmentTypeTitle: profile.archetype || 'The Developing Person',
    alignmentTypeSubtitle: getAlignmentTypeSubtitle(profile.archetype),
    primaryStrainLabel: profile.primaryDomain ? DOMAIN_LABELS[profile.primaryDomain] : null,
    primaryStrainDescription: 'Your primary structural gap — where habit installation begins.',
    pillarScores: scores,
  };
}

async function persistDiagnosticLead(email, source, pendingReport = null) {
  try {
    await prisma.lead.create({
      data: {
        email,
        source,
        ...(pendingReport ? { pendingReport } : {}),
      },
    });
  } catch (err) {
    console.error('Lead DB save failed:', err.message);
  }
  try {
    await subscribeLeadQuietly(email, source);
  } catch (err) {
    console.error('ConvertKit lead subscribe failed:', err.message);
  }
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
    try {
      const saved = await saveAssessmentForUser(userId, assessmentId, responses);
      res.status(201).json(saved);
    } catch (e) {
      if (e.statusCode === 400) {
        return res.status(400).json({ message: e.message });
      }
      throw e;
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

async function emailAssessmentReport(req, res, next) {
  try {
    const parsed = emailReportSchema.parse(req.body);
    const email = parsed.email.trim().toLowerCase();
    const source = parsed.source || 'diagnostic-report';
    let report = null;

    if (parsed.assessmentId && parsed.responses?.length) {
      let payload;
      try {
        payload = await computeAssessmentFromResponses(parsed.assessmentId, parsed.responses);
      } catch (e) {
        if (e.statusCode === 400) {
          return res.status(400).json({ message: e.message });
        }
        throw e;
      }
      report = reportFromComputed(payload.computed);
    } else if (req.user?.sub) {
      const profile = await prisma.alignmentProfile.findUnique({
        where: { userId: req.user.sub },
      });
      if (!profile) {
        return res.status(404).json({ message: 'Complete an assessment first.' });
      }
      report = reportFromProfile(profile);
    } else {
      return res.status(400).json({
        message: 'Include your diagnostic answers, or sign in after saving a score.',
      });
    }

    await persistDiagnosticLead(
      email,
      source,
      parsed.assessmentId && parsed.responses?.length
        ? { assessmentId: parsed.assessmentId, responses: parsed.responses }
        : null
    );

    let emailed = false;
    try {
      emailed = await sendAssessmentReportEmail({ to: email, report });
    } catch (err) {
      console.error('Assessment report email failed:', err.message);
    }

    res.status(201).json({ email, emailed });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Enter a valid email', errors: err.errors });
    }
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
  emailAssessmentReport,
};

