const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { startCheckout, billingStatus } = require('../controllers/billingController');

const router = express.Router();

router.get('/status', billingStatus);
router.post('/checkout', authMiddleware, startCheckout);

module.exports = router;
