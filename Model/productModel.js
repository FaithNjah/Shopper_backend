// models/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true 
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String
});

module.exports = mongoose.model('Product', productSchema);
