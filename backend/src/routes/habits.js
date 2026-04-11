const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getActiveHabits, completeHabit, getCompletionStats } = require('../controllers/habitController');

const router = express.Router();

router.use(authMiddleware);

router.get('/active', getActiveHabits);
router.post('/complete', completeHabit);
router.get('/stats', getCompletionStats);

module.exports = router;
