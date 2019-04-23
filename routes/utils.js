/* Error Code
 * 101: User is not logged in
 * 201: Database is not found
 */

// check whether user is logged in
isUserLogin = (req) => {
    if (!req.session.user) {
        req.session.errorCode = 101;
        return false;
    }
    return true;
};

debugPrint = (message, obj) => {
    console.log('%s: %j', message, obj);
    console.log();
};

const asyncWrapper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    isUserLogin,
    debugPrint,
    asyncWrapper
};