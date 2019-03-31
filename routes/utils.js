/* Error Code
 * 101: User is not logged in
 * 201: Database is not found
 */

// check whether user is logged in
checkUserStatus = function (req, res) {
    // if (!req.session.user) {
    //     req.session.errorCode = 101;
    //     res.redirect('/user/register');
    // }
};


module.exports = {
    checkUserStatus
};