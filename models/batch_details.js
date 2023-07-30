const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userId: {
        required: true,		
        type: String
    },
    batchId: {
        required: true,
        type: String,
        default: function(){
            return this.get('_id');
        }
    },
    farmerLocation: {
        required: true,
        type: String
    },
    farmerName: {
        required: true,
        type: String
    },
    harvestdateNtime: {
        required: true,
        type: String
    },
    dryMatter: {
        required: true,
        type: String
    },
    crudeProtein: {
        required: true,
        type: String
    },
    crudeFiber: {
        required: true,
        type: String
    },
    adf: {
        required: true,
        type: String
    },
    ndf: {
        required: true,
        type: String
    },
    batchCreationDateNtime: {
        required: true,
        type: String
    }
   
})

module.exports = mongoose.model('BatchDetails', dataSchema,'BatchDetails')