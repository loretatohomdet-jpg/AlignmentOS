const express = require('express');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const {
  getAnalyticsOverview,
  listUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  listUserNotes,
  createUserNote,
  deleteUserNote,
  listAssessments,
  createAssessment,
  getAssessmentDetail,
  updateAssessment,
  deleteAssessment,
  updateQuestion,
  createQuestion,
  deleteQuestion,
  getLeads,
  getLeadsCount,
  exportLeadsCsv,
  deleteLead,
} = require('../controllers/adminController');
const {
  createLead,
  updateLead,
  listPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  listShop,
  getShopOffer,
  createShopOffer,
  updateShopOffer,
  deleteShopOffer,
  listHabits,
  createHabit,
  updateHabit,
  deleteHabit,
} = require('../controllers/adminContentController');

const router = express.Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get('/analytics/overview', getAnalyticsOverview);

router.get('/users', listUsers);
router.post('/users', createUser);
router.get('/users/:userId/notes', listUserNotes);
router.post('/users/:userId/notes', createUserNote);
router.delete('/users/:userId/notes/:noteId', deleteUserNote);
router.get('/users/:userId', getUser);
router.patch('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

router.get('/assessments', listAssessments);
router.post('/assessments', createAssessment);
router.get('/assessments/:assessmentId', getAssessmentDetail);
router.patch('/assessments/:assessmentId', updateAssessment);
router.delete('/assessments/:assessmentId', deleteAssessment);
router.post('/assessments/:assessmentId/questions', createQuestion);
router.patch('/questions/:questionId', updateQuestion);
router.delete('/questions/:questionId', deleteQuestion);

router.get('/leads', getLeads);
router.get('/leads/count', getLeadsCount);
router.get('/leads/export', exportLeadsCsv);
router.post('/leads', createLead);
router.patch('/leads/:leadId', updateLead);
router.delete('/leads/:leadId', deleteLead);

router.get('/pages', listPages);
router.post('/pages', createPage);
router.get('/pages/:pageId', getPage);
router.patch('/pages/:pageId', updatePage);
router.delete('/pages/:pageId', deletePage);

router.get('/shop', listShop);
router.post('/shop', createShopOffer);
router.get('/shop/:offerId', getShopOffer);
router.patch('/shop/:offerId', updateShopOffer);
router.delete('/shop/:offerId', deleteShopOffer);

router.get('/habits', listHabits);
router.post('/habits', createHabit);
router.patch('/habits/:habitId', updateHabit);
router.delete('/habits/:habitId', deleteHabit);

module.exports = router;
