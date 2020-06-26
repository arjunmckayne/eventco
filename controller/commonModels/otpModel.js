const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const validator = require("validator");
const otpSchema = new mongoose.Schema({
    mobileNo: {
        type: Number, required: true
    },
    otp:{
        type: Number, required: true
    },
    type: {
        type:String,required:true
    }
})
otpSchema.pre('save', async function (next) {
    const user = this
    next()
});
otpSchema.statics.findByCredentials = async (mobileNo, otp) => {
    const user = await userSchema.findOne({ mobileNo: mobileNo, otp: otp })
        .then(
            ({ data }) => data
        )
        .catch(({ err }) => console.log("error", err));
};

let Otp = mongoose.model('otp', otpSchema);
module.exports = Otp;
