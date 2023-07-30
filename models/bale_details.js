const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userId: {
        required: true,		
        type: String
    },
    batchId: {
        required: true,
        type: String
    },
    baleId: {
        required: true,
        type: String,
        default: function(){
            return this.get('_id');
        }
    },
    weight: {
        required: true,
        type: String
    },
    baleCreationDate: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('BaleDetails', dataSchema,'BaleDetails')