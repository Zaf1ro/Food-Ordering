const mongoCollections = require("./collections");
const menu = mongoCollections.menu;
const ObjectID = require("mongodb").ObjectID;

const insertMenuItem = async (item) => {
    if (!item || typeof item !== 'object')
        throw "You must provide an valid item for menu";

    const menuCollection = await menu();
    let res = await menuCollection.insertOne({
        food_name: item.food_name,
        img_url: item.img_url,
        category: item.category,
        rating: item.rating,
        price: item.price,
        recipe: item.recipe
    });

    if (res.insertedCount === 0) {
        console.log("Cannot insert an new menu item...");
        return undefined;
    }
    return menuCollection.findOne(res.insertedId);
};

const findMenuItemByID = async (itemID) => {
    if (!itemID)
        throw "You must provide an valid itemID for menu item";
    if (typeof itemID === 'string')
        itemID = ObjectID(itemID);

    const menuCollection = await menu();
    let res = await menuCollection.findOne({
        _id: itemID
    });

    if(res) {
        res._id = res._id.toString();
    }
    return res;
};

const findMenuItemByCat = async (category) => {
    if (!category || typeof category !== 'string')
        throw "You must provide an valid category for searching menu item";

    const menuCollection = await menu();
    return await menuCollection.findOne({
        category: category
    });
};

const findMenuItemByName = async (menuName, flag) => {
    if (!menuName || typeof menuName !== 'string')
        throw "You must provide an valid name for searching menu item";

    const menuCollection = await menu();
    const res = await menuCollection.findOne({
        food_name: menuName
    });
    if (!res && flag)
        console.error('Cannot find item by menu name...');
    return res;
};

const initMenu = async () => {
    const appetizer = require('./json/menu');
    for (let item of appetizer) {
        let res = await findMenuItemByName(item.food_name, false);
        if (!res) {
            res = await insertMenuItem(item);
            if (!res)
                return false;
        }
    }
    return true
};

const getAllMenuItems = async () => {
    const menuCollection = await menu();
    return await menuCollection.aggregate([
        {
            $group: {
                _id: '$category',
                foodList: {
                    $push: {
                        _id: {
                            $toString: "$_id"
                        },
                        food_name: '$food_name',
                        img_url: '$img_url',
                        category: '$category',
                        rating: '$rating',
                        price: '$price',
                        recipe: '$recipe'
                    }
                }
            }
        }
    ]).toArray();
};


module.exports = {
    findMenuItemByCat,
    findMenuItemByID,
    findMenuItemByName,
    insertMenuItem,
    initMenu,
    getAllMenuItems
};