const { prisma } = require('../prismaClient');

/**
 * GET /api/public/share/:token
 * Public snapshot for share card (no email; display name = first name only).
 */
async function getPublic(req, res, next) {
  try {
    const raw = req.params.token;
    const token = typeof raw === 'string' ? raw.trim() : '';
    if (!token || token.length > 80) {
      return res.status(400).json({ message: 'Invalid link' });
    }

    const user = await prisma.user.findFirst({
      where: { shareToken: token },
      select: { id: true, name: true },
    });
    if (!user) {
      return res.status(404).json({ message: 'Not found' });
    }

    const profile = await prisma.alignmentProfile.findUnique({
      where: { userId: user.id },
    });
    if (!profile) {
      return res.status(404).json({ message: 'No results yet' });
    }

    const displayName = user.name.trim().split(/\s+/)[0] || 'Member';

    res.json({
      displayName,
      aqScore: profile.aqScore,
      archetype: profile.archetype,
      primaryDomain: profile.primaryDomain,
      pillarScores: profile.pillarScores,
      updatedAt: profile.updatedAt,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPublic };
