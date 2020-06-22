const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const validator = require("validator");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const userSchema = new mongoose.Schema({
    name: {
        type: String, require: true, max: 25, min: 5
    }
    , userId: {
        type: Number, require: true, default: 1
    }
    , password: {
        type: String, require: true
    }
    , createdDate: {
        type: Date, require: true, default: new Date()
    }
    , lastActiveDate: {
        type: Date, require: true, default: new Date()
    }
    , updatedDate: {
        type: Date, require: true, default: new Date()
    }
    , mobileNo: {
        type: Number, require: true,
        unique: 'Already mobileNo exists', validate: {
            validator: Number.isInteger,
            message: ' Not an integer value'
        }
    }
    , email: {
        type: String, require: true, lowercase: true, unique: 'Already email exists', validate: value => {
            if (!validator.isEmail(value))
                return 'Invalid Email'
        }
    },
    imgPath: {
        file_name: {
            type: String, require: true,
        },
        size: {
            type: String, require: true,
        },
        type: {
            type: String, require: true,
        },
        path: {
            type: String, require: true,
        },
        createdDate: {
            type: String, require: true, default: new Date()
        }
    },
    location: {
        latittude: {
            type: String,
            require: true,
            default: null
        },
        longitude: {
            type: String,
            require: true,
            default: null
        },
    },
});

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)
    next()
})
userSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (error, isMatch) {
        if (error)
            return callback(error);
        callback(null, isMatch);
    });
};
userSchema.statics.findByCredentials = async (mobileNo, password) => {
    const user = await userSchema.findOne({ mobileNo: mobileNo, password: password })
        .then(
            ({ data }) => data
        )
        .catch(({ err }) => console.log("error", err));
};



userSchema.plugin(beautifyUnique);
userSchema.plugin(beautifyUnique, {
    defaultMessage: "Unique Style"
});
let User = mongoose.model('user', userSchema);
module.exports = User;
