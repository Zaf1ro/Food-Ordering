let express = require('express');
let router = express.Router();
let util = require('./utils');


router.get('/menu', function (req, res) {
    if (!util.isUserLogin(req, res))
        res.redirect('user');
    let userName = req.session.user.username;
    let menu = {
        creatorName: userName,
        isDeleted: false
    };
    res.render('menu', {
        title: '餐单页',
        username: userName,
        // menuList: result,
        nav: 'menu'
    });
});

module.exports = router;