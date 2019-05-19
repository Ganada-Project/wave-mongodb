const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../config')
const ObjectId = require('mongoose').Types.ObjectId;

const User = new Schema({
    // Authentication
    auth: {
        username: String,
        password: String,
        fcm_token: String
    },
    shopping: {
        hanger: Number,
        items: [Object]
    },
    // Biography
    bio: {
        name: String,
        phone: String,
        address: String,
        age: Number,
        gender: Number, // 0->male 1->female
        profile_img_url: String
    },
    // Body Measurements
    body: {
        height: Number,
        weight: Number,
        foot: Number,
        waist: Number,
        image_url: String,
        body_points: [Object]
    },
    // Admin
    admin: {
        type: Boolean,
        default: false
    }
});

User.statics.create = function (username, password, fcm_token, name, phone, address, age, gender, profile_img_url, height, weight, foot, waist, image_url, body_points) {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')

    const user = new this({
        auth: {
            username,
            password: encrypted,
            fcm_token
        },
        shopping: {
            hanger: 0,
            items: []
        },
        bio: {
            name,
            phone,
            address,
            age,
            gender,
            profile_img_url
        },
        body: {
            height,
            weight,
            foot,
            waist,
            image_url,
            body_points
        },
    })

    // return the Promise
    return user.save()
}

// find one user by using username
User.statics.findOneByUsername = function (username) {
    return this.findOne({
        'auth.username': username
    }).exec()
};

// phone number format should be 010xxxxxxxx
User.statics.findOneByPhone = function(phone) {
    return this.findOne({
        'bio.phone': phone
    }).exec()
};

// verify the password of the User documment
User.methods.verify = function (password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')

    return this.auth.password === encrypted
}

User.methods.assignAdmin = function () {
    this.admin = true;
    return this.save()
};

module.exports = mongoose.model('User', User);