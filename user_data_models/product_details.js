const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    productCategoryId:{
        required:true,
        type: String
    },
    productName:{
        required:true,
        type: String
    },
    productShortDescription:{
        required:true,
        type: String
    },
    productLongDescription:{
        required:true,
        type: String
    },

    productPrice:{
        required:true,
        type: String
    },
})

module.exports = mongoose.model('ProductDetails', dataSchema, 'ProductDetails')