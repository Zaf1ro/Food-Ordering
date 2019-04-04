let express = require('express');
let router = express.Router();
let utils = require('./utils');


router.get('/menu', function (req, res) {
    utils.debugPrint('Menu Get:', req.session.user);
    if (!utils.isUserLogin(req, res))
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