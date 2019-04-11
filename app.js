const express = require('express');
const app = express();
const model = require('./data/json/index');

// template
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser('HASH_CODE'));

// app starts
const PORT = process.env.NODE_ENV === 'production' ? 80 : 3000;
const server = app.listen(PORT, () => {
    console.log("Server being hosted on localhost:3000");
});

// session
const session = require('express-session');
app.use(session({
    cookie: { maxAge: 1800000, secure: false },
    errorCode: 0,
    secret: 'HASH_CODE', // TODO: add a meaningful string
    resave: true,
    saveUninitialized: true,
    // store: mongoStore
}));

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    // TODO: add err message notification
    // const err = req.session.error;
    // delete req.session.error;
    // res.locals.message = '';
    // if (err) {
    //     res.locals.message = err;
    // }
    next();
});

// router
const router = require('./routes');
app.use(router);

// 404
app.use(function (req, res, next) {
    return res.status(404).render('404');
});

// Class Order
class Order {
    constructor(orderID) {
        this.orderID = orderID;
        this.dishes = {};
        this.nDish = 0;
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
        ++this.nDish;
        return true;
    }

    removeOneDish(id) {
        if(!this.dishes[id])
            return false;

        if(this.dishes[id] === 1) {
            delete this.dishes[id];
        } else {
            this.dishes[id] -= 1;
        }
        --this.nDish;
        return true;
    }

    removeAllDish(id) {
        for(let key in this.dishes) {
            delete this.dishes[key];
        }
        this.nDish = 0;
    }
}

// socket.io
const io = require('socket.io')(server);
const orderSocket = io.of('/order');

const numOfTable = 3;
const orderList = [];
for(let i = 0; i < numOfTable; ++i) {
    orderList.push(new Order());
}

// someone add dish to list
orderSocket.on('connection', socket => {
    let params = socket.client.conn.request._query;
    // check tableID and username
    if(!params || !params.tableID || !params.username)
        return;

    let tableID = params.tableID,
        username = params.username;
    // check tableID
    if(tableID <= 0 || tableID >= numOfTable)
        return;

    // join room
    socket.join(tableID);
    // get current order

    let thisOrder = orderList[tableID - 1];

    if(thisOrder.nDish > 0) {
        console.log("Send Order!!!");
        let dishList = [];
        let allDishes = thisOrder.getDishes();
        for(let dish_id in allDishes) {
            let dishInfo = model.findFoodById(dish_id);
            dishInfo.num = allDishes[dish_id];
            dishList.push(dishInfo);
        }
        orderSocket.emit('selected-dishes', dishList);
    }

    // listen on 'add dish' event
    socket.on('add-dish', dishInfo => {
        let food = model.findFoodById(dishInfo.food_id);
        if(food) {
            orderSocket.to(tableID).emit('add-dish', food);
            thisOrder.addOneDish(food.id);
        }
    });

    socket.on('del-dish', dishInfo => {
        let food = model.findFoodById(dishInfo.food_id);
        if(food) {
            orderSocket.to(tableID).emit('del-dish', food);
            thisOrder.removeOneDish(food.id);
        }
    });
});
