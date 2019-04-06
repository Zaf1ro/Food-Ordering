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
    cookie: { maxAge: 1800000 },
    errorCode: 0,
    secret: 'HASH_CODE', // TODO: add a meaningful string
    resave: true,
    saveUninitialized: true,
    // store: mongoStore
}));

// router
const router = require('./routes');
app.use(router);
app.use(function (req, res, next) {
    return res.status(404).render('404');
});

// socket.io
const io = require('socket.io')(server);
const meal = io.of('/meal');

meal.on('connection', socket => {

});