const express = require('express');
const { sendDueHabitNudges } = require('../services/habitNudge');

const router = express.Router();

function cronAuth(req, res, next) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return res.status(404).json({ message: 'Not found' });
  }
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.headers['x-cron-secret'];
  if (!token || token !== secret) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

async function runNudges(_req, res, next) {
  try {
    const result = await sendDueHabitNudges();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

router.post('/habit-nudges', cronAuth, runNudges);
router.get('/habit-nudges', cronAuth, runNudges);

module.exports = router;
