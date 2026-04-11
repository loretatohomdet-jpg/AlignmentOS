const { ZodError } = require('zod');
const { prisma } = require('../prismaClient');
const { updateProfileSchema } = require('../validation/profileSchemas');

async function getMe(req, res, next) {
  try {
    const userId = req.user.sub;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        plan: true,
        createdAt: true,
        suspendedAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.suspendedAt) {
      return res.status(403).json({ message: 'Account suspended.' });
    }
    const { suspendedAt: _s, ...safe } = user;
    res.json(safe);
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const userId = req.user.sub;
    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
      select: { id: true, email: true, name: true, avatarUrl: true, role: true, plan: true, createdAt: true },
    });
    res.json(user);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: err.errors });
    }
    next(err);
  }
}

module.exports = { getMe, updateMe };
