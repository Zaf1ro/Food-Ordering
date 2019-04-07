const express = require('express');
const router = express.Router();
const utils = require('./utils');
const model = require('../data/json/index');

class Order {
    constructor(orderID) {
        this.orderID = orderID;
        this.dishes = {};
    }

    getOrderID() {
        return this.orderID;
    }

    getDishes() {
        return this.dishes;
    }

    addOneDish(id) {
        if(this.dishes[id]) {
            this.dishes[id]++;
        } else {
            this.dishes[id] = 1;
        }
        return true;
    }

    removeOneDish(id) {
        if(!this.dishes[id]) {
            return false;
        }
        if(this.dishes[id] === 1) {
            this.removeAllDish(id);
        } else {
            this.dishes[id] -= 1;
        }
        return true;
    }

    removeAllDish(id) {
        return this.dishes.delete(id);
    }
}

router.get('/order', function (req, res) {
    utils.debugPrint('Order Get:', req.session.user);
    if (!utils.isUserLogin(req, res)) {
        res.redirect('/');
        return;
    }

    let user = req.session.user;
    let orders = model.orders.filter((food) => {
        if(food['table_id'] === parseInt(user.tableID)) {
            let food_detail = model.findFoodById(food['food_id']);
            if(!food_detail)
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