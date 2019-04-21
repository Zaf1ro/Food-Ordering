const mongoCollections = require("./collections");
const order = mongoCollections.order;
const ObjectID = require("mongodb").ObjectID;
const tableNum = require('./settings').tableNum;

const submitOrder = async (orderObj) => {
    if(!orderObj)
        throw "You must provide an valid order";

    if(orderObj.tableID < 0 || orderObj.tableID >= tableNum)
        throw "You must provide an valid tableID for order";

    const orderCollection = await order();
    let res = await orderCollection.insertOne({
        tableID : orderObj.tableID,
        createTime: orderObj.createTime,
        submitTime: new Date(),
        foodList: orderObj.foodList
    });

    if (res.insertedCount === 0) {
        console.log("Cannot insert an new menu item...");
        return undefined;
    }
    return orderCollection.findOne(res.insertedId);
};

const findOrderByTableID = async (tableID) => {
    if(tableID < 0 || tableID >= tableNum)
        throw "You must provide an valid tableID for search";

    const orderCollection = await order();
    return await orderCollection.find({
        tableID: tableID
    }).toArray();
};


module.exports = {
    submitOrder,
    findOrderByTableID
};


