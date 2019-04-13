const express = require('express');
const router = express.Router();
const utils = require('./utils');
const userModel = require('../data/user');

const registerUser = async function (username, tableID) {
    let res = await userModel.findUserByName(username, tableID);
    if (!res)
        return await userModel.insertUser(username, tableID);
    return res;
};

router.post('/user/register', function (req, res) {
    if (!utils.isUserLogin(req)) {
        registerUser(req.body.username, req.body.tableID).then((result) => {
            if (!result) {
                console.log('username duplicate...');
                // TODO: notify user to re-input username
            } else {
                req.session.user = {
                    username: req.body.username,
                    tableID: req.body.tableID
                };
                res.redirect('/menu');
            }
        })
        .catch((err) => {
            console.error(err);
        })
    }
});

router.get('/user/logout', function (req, res) {
    req.session.user = null;
    res.redirect('/');
});


module.exports = router;