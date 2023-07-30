const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    email: {
        required: true,		
        type: String
    },
    password: {
        required: true,
        type: String
    },
    languageCode: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('LoginData', dataSchema,'LoginData')