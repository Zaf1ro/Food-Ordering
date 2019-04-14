const dbConnection = require("./connections");

const getColByName = (colName) => {
    let col = undefined;
    return async () => {
        const db = await dbConnection();
        if (!col) {
            col = await db.collection(colName);
            if (!col)
                col = await db.createCollection(colName);
        }
        return col;
    }
};


module.exports = {
    user: getColByName('user'),
    menu: getColByName('menu')
};
