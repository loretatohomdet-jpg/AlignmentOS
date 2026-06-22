const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { startCheckout } = require('../controllers/billingController');

const router = express.Router();

router.post('/checkout', authMiddleware, startCheckout);

module.exports = router;
