const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        max: 25,
        min: 5
    },
    username: {
        type: String,
        require: true,
        max: 25,
        min: 5
    },
    password: {
        type: String,
        require: true
    },
    createdDate: {
        type: Date,
        require: true,
        default: new Date()
    },
    updatedDate: {
        type: Date,
        require: true,
        default: new Date()
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
    },
    imgPath: {
        file_name: {
            type: String,
            require: true,
        },
        size: {
            type: String,
            require: true,
        },
        type: {
            type: String,
            require: true,
        },
        path: {
            type: String,
            require: true,
        },
        createdDate: {
            type: String,
            require: true,
            default: new Date()
        }
    },
    lastActivity: {
        type: String,
        require: true,
        default: new Date()
    }
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
    const user = await userSchema.findOne({
            mobileNo: mobileNo,
            password: password
        })
        .then(({
            data
        }) => data)
        .catch(({
            err
        }) => console.log("error", err));
};

let User = mongoose.model('user', userSchema);
module.exports = User;