'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new mongoose.Schema({
    title: String,
    author: String,
    description: String,
    category: String,
    image: String,
    price: Number,
    stock: Number,
    status: String,   
    created_at: {type: Date, default: Date.now}
});

mongoose.model('Product', productSchema);