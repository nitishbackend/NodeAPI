const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
     productCategoryId: {
        required: true,		
        type: String
    },
    ProductCategory: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('ProductCategory', dataSchema,'ProductCategory')