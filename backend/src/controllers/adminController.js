const { ZodError } = require('zod');
const bcrypt = require('bcryptjs');
const { prisma } = require('../prismaClient');
const {
  adminUpdateUserSchema,
  adminCreateUserSchema,
  adminCreateNoteSchema,
  adminUpdateAssessmentSchema,
  adminCreateAssessmentSchema,
  adminUpdateQuestionSchema,
  adminCreateQuestionSchema,
} = require('../validation/adminSchemas');

const userPublicSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  role: true,
  plan: true,
  suspendedAt: true,
  createdAt: true,
  updatedAt: true,
};

async function getAnalyticsOverview(req, res, next) {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [
      userCount,
      leadCount,
      responseCount,
      profileCount,
      scoreCount,
      signupsLast7Days,
      suspendedCount,
      pageCount,
      shopCount,
      habitCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.lead.count(),
      prisma.response.count(),
      prisma.alignmentProfile.count(),
      prisma.alignmentIndexScore.count(),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { suspendedAt: { not: null } } }),
      prisma.sitePage.count(),
      prisma.shopOffer.count(),
      prisma.habit.count(),
    ]);
    res.json({
      userCount,
      leadCount,
      responseCount,
      profileCount,
      scoreCount,
      signupsLast7Days,
      suspendedCount,
      pageCount,
      shopCount,
      habitCount,
    });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 40, 200);
    const offset = parseInt(req.query.offset, 10) || 0;
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const where = q
      ? {
          OR: [
            { email: { contains: q, mode: 'insensitive' } },
            { name: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: userPublicSelect,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ]);
    res.json({ users, total, limit, offset });
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...userPublicSelect,
        _count: {
          select: {
            responses: true,
            alignmentProfiles: true,
            scores: true,
          },
        },
      },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { userId } = req.params;
    const data = adminUpdateUserSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) return res.status(404).json({ message: 'User not found' });

    if (userId === req.user.sub && data.suspended === true) {
      return res.status(400).json({ message: 'Cannot suspend your own account.' });
    }

    if (data.role === 'USER' && existing.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot demote the last admin.' });
      }
    }

    const update = {};
    if (data.name !== undefined) update.name = data.name.trim();
    if (data.role !== undefined) update.role = data.role;
    if (data.plan !== undefined) update.plan = data.plan;
    if (data.suspended === true) update.suspendedAt = new Date();
    if (data.suspended === false) update.suspendedAt = null;

    const user = await prisma.user.update({
      where: { id: userId },
      data: update,
      select: userPublicSelect,
    });
    res.json(user);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid data', errors: err.errors });
    }
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const data = adminCreateUserSchema.parse({
      ...req.body,
      email: typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : req.body.email,
      name: typeof req.body.name === 'string' ? req.body.name.trim() : req.body.name,
    });
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ message: 'Email is already registered' });

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: passwordHash,
        role: data.role,
        plan: data.plan,
      },
      select: userPublicSelect,
    });
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid data', errors: err.errors });
    }
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { userId } = req.params;
    if (userId === req.user.sub) {
      return res.status(400).json({ message: 'Cannot delete your own account.' });
    }
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) return res.status(404).json({ message: 'User not found' });
    if (existing.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin.' });
      }
    }
    await prisma.user.delete({ where: { id: userId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function listUserNotes(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const notes = await prisma.adminUserNote.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        author: { select: { id: true, email: true, name: true } },
      },
    });
    res.json(notes);
  } catch (err) {
    next(err);
  }
}

async function createUserNote(req, res, next) {
  try {
    const { userId } = req.params;
    const data = adminCreateNoteSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const note = await prisma.adminUserNote.create({
      data: {
        userId,
        authorId: req.user.sub,
        body: data.body.trim(),
      },
      include: {
        author: { select: { id: true, email: true, name: true } },
      },
    });
    res.status(201).json(note);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid data', errors: err.errors });
    }
    next(err);
  }
}

async function deleteUserNote(req, res, next) {
  try {
    const { userId, noteId } = req.params;
    const note = await prisma.adminUserNote.findFirst({ where: { id: noteId, userId } });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    await prisma.adminUserNote.delete({ where: { id: noteId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function listAssessments(req, res, next) {
  try {
    const assessments = await prisma.assessment.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { questions: true, responses: true } },
      },
    });
    res.json(assessments);
  } catch (err) {
    next(err);
  }
}

async function createAssessment(req, res, next) {
  try {
    const data = adminCreateAssessmentSchema.parse(req.body);
    const assessment = await prisma.assessment.create({
      data: {
        title: data.title.trim(),
        description: data.description ?? null,
        isActive: data.isActive ?? true,
      },
      include: {
        _count: { select: { questions: true, responses: true } },
      },
    });
    res.status(201).json(assessment);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid data', errors: err.errors });
    }
    next(err);
  }
}

async function deleteAssessment(req, res, next) {
  try {
    const { assessmentId } = req.params;
    await prisma.assessment.delete({ where: { id: assessmentId } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Assessment not found' });
    next(err);
  }
}

async function getAssessmentDetail(req, res, next) {
  try {
    const { assessmentId } = req.params;
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
    });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (err) {
    next(err);
  }
}

async function updateAssessment(req, res, next) {
  try {
    const { assessmentId } = req.params;
    const data = adminUpdateAssessmentSchema.parse(req.body);
    const assessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
    });
    res.json(assessment);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid data', errors: err.errors });
    }
    if (err.code === 'P2025') return res.status(404).json({ message: 'Assessment not found' });
    next(err);
  }
}

async function updateQuestion(req, res, next) {
  try {
    const { questionId } = req.params;
    const data = adminUpdateQuestionSchema.parse(req.body);
    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        ...(data.text !== undefined && { text: data.text }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.scaleMin !== undefined && { scaleMin: data.scaleMin }),
        ...(data.scaleMax !== undefined && { scaleMax: data.scaleMax }),
        ...(data.pillar !== undefined && { pillar: data.pillar }),
        ...(data.questionType !== undefined && { questionType: data.questionType }),
      },
    });
    res.json(question);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid data', errors: err.errors });
    }
    if (err.code === 'P2025') return res.status(404).json({ message: 'Question not found' });
    next(err);
  }
}

async function createQuestion(req, res, next) {
  try {
    const { assessmentId } = req.params;
    const data = adminCreateQuestionSchema.parse(req.body);
    const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId }, select: { id: true } });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    let order = data.order;
    if (order == null) {
      const agg = await prisma.question.aggregate({
        where: { assessmentId },
        _max: { order: true },
      });
      order = (agg._max.order ?? 0) + 1;
    }

    const question = await prisma.question.create({
      data: {
        assessmentId,
        text: data.text.trim(),
        pillar: data.pillar,
        questionType: data.questionType,
        order,
        scaleMin: data.scaleMin,
        scaleMax: data.scaleMax,
      },
    });
    res.status(201).json(question);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid data', errors: err.errors });
    }
    next(err);
  }
}

async function deleteQuestion(req, res, next) {
  try {
    const { questionId } = req.params;
    await prisma.question.delete({ where: { id: questionId } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Question not found' });
    next(err);
  }
}

async function getLeads(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 500);
    const offset = parseInt(req.query.offset, 10) || 0;
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
    res.json(leads);
  } catch (err) {
    next(err);
  }
}

async function getLeadsCount(req, res, next) {
  try {
    const count = await prisma.lead.count();
    res.json({ count });
  } catch (err) {
    next(err);
  }
}

async function exportLeadsCsv(req, res, next) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const header = 'email,source,createdAt\n';
    const rows = leads.map((l) =>
      [l.email, l.source || '', l.createdAt.toISOString()].map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const csv = header + rows;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

async function deleteLead(req, res, next) {
  try {
    const { leadId } = req.params;
    await prisma.lead.delete({ where: { id: leadId } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Lead not found' });
    next(err);
  }
}

module.exports = {
  getAnalyticsOverview,
  listUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  listUserNotes,
  createUserNote,
  deleteUserNote,
  listAssessments,
  createAssessment,
  getAssessmentDetail,
  updateAssessment,
  deleteAssessment,
  updateQuestion,
  createQuestion,
  deleteQuestion,
  getLeads,
  getLeadsCount,
  exportLeadsCsv,
  deleteLead,
};
