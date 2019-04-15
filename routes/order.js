const express = require('express');
const router = express.Router();
const utils = require('./utils');
const model = require('../data/json/order');

router.get('/order', (req, res, next) => {
    utils.debugPrint('Order Get:', req.session.user);
    if (!utils.isUserLogin(req)) {
        res.redirect('/');
        return;
    }

    let user = req.session.user;
    let orders = model.filter((food) => {
        if (food['table_id'] === parseInt(user.tableID)) {
            let food_detail = model.findFoodById(food['food_id']);
            if (!food_detail)
                throw "Cannot find food by ID";
            food['food_name'] = food_detail['name'];
            return food;
        }
    });

    res.render('order', {
        title: 'Order',
        user: user,
        orders: orders
    });
});

module.exports = router;