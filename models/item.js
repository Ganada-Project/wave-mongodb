const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');
const ObjectId = require('mongoose').Types.ObjectId;

const Item = new Schema({
    name: String,
    brand: String,
    coin: Number,
    star: Number,
    situation: String,
    category: String,
    material: String,
    color: String,
    sex: String,
    size:{
        upperBody:{
            shoulder: Number,
            chest: Number,
            waist: Number,
            arm: Number,
            length: Number
        },
        lowerBody:{
            hip: Number,
            crotch: Number,
            thigh: Number,
            length: Number
        }

    },
    manufacture:{
        date: String,
        country: String,
        provider: String,
    },
    afterService:{
        name: String,
        phone: String,
    },
    images: [String],
    owner:{
        name: String,
        phone: String
    },
    available: Boolean,
    reservation: Number,
    premium: Boolean,
    reservationPeriod: Number,

});

Item.statics.create = function ({name,
                                brand,
                                coin,
                                star,
                                situation,
                                category,
                                material,
                                color,
                                sex,
                                size,
                                manufacture,
                                afterService,
                                image,
                                owner,
                                available,
                                reservation,
                                premium,
                                reservationPeriod,}
                                ) {
    const item = new this({
        name,
        brand,
        coin,
        star,
        situation,
        category,
        material,
        color,
        sex,
        size,
        manufacture,
        afterService,
        image,
        owner,
        available,
        reservation,
        premium,
        reservationPeriod,
    });

    // return the Promise
    return item.save()
};

Item.statics.get = async function(start,size){
  const items = await this.find().sort();
  console.log(items.length);
  const itemsToReturn = items.slice(start,start+size);
  console.log(itemsToReturn.length);
  return itemsToReturn;
};

Item.statics.truncate = function (){
    return this.deleteMany({}).exec()
}

Item.statics.findOneById = function (item_id) {
    return this.findOne({ 
        _id: ObjectId(item_id) 
    }).exec()
};


module.exports = mongoose.model('Item', Item);