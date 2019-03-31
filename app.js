const express = require('express');
const app = express();

// template
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// router
const router = require('./routes');
app.use(router);

// session
const session = require('express-session');
app.use(session({
    cookie: { maxAge: 1800000 },
    errorCode: 0,
    secret: 'HASH_CODE', // TODO: add a meaningful string
    // resave: true,
    // saveUninitialized: true,
    // store: mongoStore
}));

// app starts
const PORT = process.env.NODE_ENV === 'production' ? 80 : 3000;
app.listen(PORT, () => {
    console.log("Server being hosted on localhost:3000");
});