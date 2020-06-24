const mongoose = require('mongoose');
const validator = require("validator");
const vendorSchema = new mongoose.Schema({
    vendorId:{
        type: String,
        require: true,
        default: 'v1',
    },
    name: {
        type: String,
        require: true,
        max: 25,
        min: 5
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
        unique: 'Already email exists',
        validate: value => {
            if (!validator.isEmail(value))
                return 'Invalid Email'
        }
    },
    mobile: {
        type: Number,
        require: true,
        unique: 'Already mobileNo exists',
        validate: {
            validator: Number.isInteger,
            message: ' Not an integer value'
        }
    },
    profileImg: {
        type: String,
        require: true,
    },
    isVerified: {
        type: Boolean,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    location: {
        city: {
            type: String,
            require: true,
        },
        district: {
            type: String,
            require: true,
        }
    },
    messages: {
        messageId: {
            type: Number,
            require: true,
            default: 0
        },
        status: {
            type: String,
            require: true,
        }
    },
    quote: {
        quoteId: {
            type: Number,
            require: true,
            default: 0
        },
        status: {
            type: String,
            require: true,
        }
    },
    document: {
        IdProof: {
            type: String,
            require: true,
        },
        licenceDoc: {
            type: String,
            require: true
        }
    }
});
let Vendor = mongoose.model('vendor', vendorSchema);
module.exports = Vendor;