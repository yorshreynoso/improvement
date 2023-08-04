const mongoose = require('mongoose');
const db = require('../database');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// console.log(ObjectId);

const userSchema = new Schema({
    username: { type:String, min: 3 },
    email: { type:String, required: true },
    firstName: { type: String, required: true, min: 1 },
    lastName: { type:String },
    phoneNumber: { type:Number, required: false },
    city: { type:String },
    // birthday:{type: String, match: /^(0?[1-9]|[1-2]\d|3[0-1])\/(0?[1-9]|1[0-2])\/\d{4}$/},
    birthday:{type: String},
    gender: { type:String, enum: ['male', 'female'] },
    password:{ type:String, required: true},
    active: {type: Boolean, enum: [true, false] }
});

const User = mongoose.model('User', userSchema);

module.exports = User;