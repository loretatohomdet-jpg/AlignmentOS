const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  avatarUrl: z.string().url().max(2000).optional().nullable(),
});

module.exports = { updateProfileSchema };
