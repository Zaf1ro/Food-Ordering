const express = require('express');
const router = express.Router();
const utils = require('./utils');
const menuModel = require('../data/menu');
const debugPrint = utils.debugPrint;
const asyncMiddleware = utils.asyncMiddleware;


router.get('/menu', asyncMiddleware(async (req, res) => {
    debugPrint('Menu Get:', req.session.user);
    if (!utils.isUserLogin(req, res)) {
        res.redirect('/');
        return;
    }

    let allMenu = await menuModel.getAllMenuItems();

    res.render('menu', {
        title: 'Menu',
        menu: allMenu,
        nav: 'menu'
    });
}));

module.exports = router;