let express = require('express');
let router = express.Router();
// let db = require('../database/model');


// Register Home
router.get('/user', function (req, res) {
    res.render('user',
        {title: 'Register', tables: [1,2,3]},
    );
});

// Register New User
router.post('/user', function (req, res) {
    // TODO: check if user input their name and tableID
    // if(!user.tableID || ! user.username)
    //     console.log("error");

    let user = {
        username: req.body.name,
        tableID: req.body.tableID,
        createTime: new Date(),
        updateTime: new Date()
    };

    req.session.user = user;
    console.log(user);
    res.redirect('/');
});


module.exports = router;