const express = require('express');
const rateLimit = require('express-rate-limit');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const {
  getActiveAssessment,
  previewAssessment,
  submitAssessment,
  getLatestResult,
  getScoreHistory,
  getReport,
  emailAssessmentReport,
} = require('../controllers/assessmentController');

const router = express.Router();

const emailReportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// Get the currently active assessment with questions
router.get('/active', getActiveAssessment);

// Anonymous preview: score + pillars + type (no persistence)
router.post('/preview', previewAssessment);

// Email a copy of the diagnostic (guest answers, or signed-in saved profile)
router.post('/email-report', emailReportLimiter, optionalAuth, emailAssessmentReport);

// Submit responses and calculate Alignment Index / AQ
router.post('/submit', authMiddleware, submitAssessment);

// Get latest Alignment Index result for current user
router.get('/result', authMiddleware, getLatestResult);

// Get alignment report (strengths, gaps, primary domain)
router.get('/report', authMiddleware, getReport);

// Get score history for current user (for charts)
router.get('/history', authMiddleware, getScoreHistory);

module.exports = router;

