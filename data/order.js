const mongoCollections = require("./collections");
const order = mongoCollections.order;
const ObjectID = require("mongodb").ObjectID;
const tableNum = require('./settings').tableNum;

const submitOrder = async (orderObj) => {
    if(!orderObj)
        throw "You must provide an valid order";

    if(orderObj.tableID < 0 || orderObj.tableID >= tableNum)
        throw "You must provide an valid tableNum for order";

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


module.exports = {
    submitOrder
};


