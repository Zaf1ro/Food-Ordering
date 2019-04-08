const express = require('express');
const router = express.Router();
const utils = require('./utils');

router.get('/', function (req, res) {
    utils.debugPrint('Home Get:', req.session.user);
    res.render('home', {
        tables: [1, 2, 3]
    });
});

module.exports = router;