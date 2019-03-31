const express = require('express');
const router = express.Router();

const homeRouter = require('./home');
// let orderRouter = require('./order');
// let menuRouter = require('./menu');
// let userRouter = require('./user');

router.all('/', homeRouter);
// router.all(['/order', '/order/*'], orderRouter);
// router.all(['/menu', '/menu/*'], menuRouter);
// router.all(['/user', '/user/*'], userRouter);

module.exports = router;