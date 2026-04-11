const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  getActiveAssessment,
  previewAssessment,
  submitAssessment,
  getLatestResult,
  getScoreHistory,
  getReport,
} = require('../controllers/assessmentController');

const router = express.Router();

// Get the currently active assessment with questions
router.get('/active', getActiveAssessment);

// Anonymous preview: score + pillars + type (no persistence)
router.post('/preview', previewAssessment);

// Submit responses and calculate Alignment Index / AQ
router.post('/submit', authMiddleware, submitAssessment);

// Get latest Alignment Index result for current user
router.get('/result', authMiddleware, getLatestResult);

// Get alignment report (strengths, gaps, primary domain)
router.get('/report', authMiddleware, getReport);

// Get score history for current user (for charts)
router.get('/history', authMiddleware, getScoreHistory);

module.exports = router;

