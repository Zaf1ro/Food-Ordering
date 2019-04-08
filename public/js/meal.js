/***************************************************
 * Global variables
 ***************************************************/
const username = $('#username').text();
const tableID = $('#tableID').text();
const socket = io('/order?tableID=' + tableID);
const dishList = $('#dish-list');
const basketInfo = $('#basket-info');


/***************************************************
 * Send request to server
 ***************************************************/
// Send new dish request to server
const emitAddDishEvent = function (dishInfo) {
    socket.emit('add-dish', dishInfo);
};

// Send cancel dish request to server
function emitDelDishEvent(dishInfo) {
    socket.emit('del-dish', dishInfo);
}

/***************************************************
 * Listen response from server
 ***************************************************/
(function (window, document, $) {
    let addDishBtn = $('.add-dish-btn');
    console.log('starting...');

    addDishBtn.on('click', function () {
        let food_id = $(this).parent().attr('id');
        emitAddDishEvent({
            username: username,
            food_id: food_id,
        });
    });

    // Listen Add Dish event from customer
    socket.on('add-dish', function (dishInfo) {
        addDishHandler(dishInfo);
    });

    socket.on('add-')

}(window, document, $));


/***************************************************
 * Handler for menu list
 ***************************************************/
const addDishHandler = function (dishInfo) {
    let thisDishLine = dishList.find('.dish-line[dish-id=' + dishInfo.id + ']');
    if (thisDishLine.length === 0) {
        dishInfo.num = 1;
        let oneLine = dishList.append(genDishLine(dishInfo));
        addDishLineHandler(oneLine);
    } else {
        let dishNumElem = thisDishLine.find('.selected-no'),
            newDishNum = Number(dishNumElem.val()) + 1,
            totalPriceElem = thisDishLine.find('.total-price');
        console.log(Number(Number(dishNumElem.val())));
        dishNumElem.val(newDishNum);
        totalPriceElem.text('$' + newDishNum * Number(dishInfo.price));
    }
    // resizeDishListHeight();
    refreshAll();
};

const addDishLineHandler = function(diskLine) {
    let dishId = diskLine.attr('dish-id'),
        dishName = diskLine.attr('dish-name'),
        dishPrice = Number(diskLine.attr('dish-price'));
    diskLine.find('.minus-btn').on('click', function() {
        emitDelDishEvent({
            username: username,
            dishId: dishId,
            dishName: dishName,
            price: dishPrice
        });
    });
    diskLine.find('.plus-btn').on('click', function() {
        emitAddDishEvent({
            username: username,
            dishId: dishId,
            dishName: dishName,
            price: dishPrice
        });
    });
};

const refreshAll = function () {
    let dishLineArr = dishList.find('.dish-line').toArray();
    let totalNo = 0;
    let totalPrice = 0;
    $.each(dishLineArr, function(i, v) {
        let dishNum = Number($(v).find('.selected-no').val());
        let dishPrice = Number($(v).attr('dish-price'));
        totalNo += dishNum;
        totalPrice += dishNum * dishPrice;
    });
    totalNo = totalNo > 99 ? '99+' : totalNo;
    basketInfo.find('.badge').text(totalNo);
    basketInfo.find('.total-price').text(totalPrice);
};


/***************************************************
 * Generate static HTML block
 ***************************************************/
const genDishLine = function (dishInfo) {
    if (typeof dishInfo.num !== 'number')
        dishInfo.num = 1;
    return '<div class="dish-line" dish-id="' + dishInfo.id + '" dish-name="' + dishInfo.name + '" dish-price="' + dishInfo.price + '">' +
        '<div class="dish-name">' + dishInfo.name + '</div>' +
        '<div class="ope-btns"><span class="minus-btn">-</span>' +
        '<input type="text" readonly class="selected-no" value="' + dishInfo.num + '" />' +
        '<span class="plus-btn">+</span></div>' +
        '<div class="total-price">¥' + (dishInfo.price * dishInfo.num) + '</div></div>';
};