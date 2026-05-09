const { prisma } = require('../prismaClient');

const REFLECTION_TYPES = new Set(['WEEKLY', 'QUARTERLY']);
const MAX_ANSWERS = 10;
const MAX_ANSWER_LEN = 12_000;

function normalizeAnswers(raw) {
  if (!Array.isArray(raw)) return null;
  const out = raw
    .slice(0, MAX_ANSWERS)
    .map((a) => (typeof a === 'string' ? a : String(a ?? '')))
    .map((s) => s.slice(0, MAX_ANSWER_LEN));
  return out;
}

/** GET /api/me/reflections */
async function listReflections(req, res, next) {
  try {
    const userId = req.user.sub;
    const rows = await prisma.reflection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        answers: true,
        createdAt: true,
      },
    });
    res.json(
      rows.map((r) => ({
        id: r.id,
        type: r.type,
        answers: Array.isArray(r.answers) ? r.answers : [],
        createdAt: r.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    next(err);
  }
}

/** POST /api/me/reflections — body: { type: 'WEEKLY'|'QUARTERLY', answers: string[] } */
async function createReflection(req, res, next) {
  try {
    const userId = req.user.sub;
    const { type, answers: rawAnswers } = req.body || {};
    if (!type || !REFLECTION_TYPES.has(String(type).toUpperCase())) {
      return res.status(400).json({ message: 'type must be WEEKLY or QUARTERLY' });
    }
    const answers = normalizeAnswers(rawAnswers);
    if (answers == null) {
      return res.status(400).json({ message: 'answers must be an array of strings' });
    }
    const row = await prisma.reflection.create({
      data: {
        userId,
        type: String(type).toUpperCase(),
        answers,
      },
      select: {
        id: true,
        type: true,
        answers: true,
        createdAt: true,
      },
    });
    res.status(201).json({
      id: row.id,
      type: row.type,
      answers: Array.isArray(row.answers) ? row.answers : [],
      createdAt: row.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listReflections, createReflection };
