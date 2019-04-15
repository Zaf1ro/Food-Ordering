const express = require('express');
const router = express.Router();
const utils = require('./utils');
const asyncWrapper = utils.asyncWrapper;
const userModel = require('../data/user');

const registerUser = async (username, tableID) => {
    try {
        let res = await userModel.findUserByName(username, tableID);
        if (!res)
            return await userModel.insertUser(username, tableID);
        return res;
    } catch (err) {
        console.error(err);
    }
};

router.post('/user/register', asyncWrapper(async (req, res, next) => {
    if (!utils.isUserLogin(req)) { // new user to register
        let result = await registerUser(req.body.username, req.body.tableID);
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
    } else { // user already logged in
        res.redirect('/menu');
    }
}));

router.get('/user/logout', (req, res, next) => {
    req.session.user = null;
    res.redirect('/');
});


module.exports = router;