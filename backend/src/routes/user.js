const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../middleware/auth');
const { getMe, updateMe, rotateShareToken, uploadAvatar } = require('../controllers/userController');
const { listReflections, createReflection } = require('../controllers/reflectionController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200_000, files: 1 },
});

router.use(authMiddleware);

router.get('/', getMe);
router.patch('/', updateMe);
router.get('/reflections', listReflections);
router.post('/reflections', createReflection);
router.post('/share', rotateShareToken);
router.post('/avatar', upload.single('file'), uploadAvatar);

module.exports = router;
