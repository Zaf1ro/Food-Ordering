const express = require('express');
const router = express.Router();
const utils = require('./utils');
const menuModel = require('../data/menu');
const debugPrint = utils.debugPrint;
const asyncWrapper = utils.asyncWrapper;


router.get('/menu', asyncWrapper(async (req, res, next) => {
    debugPrint(req);
    if (!utils.isUserLogin(req)) {
        res.redirect('/');
        return;
    }

    let allMenu = await menuModel.getAllMenuItems().catch(err => {
        console.error(err);
    });

    res.render('menu', {
        title: 'Menu',
        menu: allMenu,
    });
}));

module.exports = router;