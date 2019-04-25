const express = require('express');
const router = express.Router();
const utils = require('./utils');
const asyncWrapper = utils.asyncWrapper;
const orderModel = require('../data/order');
const menuModel = require('../data/menu');

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

        let food_list = allOrders[i].foodList;
        for(const k in food_list) {
            const res = await menuModel.findMenuItemByID(k);
            food_list[res.food_name] = food_list[k];
            delete food_list[k];
        }
        allOrders[i].foodList = food_list;
    }

    res.render('order', {
        title: 'Order',
        orders: allOrders
    });
}));

module.exports = router;