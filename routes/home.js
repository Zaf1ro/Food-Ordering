const express = require('express');
const router = express.Router();
const utils = require('./utils');

const userList = [];

router.get('/', function (req, res) {
    utils.debugPrint('Home Get:', req.session.user);
    res.render('home', {
        user: req.session.user,
        tables: [1, 2, 3]
    });
});

router.post('/', function (req, res) {
    if(!utils.isUserLogin(req)) {
        registerUser(req.body.username, req.body.tableID);
        req.session.user = {
            username: req.body.username,
            tableID: req.body.tableID
        };
    }
    res.redirect('/menu');
});

registerUser = function (username, tableID) {
    userList.push({username, tableID});
};

module.exports = router;