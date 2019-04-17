const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');

const Item = new Schema({
    name: String,
    price: Number,
    color: String,
    onSale: Boolean,
    sex: Boolean,
    category: {
        category1: String,
        category2: String,
        category3: String,
    },
    // Authentication
    brand: {
        name: String,
    },
});

Item.statics.create = function (name, price, color, onSale, sex, category1, category2, category3, brand) {
    const item = new this({
        name,
        price,
        color,
        onSale,
        sex,
        category: {
            category1,
            category2,
            category3,
        },
        brand: {
            name:brand
        },
    });

    // return the Promise
    return item.save()
};
module.exports = mongoose.model('Item', Item);