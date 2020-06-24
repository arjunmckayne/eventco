const mongoose = require('mongoose');
const vendorListSchema = new mongoose.Schema({
    id:{
        type:String,
        require:true,
        trim:true
    },
    name: {
        type: String,
        require: true,
        max: 25,
        min: 5,
        trim: true
    },
    img: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true,
        trim: true

    },
    price: {
        type: String,
        require: true
    },
    vendorId: {
        type: String,
        require: true
    },
    categoryType: {
        type: String,
        require: true,
        trim: true

    },
    since: {
        type: String,
        require: true,
        trim: true

    },
    about: {
        type: String,
        trim: true,
        require: true
    },
    contact: {
        mobile: {
            type: Number,
            require: true
        },
        location: {
            longitude: {
                type: String,
                require: true,
            },
            latiude: {
                type: String,
                require: true
            },
            city: {
                type: String,
                require: true,
                trim: true
            },
            country: {
                type: String,
                require: true,
                trim: true
            }
        }
    },
    portfolio: {
        location: {
            type: String,
            require: true,
            default: null
        },
        video: {
            path: {
                type: String,
                require: true,
                default: null
            }
        },
        image: {
            path: {
                type: String,
                require: true,
                default: null
            }
        }
    },
    rating: {
        userId: {
            type: String,
            default: null
        },
        message: {
            type: String,
            default: null,
            trim: true
        },
        score: {
            type: Number,
            default: null
        },
        createdDate: {
            type: String,
            default: new Date()
        }
    },
    amenities: {
        type: String,
        require: true
    },
    promotions: {
        isPromotion: {
            type: Boolean
        },
        promotionId: {
            type: String,
            trim: true
        }
    },
    documents: {
        path: {
            type: String,
            require: true
        },
        createdDate: {
            type: String,
            require: true,
            default: new Date()
        }
    },
    message: {
        userId: {
            type: String,
            default: null
        },
        message:{
            type:String,
            default:null
        },
        createdDate:{
            type:String, default:new Date()
        }
    },
    review:{
        noOfReview:{
            type:Number,default:0
        },
        Avgrating:{
            type:Number,default:0
        }
    }

});



let VendorList = mongoose.model('vendorList', vendorListSchema);
module.exports = VendorList;