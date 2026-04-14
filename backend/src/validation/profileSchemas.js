const { z } = require('zod');

const MAX_DATA_URL_LENGTH = 280000;

function isValidAvatarString(s) {
  if (typeof s !== 'string') return false;
  if (s.length > MAX_DATA_URL_LENGTH) return false;
  if (/^data:image\/(jpeg|png|webp|gif);base64,/i.test(s)) return true;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

const optionalImageUrl = z.preprocess(
  (v) => {
    if (v === undefined) return undefined;
    if (v === null) return null;
    if (typeof v === 'string' && v.trim() === '') return null;
    return typeof v === 'string' ? v.trim() : v;
  },
  z
    .union([
      z.null(),
      z.string().max(MAX_DATA_URL_LENGTH).refine(isValidAvatarString, { message: 'Invalid image URL' }),
    ])
    .optional()
);

const updateProfileSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  avatarUrl: optionalImageUrl,
});

module.exports = { updateProfileSchema };
