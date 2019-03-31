const express = require('express');
const router = express.Router();
// const db = require('../data/module');
const utils = require('./utils');

router.get('/', function (req, res) {
    // check whether user is logged in
    utils.checkUserStatus(req, res);
    // let username = req.session.user.username;

    res.render('home', {
        title: 'Hey',
        message: 'Hello there!'
    });
});

module.exports = router;