// settings
const settings = require('./data/settings');

// express
const express = require('express');
const app = express();

// template
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    secret: settings.sessionSecret,
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

// init menu in mongodb
const menuModel = require('./data/menu');
menuModel.initMenu().then((res) => {
    if(!res)
        console.log('Fail to init menu database');
}).catch((err) => {
    console.log(err);
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
orderSocket.on('connection', async client => {
    let params = client.client.conn.request._query;
    // check tableID and username
    if(!params || !params.tableID || !params.username)
        return;

    let tableID = params.tableID,
        username = params.username;
    // check tableID
    if(tableID <= 0 || tableID >= numOfTable)
        return;

    // join room
    client.join(tableID);

    // get current order
    let thisOrder = orderList[tableID - 1];

    // get dishes which are ordered before
    if(thisOrder.nDish > 0) {
        console.log("Send Order!!!");
        let dishList = [];
        let allDishes = thisOrder.getDishes();
        for(let _id in allDishes) {
            if (allDishes.hasOwnProperty(_id)) {
                let dishInfo = await menuModel.findMenuItemByID(_id);
                dishInfo.num = allDishes[_id];
                dishList.push(dishInfo);
            }
        }
        orderSocket.to(client.id).emit('selected-dishes', dishList);
    }

    // listen on 'add one dish' event
    client.on('add-dish', async dishInfo => {
        let food = await menuModel.findMenuItemByID(dishInfo._id);
        if(food) {
            orderSocket.to(tableID).emit('add-dish', food);
            thisOrder.addOneDish(food._id);
        }
    });

    // listen on 'delete one dish' event
    client.on('del-dish', async dishInfo => {
        let food = await menuModel.findMenuItemByID(dishInfo._id);
        if(food) {
            orderSocket.to(tableID).emit('del-dish', food);
            thisOrder.removeOneDish(food._id);
        }
    });
});
