const Stripe = require('stripe');
const { prisma } = require('../prismaClient');
const { subscribePaid } = require('./convertkit');

let stripeClient = null;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

const PRICE_KEYS = {
  habit_monthly: () => process.env.STRIPE_PRICE_HABIT_MONTHLY,
  habit_yearly: () => process.env.STRIPE_PRICE_HABIT_YEARLY,
  journey: () => process.env.STRIPE_PRICE_JOURNEY,
};

function resolvePriceId(priceKey) {
  const fn = PRICE_KEYS[priceKey];
  if (!fn) return null;
  return fn() || null;
}

function appBaseUrl() {
  return (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
}

async function getOrCreateStripeCustomer(stripe, user) {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: user.id },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });
  return customer.id;
}

/**
 * Create a Stripe Checkout session for the authenticated user.
 * @param {{ userId: string, priceKey: 'habit_monthly'|'habit_yearly'|'journey' }} opts
 */
async function createCheckoutSession({ userId, priceKey }) {
  const stripe = getStripe();
  if (!stripe) {
    const err = new Error('Stripe is not configured');
    err.status = 503;
    throw err;
  }

  const priceId = resolvePriceId(priceKey);
  if (!priceId) {
    const err = new Error(`Price not configured for ${priceKey}`);
    err.status = 503;
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const customerId = await getOrCreateStripeCustomer(stripe, user);
  const isSubscription = priceKey === 'habit_monthly' || priceKey === 'habit_yearly';
  const base = appBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: isSubscription ? 'subscription' : 'payment',
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/success?from=checkout&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/pricing?checkout=canceled`,
    metadata: {
      userId: user.id,
      priceKey,
    },
    subscription_data: isSubscription
      ? { metadata: { userId: user.id, priceKey } }
      : undefined,
  });

  return { url: session.url, sessionId: session.id };
}

async function setUserPlanFromSubscription(userId, subscriptionId, plan) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      stripeSubscriptionId: subscriptionId || null,
    },
  });
}

async function handleCheckoutCompleted(session) {
  const userId = session.metadata?.userId || session.client_reference_id;
  if (!userId) return;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const priceKey = session.metadata?.priceKey || '';
  const isHabit = priceKey.startsWith('habit_') || session.mode === 'subscription';
  const isJourney = priceKey === 'journey' || session.mode === 'payment';

  if (isHabit || isJourney) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'PRO',
        stripeCustomerId: session.customer || user.stripeCustomerId,
        stripeSubscriptionId:
          typeof session.subscription === 'string' ? session.subscription : user.stripeSubscriptionId,
      },
    });
    subscribePaid(user.email).catch((err) => console.error('ConvertKit paid tag failed:', err.message));
  }
}

async function handleSubscriptionUpdated(subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const active = subscription.status === 'active' || subscription.status === 'trialing';
  if (active) {
    await setUserPlanFromSubscription(userId, subscription.id, 'PRO');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      subscribePaid(user.email).catch((err) => console.error('ConvertKit paid tag failed:', err.message));
    }
  } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    await setUserPlanFromSubscription(userId, null, 'FREE');
  }
}

async function handleSubscriptionDeleted(subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;
  await setUserPlanFromSubscription(userId, null, 'FREE');
}

module.exports = {
  getStripe,
  createCheckoutSession,
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  resolvePriceId,
};
