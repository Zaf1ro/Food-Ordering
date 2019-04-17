const menuModel = require('../data/menu');
const numOfTable = 3;

// Class Order
class Order {
    constructor(orderID) {
        this.orderID = orderID;
        this.dishes = {};
        this.nDish = 0;
    }

    getOrderID() {
        return this.orderID;
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

const orderList = [];
for (let i = 0; i < numOfTable; ++i) {
    orderList.push(new Order());
}

const menuItemConn = (menuItemSocket) => {
    menuItemSocket.on('connection', async (client) => {
        let params = client.client.conn.request._query;
        // check tableID and username
        if (!params || !params.tableID || !params.username)
            return;

        let tableID = params.tableID,
            username = params.username;
        // check tableID
        if (tableID <= 0 || tableID >= numOfTable)
            return;

        // join room
        client.join(tableID);

        // get current order
        let thisOrder = orderList[tableID - 1];

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
            menuItemSocket.to(client.id).emit('selected-dishes', dishList);
        }

        // listen on 'add one dish' event
        client.on('add-dish', async dishInfo => {
            let food = await menuModel.findMenuItemByID(dishInfo._id).catch(err => {
                console.error(err);
            });
            if (food) {
                menuItemSocket.to(tableID).emit('add-dish', food);
                thisOrder.addOneDish(food._id);
            }
        });

        // listen on 'delete one dish' event
        client.on('del-dish', async dishInfo => {
            let food = await menuModel.findMenuItemByID(dishInfo._id).catch(err => {
                console.error(err);
            });
            if (food) {
                menuItemSocket.to(tableID).emit('del-dish', food);
                thisOrder.removeOneDish(food._id);
            }
        });
    })
};


module.exports = {
    menuItemConn
};