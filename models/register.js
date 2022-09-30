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
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    mobileNo: {
        required: true,
        type: String
    },
    registrationDate: {
        required: true,
        type: String
    },
    userType: {
        required: true,
        type: String
    },
    languageCode: {
        required: true,
        type: String
    },
    profilePicture: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('RegisterUserData', dataSchema,'RegisterUserData')