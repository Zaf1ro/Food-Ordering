const express = require('express');
const router = express.Router();

const homeRouter = require('./home');
const userRouter = require('./user');

// let orderRouter = require('./order');
// let menuRouter = require('./menu');

router.all('/', homeRouter);
router.all(['/user', '/user/*'], userRouter);
// router.all(['/order', '/order/*'], orderRouter);
// router.all(['/menu', '/menu/*'], menuRouter);

module.exports = router;