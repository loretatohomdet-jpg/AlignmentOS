const { prisma } = require('../prismaClient');

const PAID_PLANS = new Set(['PRO', 'TEAM']);

/** Requires an authenticated user with PRO or TEAM (Habit Engine). */
async function requirePaidPlan(req, res, next) {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, suspendedAt: true },
    });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (user.suspendedAt) {
      return res.status(403).json({ message: 'Account suspended' });
    }
    if (!PAID_PLANS.has(user.plan)) {
      return res.status(402).json({
        message: 'Habit Engine requires an active plan',
        code: 'PAYMENT_REQUIRED',
      });
    }
    req.userPlan = user.plan;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requirePaidPlan, PAID_PLANS };
