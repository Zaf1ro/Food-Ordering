const express = require('express');
const router = express.Router();
const utils = require('./utils');
const asyncWrapper = utils.asyncWrapper;
const orderModel = require('../data/order');

router.get('/order', asyncWrapper(async (req, res, next) => {
    utils.debugPrint('Order Get:', req.session.user);
    if (!utils.isUserLogin(req)) {
        res.redirect('/');
        return;
    }

    const user = req.session.user;
    let allOrder = await orderModel.findOrderByTableID(user.tableID).catch((err) => {
        console.error(err);
    });

    res.render('order', {
        title: 'Order',
        orders: allOrder
    });
}));

module.exports = router;