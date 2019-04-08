const express = require('express');
const router = express.Router();

const homeRouter = require('./home');
const userRouter = require('./user');
const menuRouter = require('./menu');
const orderRouter = require('./order');

router.all(['/', '/*'], homeRouter);
router.all(['/user', '/user/*'], userRouter);
router.all(['/menu', '/menu/*'], menuRouter);
router.all(['/order', '/order/*'], orderRouter);

module.exports = router;