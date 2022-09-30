const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
     userId: {
        required: true,		
        type: String
    },
    email: {
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
        type: String,
        default: ""
    }
})

module.exports = mongoose.model('ProfileData', dataSchema,'ProfileData')