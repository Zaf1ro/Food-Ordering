const express = require('express');
const router = express.Router();
const utils = require('./utils');

const userList = [];

router.post('/user/register', function(req, res) {
    if(!utils.isUserLogin(req)) {
        registerUser(req.body.username, req.body.tableID);
        req.session.user = {
            username: req.body.username,
            tableID: req.body.tableID
        };
    }
    res.redirect('/menu');
});

router.get('/user/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
});

registerUser = function (username, tableID) {
    userList.push({username, tableID});
};

module.exports = router;