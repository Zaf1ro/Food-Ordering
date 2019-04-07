/***************************************************
 * Global variables
 ***************************************************/
const username = $('#username').text();
const tableID = $('#tableID').text();
const socket = io('/order?tableID=' + tableID);
const dishList = $('#dish-list');


/***************************************************
 * Send request to server
 ***************************************************/
// Send new dish request to server
const emitAddDishEvent = function (dishInfo) {
    socket.emit('add-dish', dishInfo);
};


/***************************************************
 * Listen response from server
 ***************************************************/
(function (window, document, $) {
    let addDishBtn = $('.add-dish-btn');
    console.log('starting...');

    addDishBtn.on('click', function () {
        let food_id = $(this).parent().attr('id');
        console.log(food_id);
        emitAddDishEvent({
            username: username,
            food_id: food_id,
        });
    });

    // Listen Add Dish event from customer
    socket.on('add-dish', function (dishInfo) {
        addDishHandler(dishInfo);
    });

}(window, document, $));


/***************************************************
 * Handler for menu list
 ***************************************************/
const addDishHandler = function (dishInfo) {
    let thisDishLine = dishList.find('.dish-line[dish-id=' + dishInfo.food + ']');
    if (thisDishLine.length === 0) {
        dishInfo.num = 1;
        console.log(dishInfo);
        dishList.append(genDishLine(dishInfo));
        // thisDishLine = dishList.append(genDishLine(dishInfo)).find('.dish-line[dish-id=' + dishInfo.dishId + ']');
        // initMPEvent(thisDishLine);
        // resizeDishListHeight();
    }
    // else {
    //     let selectedNoEle = thisDishLine.find('.selected-no'),
    //         selectedNo = Math.floor(Number(selectedNoEle.val())) + 1;
    //     let thisTotalPriceEle = thisDishLine.find('.total-price');
    //     selectedNoEle.val(selectedNo);
    //     thisTotalPriceEle.text('¥' + selectedNo * Number(dishInfo.price));
    // }
    // refreshTotalDishesInfo();
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