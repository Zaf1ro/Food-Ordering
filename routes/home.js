const express = require('express');
const router = express.Router();
const utils = require('./utils');

router.get('/', (req, res, next) => {
    utils.debugPrint('Home Get:', req.session.user);
    res.render('home', {
        title: 'Home',
        tables: [1, 2, 3]
    });
});

module.exports = router;