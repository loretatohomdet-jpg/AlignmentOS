const { prisma } = require('../prismaClient');

const KINDS = {
  morning: 'MORNING',
  midday: 'MIDDAY',
  close: 'CLOSE',
};

const KIND_TO_CLIENT = {
  MORNING: 'morning',
  MIDDAY: 'midday',
  CLOSE: 'close',
};

const EXCERPT_KEYS = {
  MORNING: ['faithful', 'focus', 'oneThing', 'practice'],
  MIDDAY: ['adjustment', 'notice'],
  CLOSE: ['gratitude', 'life', 'tomorrow', 'carrying', 'drift'],
};

const KIND_LABEL = {
  MORNING: 'Morning anchor',
  MIDDAY: 'Midday pause',
  CLOSE: 'Evening close',
};

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_KEYS = 12;
const MAX_LEN = 4_000;

function utcDayStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function parseDay(raw) {
  const day = String(raw || '').trim();
  if (!DAY_RE.test(day)) return null;
  return day;
}

function parseKind(raw) {
  const key = String(raw || '').trim().toLowerCase();
  return KINDS[key] || null;
}

function filledText(value) {
  const t = String(value ?? '').trim();
  return t || null;
}

function normalizeAnswers(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out = {};
  for (const [key, value] of Object.entries(raw).slice(0, MAX_KEYS)) {
    if (typeof key !== 'string' || !key.trim()) continue;
    out[key.slice(0, 40)] = String(value ?? '').slice(0, MAX_LEN);
  }
  return out;
}

function excerptFrom(kind, answers) {
  const keys = EXCERPT_KEYS[kind] || [];
  for (const key of keys) {
    const t = filledText(answers?.[key]);
    if (t) return t;
  }
  return null;
}

function emptyDay() {
  return {
    morning: { answers: {}, held: false },
    midday: { answers: {}, held: false },
    close: { answers: {}, held: false },
  };
}

function rowToClient(row) {
  const answers = row?.answers && typeof row.answers === 'object' && !Array.isArray(row.answers) ? row.answers : {};
  return {
    answers,
    held: Boolean(row?.heldAt),
    heldAt: row?.heldAt ? row.heldAt.toISOString() : null,
    updatedAt: row?.updatedAt ? row.updatedAt.toISOString() : null,
  };
}

/** GET /api/me/rituals?day=YYYY-MM-DD */
async function getDayRituals(req, res, next) {
  try {
    const day = parseDay(req.query.day) || utcDayStamp();
    const rows = await prisma.dayRitual.findMany({
      where: { userId: req.user.sub, day },
    });
    const payload = emptyDay();
    for (const row of rows) {
      const key = KIND_TO_CLIENT[row.kind];
      if (key) payload[key] = rowToClient(row);
    }
    res.json({ day, rituals: payload });
  } catch (err) {
    next(err);
  }
}

/** GET /api/me/rituals/archive */
async function listRitualArchive(req, res, next) {
  try {
    const rows = await prisma.dayRitual.findMany({
      where: { userId: req.user.sub, heldAt: { not: null } },
      orderBy: [{ day: 'desc' }, { heldAt: 'desc' }],
      take: 90,
    });
    res.json(
      rows.map((row) => ({
        id: row.id,
        day: row.day,
        kind: KIND_LABEL[row.kind] || row.kind,
        excerpt: excerptFrom(row.kind, row.answers),
      }))
    );
  } catch (err) {
    next(err);
  }
}

/** PUT /api/me/rituals — body: { day?, kind, answers?, held? } */
async function upsertDayRitual(req, res, next) {
  try {
    const kind = parseKind(req.body?.kind);
    if (!kind) {
      return res.status(400).json({ message: 'kind must be morning, midday, or close' });
    }
    const day = parseDay(req.body?.day) || utcDayStamp();
    const answers = normalizeAnswers(req.body?.answers);
    const markHeld = Boolean(req.body?.held);
    const userId = req.user.sub;

    const existing = await prisma.dayRitual.findUnique({
      where: { userId_day_kind: { userId, day, kind } },
    });

    const heldAt = markHeld ? existing?.heldAt || new Date() : existing?.heldAt || null;

    const row = await prisma.dayRitual.upsert({
      where: { userId_day_kind: { userId, day, kind } },
      create: {
        userId,
        day,
        kind,
        answers,
        heldAt,
      },
      update: {
        answers,
        heldAt,
      },
    });

    res.json({
      day,
      kind: KIND_TO_CLIENT[row.kind],
      ...rowToClient(row),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDayRituals, listRitualArchive, upsertDayRitual };
