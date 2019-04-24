$('.basket-dishes').on('click', function () {
    if ($(".dish-list").is(":visible")) {
        $(".dish-list").hide();
    } else {
        $(".dish-list").show();
    }
});

/***************************************************
 * Global variables
 ***************************************************/
const username = $('#username').text();
const tableID = $('.sidebar-header').attr('id');
const socket = io('/menuItem?tableID=' + tableID + '&username=' + username);
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
const emitDelDishEvent = function (dishInfo) {
    socket.emit('del-dish', dishInfo);
};

const emitSubmitEvent = function (tableInfo) {
    socket.emit('submit-order', tableInfo);
};


/***************************************************
 * Listen response from server
 ***************************************************/
(function (window, document, $) {
    const addDishBtn = $('.add-dish-btn');
    const submitBtn = $('#submit-meal-btn');

    console.log('starting...');

    addDishBtn.on('click', function () {
        emitAddDishEvent({
            username: username,
            _id: $(this).parent().attr('id')
        });
    });

    submitBtn.on('click', () => {
        emitSubmitEvent(username);
    });

    // Listen Add One Dish event from customer
    socket.on('add-dish', function (dishInfo) {
        console.log("Add one dish...");
        dishInfo.num = 1;
        addDishHandler(dishInfo);
        showMessage(dishInfo.msg);
    });

    socket.on('del-dish', function (dishInfo) {
        console.log('Delete one dish...');
        delDishHandler(dishInfo);
        showMessage(dishInfo.msg);
    });

    socket.on('join-table', function (msg) {
        console.log('Some joins table');
        showMessage(msg);
    });

    socket.on('reload-dishes', function (dishList) {
        console.log("Add old dishes...");
        for (let dishInfo of dishList) {
            addDishHandler(dishInfo);
        }
    });

    socket.on('submit-order', function (tableInfo) {
        console.log('Submit order...');
        delAllDishHandler();
        showMessage(tableInfo.msg);
    });

}(window, document, $));


/***************************************************
 * Handler for menu list
 ***************************************************/
const addDishHandler = function (dishInfo) {
    let thisDishLine = dishList.find('.dish-line[dish-id=' + dishInfo._id + ']');
    if (thisDishLine.length === 0) {
        let oneLine = dishList.append(genDishLine(dishInfo)).find('.dish-line[dish-id=' + dishInfo._id + ']');
        addLineHandler(oneLine);
    } else {
        let dishNumElem = thisDishLine.find('.selected-no'),
            newDishNum = Number(dishNumElem.val()) + 1,
            totalPriceElem = thisDishLine.find('.total-price');
        dishNumElem.val(newDishNum);
        totalPriceElem.text('$' + newDishNum * Number(dishInfo.price));
    }
    refreshAll();
};

const delDishHandler = function (dishInfo) {
    let thisDishLine = dishList.find('.dish-line[dish-id=' + dishInfo._id + ']');
    if (thisDishLine.length > 0) {
        let dishNumElem = thisDishLine.find('.selected-no'),
            totalPriceElem = thisDishLine.find('.total-price'),
            newDishNum = Number(dishNumElem.val()) - 1;
        if (newDishNum > 0) {
            dishNumElem.val(newDishNum);
            totalPriceElem.text('$' + newDishNum * dishInfo.price);
        } else {
            thisDishLine.remove();
        }
        refreshAll();
    }
};

const delAllDishHandler = function () {
    dishList.find('.dish-line').remove();
};

const addLineHandler = function (dishLine) {
    dishLine.find('.minus-btn').on('click', function () {
        emitDelDishEvent({
            username: username,
            _id: dishLine.attr('dish-id')
        });
    });
    dishLine.find('.plus-btn').on('click', function () {
        emitAddDishEvent({
            username: username,
            _id: dishLine.attr('dish-id')
        });
    });
};


/***************************************************
 * Other functions
 ***************************************************/
const refreshAll = function () {
    let dishLineArr = dishList.find('.dish-line').toArray();
    let totalNo = 0;
    let totalPrice = 0;
    $.each(dishLineArr, function (i, v) {
        let dishNum = Number($(v).find('.selected-no').val());
        let dishPrice = Number($(v).attr('dish-price'));
        totalNo += dishNum;
        totalPrice += dishNum * dishPrice;
    });
    totalNo = totalNo > 99 ? '99+' : totalNo;
    basketInfo.find('.badge').text(totalNo);
    basketInfo.find('.total-price').text(totalPrice);
};

const genDishLine = function (dishInfo) {
    if (typeof dishInfo.num !== 'number')
        dishInfo.num = 1;
    return '<div class="dish-line" dish-id="' + dishInfo._id + '" dish-name="' + dishInfo.food_name + '" dish-price="' + dishInfo.price + '">' +
        '<div class="dish-name">' + dishInfo.food_name + '</div>' +
        '<div class="ope-btns"><span class="minus-btn">-</span>' +
        '<input type="text" readonly class="selected-no" value="' + dishInfo.num + '" />' +
        '<span class="plus-btn">+</span></div>' +
        '<div class="total-price">$' + (dishInfo.price * dishInfo.num) + '</div></div>';
};

const showMessage = (msg) => {
    let msgContainer = $('.dis-message-container');
    const msgElem = '<li class="dis-message ' + msg.className + '">'
        + '<span class="dis-message-status ' + msg.iconClassName + '"></span>'
        + '<div class="essage-text">' + msg.info + '</div>'
        + '</li>';

    if (msgContainer.length === 0) {
        $('#content').append(
            '<ul class="dis-message-container">' + msgElem + '</ul>'
        );
        msgContainer = $('.dis-message-container');
    } else {
        msgContainer.append(msgElem);
    }

    const thisMessageEle = msgContainer.children().last();
    setTimeout(() => {
        thisMessageEle.animate({
            opacity: 0
        }, 500, 'swing', function () {
            thisMessageEle.remove();
        });
    }, 5000);
};