const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../config')

const User = new Schema({
    // Authentication
    auth: { 
        username: String,
        password: String,
    },
    // Biography
    bio: {
        name: String,
        phone: String,
        address: String,
    },
    // Body Measurements
    body: {
        height: Number,
        weight: Number,
        foot: Number,
        waist: Number,
    },
    // Admin
    admin: { type: Boolean, default: false }
});

User.statics.create = function (username, password, name, phone, address, height, weight, foot, waist) {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')

    const user = new this({
        auth: {
            username,
            password: encrypted
        },
        bio: {
            name,
            phone,
            address,
        },
        body: {
            height,
            weight,
            foot,
            waist,
        },
    })

    // return the Promise
    return user.save()
}

// find one user by using username
User.statics.findOneByUsername = function(username) {
    return this.findOne({
        'auth.username': username
    }).exec()
};


// verify the password of the User documment
User.methods.verify = function (password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')

    return this.auth.password === encrypted
}

User.methods.assignAdmin = function() {
    this.admin = true;
    return this.save()
};

module.exports = mongoose.model('User', User);