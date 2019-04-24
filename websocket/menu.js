const menuModel = require('../data/menu');
const orderModel = require('../data/order');
const tableNum = require('../data/settings').tableNum;

/***************************************************
 * Notification message
 ***************************************************/
const addDishMsg = (username, food_name) => {
    return {
        className: 'dis-message-warning',
        iconClassName: 'icon-plus',
        info: '<span class="text-danger">' + username
        + '</span> orders <span class="text-danger">'
        + food_name + '</span>.'
    }
};

const delDishMsg = (username, food_name) => {
    return {
        className: 'dis-message-danger',
        iconClassName: 'icon-minus',
        info: '<span class="text-danger">' + username
        + '</span> cancels <span class="text-danger">'
        + food_name + '</span>.'
    }
};

const submitOrderMsg = (username) => {
    return {
        className: 'dis-message-success',
        iconClassName: 'icon-cursor',
        info: '<span class="text-danger">' + username
        + '</span> places an order.'
    }
};

// Class Order
class Order {
    constructor(tableID) {
        this.tableID = tableID;
        this.createTime = new Date();
        this.dishes = {};
        this.nDish = 0;
    }

    getTableID() {
        return this.tableID;
    }

    getCreateTime() {
        return this.createTime;
    }

    getDishes() {
        return this.dishes;
    }

    addOneDish(id) {
        if (this.dishes[id]) {
            this.dishes[id]++;
        } else {
            this.dishes[id] = 1;
        }
        ++this.nDish;
        return true;
    }

    removeOneDish(id) {
        if (!this.dishes[id])
            return false;

        if (this.dishes[id] === 1) {
            delete this.dishes[id];
        } else {
            this.dishes[id] -= 1;
        }
        --this.nDish;
        return true;
    }

    removeAllDish(id) {
        for (let key in this.dishes) {
            delete this.dishes[key];
        }
        this.nDish = 0;
    }
}

const orderList = Array(tableNum);

const menuItemConn = (menuItemSocket) => {
    menuItemSocket.on('connection', async (client) => {
        let params = client.client.conn.request._query;
        // check tableID and username
        if (!params || !params.tableID || !params.username)
            return;

        const tableID = parseInt(params.tableID),
              username = params.username;
        // check tableID
        if (tableID < 0 || tableID >= tableNum)
            return;

        // join room
        client.join(tableID);
        menuItemSocket.to(tableID).emit('join-table', {
            className: 'dis-message-info',
            iconClassName: 'icon-envelope',
            info: '<span class="text-danger">' + username + '</span> joins table'
        });

        // get current order
        let thisOrder = undefined;
        if (orderList[tableID]) {
            thisOrder = orderList[tableID];
        } else {
            thisOrder = new Order(tableID);
            orderList[tableID] = thisOrder;
        }

        // get dishes which are ordered before
        if (thisOrder.nDish > 0) {
            console.log("Send Order!!!");
            let dishList = [];
            let allDishes = thisOrder.getDishes();
            for (let _id in allDishes) {
                if (allDishes.hasOwnProperty(_id)) {
                    let dishInfo = await menuModel.findMenuItemByID(_id).catch(err => {
                        console.error(err);
                    });
                    dishInfo.num = allDishes[_id];
                    dishList.push(dishInfo);
                }
            }
            menuItemSocket.to(client.id).emit('reload-dishes', dishList);
        }

        // listen on 'add one dish' event
        client.on('add-dish', async orderInfo => {
            let dishInfo = await menuModel.findMenuItemByID(orderInfo._id).catch(err => {
                console.error(err);
            });
            if (dishInfo) {
                dishInfo.msg = addDishMsg(orderInfo.username, dishInfo.food_name);
                menuItemSocket.to(tableID).emit('add-dish', dishInfo);
                thisOrder.addOneDish(dishInfo._id);
            }
        });

        // listen on 'delete one dish' event
        client.on('del-dish', async orderInfo => {
            let dishInfo = await menuModel.findMenuItemByID(orderInfo._id).catch(err => {
                console.error(err);
            });
            if (dishInfo) {
                dishInfo.msg = delDishMsg(orderInfo.username, dishInfo.food_name);
                menuItemSocket.to(tableID).emit('del-dish', dishInfo);
                thisOrder.removeOneDish(dishInfo._id);
            }
        });

        client.on('submit-order', async username => {
            // submit broadcast
            if(username) {
                menuItemSocket.to(tableID).emit('submit-order', {
                    username: username,
                    msg: submitOrderMsg(username)
                });
            }

            // database operation
            await orderModel.submitOrder({
                tableID: thisOrder.getTableID(),
                createTime: thisOrder.getCreateTime(),
                foodList: thisOrder.getDishes()
            }).catch((err) => {
                console.error(err);
            });
            thisOrder.removeAllDish();
        });
    })
};


module.exports = {
    menuItemConn
};
