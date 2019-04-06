const express = require('express');
const router = express.Router();

const homeRouter = require('./home');
const menuRouter = require('./menu');
const orderRouter = require('./order');

router.all(['/', '/*'], homeRouter);
router.all(['/menu', '/menu/*'], menuRouter);
router.all(['/order', '/order/*'], orderRouter);

module.exports = router;