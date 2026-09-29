const { z } = require('zod');

const createLeadSchema = z.object({
  email: z.string().email(),
  source: z.string().max(100).optional(),
  name: z.string().max(120).optional(),
  note: z.string().max(2000).optional(),
  season: z.string().max(200).optional(),
});

module.exports = { createLeadSchema };
