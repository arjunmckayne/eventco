const mongoose = require('mongoose');
const eventListSchema = new mongoose.Schema({
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
    video: {
        path: {
            type: String,
            default: null
        },
        isFeatured: {
            type: Boolean,
            default: false
        }
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
    createdBy: {
        type: String,
        required: true
    },
    location: {
        longitude: {
            type: String,
            default: null

        },
        latitude: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        }
    },
    share: {
        shareId: {
            type: String,
            trim: true,
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
        },
        listId: {
            type: String,
        },
        vendorName: {
            type: String,
        },
        cost: {
            type: Number,
            default: null
        },
        updatedBy: {
            type: String,
        },
        status: {
            statusId: {
                type: String,
            },
            img: {
                type: String,
            },
            createdTime: {
                type: String,

            }
        },
    },
    quoteList: {
        qId: {
            type: String,
        },
        vendorId: {
            type: String,
        },
        quotedAmount: {
            type: Number,
        },
        status: {
            type: String,
        },
        createdDate: {
            type: String,
        },
        amountbyVendor: {
            type: Number,
        }
    },
    description: {
        type: {
            type: String,

        },
        subCat: {
            type: String,
        },
        amount: {
            type: Number,
        },
        eventDate: {
            type: String,
            default: null
        },
        eventTime: {
            type: String,
            default: null,
        },
        endDate: {
            type: String,
            default: null
        },
        endTime: {
            type: String,
            default: null
        }
    },
    boosted: {
        type: Boolean,
        default: false
    }


});



let event = mongoose.model('event', eventListSchema);
module.exports = event;