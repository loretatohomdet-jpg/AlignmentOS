const { ZodError } = require('zod');
const { prisma } = require('../prismaClient');
const { createLeadSchema } = require('../validation/leadSchemas');
const { subscribeLeadQuietly, isConfigured } = require('../services/convertkit');
const { sendResetGuideEmail } = require('../services/resetGuideEmail');
const { wantsResetGuide } = require('../services/leadEmail');

async function create(req, res, next) {
  try {
    const data = createLeadSchema.parse(req.body);
    const email = data.email.toLowerCase().trim();
    const source = data.source || 'lander';
    const sendGuide = wantsResetGuide(source);

    let lead = null;
    try {
      lead = await prisma.lead.create({ data: { email, source } });
    } catch (dbErr) {
      console.error('Lead DB save failed:', dbErr.message);
    }

    // Kit list only — no form, no lead tag. Resend sends the one Reset guide letter.
    const kitSaved = await subscribeLeadQuietly(email, source);

    if (!lead && !kitSaved && !process.env.RESEND_API_KEY) {
      const message = isConfigured()
        ? 'Could not save your email. Try again in a moment.'
        : 'Email capture is not configured yet. Try again later or contact support.';
      return res.status(503).json({ message });
    }

    let emailed = false;
    if (sendGuide) {
      try {
        emailed = await sendResetGuideEmail(email);
      } catch (err) {
        console.error('Reset guide email failed:', err.message);
      }
    }

    if (!lead && !kitSaved && !emailed) {
      return res.status(503).json({ message: 'Could not send the guide. Try again in a moment.' });
    }

    res.status(201).json({ id: lead?.id ?? null, email, emailed });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Invalid email', errors: err.errors });
    }
    next(err);
  }
}

module.exports = { create };
