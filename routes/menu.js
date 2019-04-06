const express = require('express');
const router = express.Router();
const utils = require('./utils');
const model = require('../data/json/index');


router.get('/menu', function (req, res) {
    utils.debugPrint('Menu Get:', req.session.user);
    if (!utils.isUserLogin(req, res))
        res.redirect('/');

    // console.log(model.appetizers);
    res.render('menu', {
        title: 'Menu',
        user: req.session.user,
        recipe: model.recipe,
        nav: 'menu'
    });
});

module.exports = router;