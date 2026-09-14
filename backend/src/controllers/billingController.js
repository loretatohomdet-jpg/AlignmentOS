const { z } = require('zod');
const { createCheckoutSession, getStripe, resolvePriceId } = require('../services/stripeBilling');

const checkoutSchema = z.object({
  priceKey: z.enum(['habit_monthly', 'habit_yearly', 'journey']),
});

/** GET /api/billing/status — public; whether Stripe checkout is ready */
async function billingStatus(_req, res) {
  const stripeReady = Boolean(getStripe());
  const webhookReady = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  res.json({
    configured: stripeReady && Boolean(resolvePriceId('habit_monthly') || resolvePriceId('habit_yearly')),
    webhookConfigured: webhookReady,
    prices: {
      habit_monthly: Boolean(resolvePriceId('habit_monthly')),
      habit_yearly: Boolean(resolvePriceId('habit_yearly')),
      journey: Boolean(resolvePriceId('journey')),
    },
  });
}

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

module.exports = { startCheckout, billingStatus };
