const express = require('express');
const router = express.Router();
const utils = require('./utils');
const model = require('../data/model_json');


router.get('/menu', function (req, res) {
    utils.debugPrint('Menu Get:', req.session.user);
    if (!utils.isUserLogin(req, res))
        res.redirect('/');
    let user = req.session.user;
    // console.log(model.appetizers);
    res.render('menu', {
        title: 'Menu',
        user: user,
        appetizers: model.appetizers,
        salad: model.salad,
        nav: 'menu'
    });
});

module.exports = router;