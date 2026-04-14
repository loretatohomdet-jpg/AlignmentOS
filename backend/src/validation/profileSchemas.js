const { z } = require('zod');

/** Accepts https image links; empty string from clients becomes null. */
const optionalImageUrl = z.preprocess(
  (v) => {
    if (v === undefined) return undefined;
    if (v === null) return null;
    if (typeof v === 'string' && v.trim() === '') return null;
    return typeof v === 'string' ? v.trim() : v;
  },
  z.union([z.null(), z.string().max(2000).url()]).optional()
);

const updateProfileSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  avatarUrl: optionalImageUrl,
});

module.exports = { updateProfileSchema };
