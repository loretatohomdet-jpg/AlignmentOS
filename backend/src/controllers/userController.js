const crypto = require('crypto');
const { ZodError } = require('zod');
const { prisma } = require('../prismaClient');
const { updateProfileSchema } = require('../validation/profileSchemas');

const MAX_AVATAR_FILE_BYTES = 200_000;

function detectImageMime(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif';
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
    return 'image/webp';
  }
  return null;
}

async function getMe(req, res, next) {
  try {
    const userId = req.user.sub;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        shareToken: true,
        role: true,
        plan: true,
        createdAt: true,
        suspendedAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.suspendedAt) {
      return res.status(403).json({ message: 'Account suspended.' });
    }
    const { suspendedAt: _s, ...safe } = user;
    res.json(safe);
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const userId = req.user.sub;
    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        shareToken: true,
        role: true,
        plan: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: err.errors });
    }
    next(err);
  }
}

/** POST /api/me/share — create or rotate public share token */
async function rotateShareToken(req, res, next) {
  try {
    const userId = req.user.sub;
    const token = crypto.randomBytes(24).toString('hex');
    const user = await prisma.user.update({
      where: { id: userId },
      data: { shareToken: token },
      select: { shareToken: true },
    });
    res.json({ shareToken: user.shareToken });
  } catch (err) {
    next(err);
  }
}

/** POST /api/me/avatar — multipart file → data URL stored on User.avatarUrl */
async function uploadAvatar(req, res, next) {
  try {
    const userId = req.user.sub;
    const file = req.file;
    if (!file || !file.buffer) {
      return res.status(400).json({ message: 'Missing file field "file"' });
    }
    if (file.size > MAX_AVATAR_FILE_BYTES) {
      return res.status(400).json({ message: `Image must be under ${MAX_AVATAR_FILE_BYTES / 1000}KB` });
    }
    const mime = detectImageMime(file.buffer);
    if (!mime) {
      return res.status(400).json({ message: 'Use JPEG, PNG, GIF, or WebP' });
    }
    const b64 = file.buffer.toString('base64');
    const dataUrl = `data:${mime};base64,${b64}`;
    if (dataUrl.length > 280000) {
      return res.status(400).json({ message: 'Image is too large after encoding' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: dataUrl },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        shareToken: true,
        role: true,
        plan: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateMe, rotateShareToken, uploadAvatar };
