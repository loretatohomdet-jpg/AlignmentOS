const { ZodError } = require('zod');
const { prisma } = require('../prismaClient');
const { createLeadSchema } = require('../validation/leadSchemas');
const { subscribeLead, isConfigured } = require('../services/convertkit');

async function sendWelcomeEmailIfConfigured(email) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'Alignment OS <onboarding@resend.dev>';
  if (!apiKey) return;
  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: email,
      subject: "You're in — here's your next step",
      html: `
        <p>Thanks for your interest in Alignment OS.</p>
        <p>Take the short diagnostic to get your score and see where your life holds — and where it strains:</p>
        <p><a href="${process.env.APP_URL || 'https://www.alignmentos.co'}/assessment">Take the diagnostic</a></p>
        <p>We'll send tips and updates from time to time. Unsubscribe anytime.</p>
        <p>— Alignment OS</p>
      `,
    });
  } catch (err) {
    console.error('Welcome email failed:', err.message);
  }
}

async function create(req, res, next) {
  try {
    const data = createLeadSchema.parse(req.body);
    const email = data.email.toLowerCase().trim();
    const source = data.source || 'lander';

    let lead = null;
    try {
      lead = await prisma.lead.create({ data: { email, source } });
    } catch (dbErr) {
      console.error('Lead DB save failed:', dbErr.message);
    }

    const kitSaved = await subscribeLead(email, source);

    if (!lead && !kitSaved) {
      const message = isConfigured()
        ? 'Could not save your email. Try again in a moment.'
        : 'Email capture is not configured yet. Try again later or contact support.';
      return res.status(503).json({ message });
    }

    sendWelcomeEmailIfConfigured(email).catch((err) =>
      console.error('Welcome email failed:', err.message)
    );

    res.status(201).json({ id: lead?.id ?? null, email });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Invalid email', errors: err.errors });
    }
    next(err);
  }
}

module.exports = { create };
