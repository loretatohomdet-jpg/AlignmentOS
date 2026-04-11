const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getMe, updateMe } = require('../controllers/userController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMe);
router.patch('/', updateMe);

module.exports = router;
