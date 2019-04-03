let express = require('express');
let router = express.Router();
let util = require('./utils');


router.get('/menu', function (req, res) {
    if (!util.isUserLogin(req, res))
        res.redirect('/');
    let user = req.session.user;
    res.render('menu', {
        title: 'Menu',
        user: user,
        menuList: [],
        nav: 'menu'
    });
});

module.exports = router;