const express = require('express');
const { create } = require('../controllers/leadController');

const router = express.Router();

router.post('/', create);

module.exports = router;
