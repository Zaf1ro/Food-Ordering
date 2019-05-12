const express = require('express');
const router = express.Router();
const utils = require('./utils');
const debugPrint = utils.debugPrint;
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
    debugPrint(req);
    if (!utils.isUserLogin(req)) { // new user to register
        const tableID = parseInt(req.body.tableID),
              result = await registerUser(req.body.username, tableID);

        if (!result) {
            console.log('username duplicate...');
            // TODO: notify user to re-input username
        } else {
            req.session.user = {
                username: req.body.username,
                tableID: tableID
            };
            res.redirect('/menu');
        }
    } else { // user already logged in
        res.redirect('/menu');
    }
}));

router.get('/user/logout', (req, res, next) => {
    debugPrint(req);
    req.session.user = null;
    res.redirect('/');
});


module.exports = router;