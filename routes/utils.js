/* Error Code
 * 101: User is not logged in
 * 201: Database is not found
 */

// check whether user is logged in
isUserLogin = function (req) {
    if (!req.session.user) {
        req.session.errorCode = 101;
        return false;
    }
    return true;
};

debugPrint = function (message, obj) {
    console.log(message);
    console.log(obj);
    console.log();
};

const asyncMiddleware = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};

module.exports = {
    isUserLogin,
    debugPrint,
    asyncMiddleware
};