const { z } = require('zod');
const { createCheckoutSession } = require('../services/stripeBilling');

const checkoutSchema = z.object({
  priceKey: z.enum(['habit_monthly', 'habit_yearly', 'journey']),
});

/** POST /api/billing/checkout — auth required */
async function startCheckout(req, res, next) {
  try {
    const { priceKey } = checkoutSchema.parse(req.body || {});
    const userId = req.user.sub;
    const result = await createCheckoutSession({ userId, priceKey });
    res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid priceKey' });
    }
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
}

module.exports = { startCheckout };
