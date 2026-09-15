const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../middleware/auth');
const { requirePaidPlan } = require('../middleware/requirePaidPlan');
const { getMe, updateMe, rotateShareToken, uploadAvatar } = require('../controllers/userController');
const { listReflections, createReflection } = require('../controllers/reflectionController');
const { getDayRituals, listRitualArchive, upsertDayRitual } = require('../controllers/dayRitualController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200_000, files: 1 },
});

router.use(authMiddleware);

router.get('/', getMe);
router.patch('/', updateMe);
router.get('/reflections', listReflections);
router.post('/reflections', requirePaidPlan, createReflection);
router.get('/rituals/archive', listRitualArchive);
router.get('/rituals', getDayRituals);
router.put('/rituals', upsertDayRitual);
router.post('/share', rotateShareToken);
router.post('/avatar', upload.single('file'), uploadAvatar);

module.exports = router;
