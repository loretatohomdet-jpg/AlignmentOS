const { ZodError } = require('zod');
const { prisma } = require('../prismaClient');
const { createLeadSchema } = require('../validation/leadSchemas');

async function sendWelcomeEmailIfConfigured(email) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'Alignment Index <onboarding@resend.dev>';
  if (!apiKey) return;
  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: email,
      subject: "You're in — here's your next step",
      html: `
        <p>Thanks for your interest in the Alignment Index.</p>
        <p>Take the short assessment to get your score and see how your work aligns with what matters to you:</p>
        <p><a href="${process.env.APP_URL || 'https://yourapp.com'}/assessment">Take the assessment</a></p>
        <p>We'll send tips and updates from time to time. Unsubscribe anytime.</p>
        <p>— Alignment Index</p>
      `,
    });
  } catch (err) {
    console.error('Welcome email failed:', err.message);
  }
}

async function create(req, res, next) {
  try {
    const data = createLeadSchema.parse(req.body);
    const lead = await prisma.lead.create({
      data: {
        email: data.email.toLowerCase().trim(),
        source: data.source || 'lander',
      },
    });
    sendWelcomeEmailIfConfigured(lead.email).catch((err) =>
      console.error('Welcome email failed:', err.message)
    );
    res.status(201).json({ id: lead.id, email: lead.email });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Invalid email', errors: err.errors });
    }
    next(err);
  }
}

module.exports = { create };
