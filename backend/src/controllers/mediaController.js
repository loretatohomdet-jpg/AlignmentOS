const multer = require('multer');
const { prisma } = require('../prismaClient');

const MAX_BYTES = 2 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
});

function detectImageMime(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif';
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x57 && buf[9] === 0x45) {
    return 'image/webp';
  }
  return null;
}

/** multer middleware for POST /api/admin/media */
const mediaUpload = upload.single('file');

/**
 * POST /api/admin/media — multipart image → CmsAsset, returns a short public URL path.
 * Body stays tiny so page saves never hit “request entity too large”.
 */
async function uploadMedia(req, res, next) {
  try {
    const file = req.file;
    if (!file || !file.buffer) {
      return res.status(400).json({ message: 'Missing file field "file"' });
    }
    if (file.size > MAX_BYTES) {
      return res.status(400).json({ message: 'Image must be under 2MB' });
    }
    const mime = detectImageMime(file.buffer) || (file.mimetype?.startsWith('image/') ? file.mimetype : null);
    if (!mime || !/^image\/(jpeg|png|gif|webp)$/i.test(mime)) {
      return res.status(400).json({ message: 'Use JPEG, PNG, GIF, or WebP' });
    }
    const asset = await prisma.cmsAsset.create({
      data: {
        mime,
        bytes: file.buffer,
      },
      select: { id: true, mime: true },
    });
    res.status(201).json({
      id: asset.id,
      mime: asset.mime,
      /** Path under API_BASE, e.g. /public/media/:id */
      path: `/public/media/${asset.id}`,
    });
  } catch (err) {
    if (err.code === 'P2021' || err.code === 'P2022') {
      return res.status(500).json({
        message: 'Media table is missing. Redeploy the API so migrations can run, then try again.',
      });
    }
    next(err);
  }
}

/** GET /api/public/media/:id — binary image for <img src> */
async function getPublicMedia(req, res, next) {
  try {
    const asset = await prisma.cmsAsset.findUnique({ where: { id: req.params.id } });
    if (!asset) return res.status(404).json({ message: 'Image not found' });
    res.setHeader('Content-Type', asset.mime);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(Buffer.from(asset.bytes));
  } catch (err) {
    if (err.code === 'P2021' || err.code === 'P2022') {
      return res.status(404).json({ message: 'Image not found' });
    }
    next(err);
  }
}

module.exports = { mediaUpload, uploadMedia, getPublicMedia };
