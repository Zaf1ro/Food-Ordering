// settings
const settings = require('./data/settings');

// express
const express = require('express');
const app = express();

// template
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// app starts
const PORT = process.env.NODE_ENV === 'production' ? 80 : 3000;
const server = app.listen(PORT, () => {
    console.log("Server being hosted on localhost:3000");
});

// session
const session = require('express-session');
app.use(session({
    cookie: {maxAge: 1800000, secure: false},
    errorCode: 0,
    secret: settings.sessionSecret,
    resave: true,
    saveUninitialized: true,
    // store: mongoStore
}));

app.use((req, res, next) => {
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
app.use((req, res, next) => {
    return res.status(404).render('404');
});

// init menu in mongodb
const menuModel = require('./data/menu');
menuModel.initMenu().then((res) => {
    if (!res)
        console.log('Fail to init menu database');
}).catch((err) => {
    console.log(err);
});

// socket.io
const io = require('socket.io')(server);
const menuItemSocket = io.of('/menuItem');
const socketConn = require('./websocket');

socketConn.menuItemConn(menuItemSocket);
