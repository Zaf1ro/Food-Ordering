const express = require('express');
const router = express.Router();
const utils = require('./utils');
const tableNum = require('../data/settings').tableNum;

router.get('/', (req, res, next) => {
    utils.debugPrint('Home Get:', req.session.user);
    res.render('home', {
        title: 'Home',
        tableNum: tableNum
    });
});

module.exports = router;