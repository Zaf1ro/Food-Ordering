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

// socket.io
const io = require('socket.io')(server);
const orderSocket = io.of('/order');

counter = 0;
orderList = {};
for(i of [1,2,3])
    orderList[i] = undefined;

// someone add dish to list
orderSocket.on('connection', socket => {
    let params = socket.client.conn.request._query;
    if(!params || !params.tableID)
        return;

    // join room
    let tableID = params.tableID;
    socket.join(tableID);

    // listen on 'add dish' event
    socket.on('add-dish', dishInfo => {
        let food = model.findFoodById(dishInfo.food_id);
        if(food) {
            orderSocket.to(tableID).emit('add-dish', food);
        }
    });
});
