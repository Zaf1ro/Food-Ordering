const mongoClient = require("mongodb").MongoClient;
const settings = require("./settings");
const mongoConfig = settings.mongoConfig;


module.exports = async () => {
    let client = await mongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true
    }).catch((err) => {
        console.error(err);
    });
    return await client.db(mongoConfig.dbName);
};
