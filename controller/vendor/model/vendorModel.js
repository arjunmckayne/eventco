const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const validator = require("validator");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const vendorSchema = new mongoose.Schema({
    vendorId: {
        type: String,
        required: true,
        default: null,
    },
    name: {
        type: String,
        required: true,
        max: 25,
        trim: true,
        min: 5
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: 'Already email exists',
        validate: value => {
            if (!validator.isEmail(value))
                return 'Invalid Email'
        }
    },
    mobileNo: {
        type: Number,
        require: true,
        trim: true,
        unique: 'Already mobileNo exists',
        validate: {
            validator: Number.isInteger,
            message: ' Not an integer value'
        }
    },
    profileImg: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        trim: true,
    },
    location: {
        city: {
            type: String,
            require: true,
        },
        longitude: {
            type: String,
            default: null
        },
        latitude: {
            type: String,
            default: null
        },
        district: {
            type: String,
            default: null
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
        idProof: {
            type: String,
        },
        licenceDoc: {
            type: String,
        }
    },
    createdDate: {
        type: String,
        default: new Date()
    },
    updatedDate: {
        type: String,
        default: new Date()
    }
});

vendorSchema.pre('save', async function (next) {
    const vendor = this
    if (vendor.isModified('password'))
        vendor.password = await bcrypt.hash(vendor.password, 8)
    next()
});
vendorSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (error, isMatch) {
        if (error)
            return callback(error);
        callback(null, isMatch);
    });
};

vendorSchema.plugin(beautifyUnique);
vendorSchema.plugin(beautifyUnique, {
    defaultMessage: "Unique Style"
});
let Vendor = mongoose.model('vendor', vendorSchema);
module.exports = Vendor;