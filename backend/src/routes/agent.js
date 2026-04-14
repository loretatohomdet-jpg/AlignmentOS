const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { chat, status } = require('../controllers/agentController');

const router = express.Router();
router.use(authMiddleware);

router.get('/status', status);
router.post('/chat', chat);

module.exports = router;
