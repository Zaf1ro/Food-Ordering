// check whether user is logged in
isUserLogin = (req) => {
    if (!req.session.user) {
        req.session.errorCode = 101;
        return false;
    }
    return true;
};

debugPrint = (req) => {
    const username = req.session.user ? '(' + req.session.user.username + ')' : '(Non-Authenticated User)';
    console.log('[' + new Date().toUTCString() + '] '
        + req.method + ' '
        + req.originalUrl + ' '
        + username);
};

const asyncWrapper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    isUserLogin,
    debugPrint,
    asyncWrapper
};