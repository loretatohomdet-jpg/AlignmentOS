const { z } = require('zod');

const createLeadSchema = z.object({
  email: z.string().email(),
  source: z.string().max(100).optional(),
});

module.exports = { createLeadSchema };
