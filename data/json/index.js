const appetizers = require('./appetizers.json');
const salad = require('./salad');
const entree = require('./entree');
const sides = require('./sides');
const orders = require('./order');

const findFoodById = function (food_id) {
    let data = undefined;
    switch ((food_id / 100) | 0) {
        case 1: // appetizer
            data = appetizers;
            break;
        case 2: // salad
            data = salad;
            break;
        case 3: // entree
            data = entree;
            break;
        case 4: // sides
            data = sides;
            break;
        default:
            return undefined;
    }

    for(let detail of data['list'])
        if(detail["id"] === food_id)
            return detail;

    return undefined;
};


module.exports = {
    recipe: {
        "appetizers": appetizers,
        "salad": salad,
        "entree": entree,
        "sides": sides,
    },
    orders: orders,
    findFoodById
};

