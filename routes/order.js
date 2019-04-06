const express = require('express');
const router = express.Router();
const utils = require('./utils');
const model = require('../data/json/index');


router.get('/order', function (req, res) {
    utils.debugPrint('Order Get:', req.session.user);
    if (!utils.isUserLogin(req, res))
        res.redirect('/');

    let user = req.session.user;
    let orders = model.orders.filter((food) => {
        if(food['table_id'] === user.tableID) {
            let food_detail = model.findFoodById(food.id);
            if(!food_detail)
                throw "Cannot find food by ID";
            food['food_name'] = food_detail["name"];
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