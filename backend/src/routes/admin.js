const express = require('express');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const {
  getAnalyticsOverview,
  listUsers,
  getUser,
  updateUser,
  listUserNotes,
  createUserNote,
  listAssessments,
  getAssessmentDetail,
  updateAssessment,
  updateQuestion,
  getLeads,
  getLeadsCount,
  exportLeadsCsv,
} = require('../controllers/adminController');

const router = express.Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get('/analytics/overview', getAnalyticsOverview);

router.get('/users', listUsers);
router.get('/users/:userId/notes', listUserNotes);
router.post('/users/:userId/notes', createUserNote);
router.get('/users/:userId', getUser);
router.patch('/users/:userId', updateUser);

router.get('/assessments', listAssessments);
router.get('/assessments/:assessmentId', getAssessmentDetail);
router.patch('/assessments/:assessmentId', updateAssessment);
router.patch('/questions/:questionId', updateQuestion);

router.get('/leads', getLeads);
router.get('/leads/count', getLeadsCount);
router.get('/leads/export', exportLeadsCsv);

module.exports = router;
