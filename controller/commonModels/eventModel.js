const mongoose = require('mongoose');
const vendorListSchema = new mongoose.Schema({

    eId: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        max: 25,
        min: 5,
        trim: true
    },
    img: {
        type: String,
        default: null
    },
    createdDate: {
        type: String,
        default: new Date(),
        required: true
    },
    updatedDate: {
        type: String,
        default: new Date(),
        required: true
    },
    status: {
        type: String,
        default: null
    },
    userId: {
        type: String,
        required: true
    },
    location: {
        longitude: {
            type: String,
            required: true,
            default: null

        },
        latitude: {
            type: String,
            required: true,
            default: null
        },
        city: {
            type: String,
            required: true,
            default: null
        }
    },
    share: {
        shareId: {
            type: String,
            required: true,
            trim: true,
            default: 'sh1'
        },
        type: {
            type: String,
        },
        sharedUser: {
            type: String,
        },
    },
    vendorData: {
        vendorId: {
            type: String,
            default: null
        },
        listId: {
            type: String,
            default: null
        },
        vendorName: {
            type: String,
            default: null
        },
        cost: {
            type: Number,
            default: 0
        },
        updatedBy: {
            type: String,
            default: null
        },
        status: {
            statusId: {
                type: String,
                default: null
            },
            img: {
                type: String,
                default: null
            },
            createdTime: {
                type: String,
                default: new Date()
            }
        },
    },
    quoteList: {
        qId: {
            type: String,
            default: null
        },
        vendorId: {
            type: String,
            default: null
        },
        quotedAmount: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            default: null
        },
        createdDate: {
            type: String,
            default: new Date()
        },
        amountbyVendor: {
            type: Number,
            default: 0
        }
    },
    description:{
        type:String, default:null
    }

});



let event = mongoose.model('event', vendorListSchema);
module.exports = event;