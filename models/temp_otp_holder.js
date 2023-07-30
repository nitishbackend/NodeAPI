const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    email: {
        required: true,		
        type: String
    },
    otp: {
        required: true,
        type: String
    },
    otpType: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('TempOtpHolder', dataSchema,'TempOtpHolder')