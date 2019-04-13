const mongoCollections = require("./collections");;
const userCollection = mongoCollections.user;
const ObjectID = require("mongodb").ObjectID;

const insertUser = async function (username, tableID) {
    if (!username || typeof username !== "string")
        throw "You must provide an valid username for user";
    if (!tableID)
        throw "You must provide an valid tableID for user";
    if(typeof tableID === 'string')
        tableID = parseInt(tableID);

    const user = await userCollection();
    let res = await user.insertOne({
        username: username,
        tableID: tableID
    });

    if (res.insertedCount === 0) {
        console.log("Cannot insert an new user...");
        return undefined;
    }
    return user.findOne(res.insertedId);
};

const findUserByID = async function (userID) {
    if (!userID)
        throw "You must provide an valid tableID for user";
    if (typeof userID === 'string')
        userID = ObjectID(userID);

    const user = await userCollection();
    return await user.findOne({
        _id: userID
    }, function (err, res) {
        if (err) {
            console.error('Cannot find user by ID...');
            return undefined;
        }
        return res;
    });
};

const findUserByName = async function (username, tableID) {
    if (!username || typeof username !== 'string')
        throw "You must provide an valid username for searching user";
    if (!tableID)
        throw "You must provide an valid tableID for searching user";
    if (typeof tableID === 'string')
        tableID = parseInt(tableID);

    const user = await userCollection();
    const res = await user.findOne({
        username: username,
        tableID: tableID
    });
    if(!res)
        console.error('Cannot find user by ID...');
    return res;
};

module.exports = {
    findUserByID,
    findUserByName,
    insertUser
};