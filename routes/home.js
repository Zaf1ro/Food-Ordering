const express = require('express');
const router = express.Router();
const utils = require('./utils');

router.get('/', function (req, res) {
    if(utils.isUserLogin(req))
        res.redirect('/menu');

    res.render('home', {
        title: 'Hey'
    });
});

router.post('/', function (req, res) {
    console.log("1111");
    if(!utils.isUserLogin(req)) {
        res.redirect('/user');
    }
    res.redirect('/menu');
});

module.exports = router;