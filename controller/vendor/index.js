const express = require('express');
const vendor = new express.Router();
const validator = require("email-validator");
const VendorModel = require('./model/vendorModel');
const Otp = require('../commonModels/otpModel');


const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/img/vendor/vendorProfile')
    },
    filename: (req, file, callBack) => {
        console.log(req.body)
        callBack(null, `VendorProfile${file.originalname}`)
    }
})

const upload = multer({
    storage: storage
})

vendor.use('/vendorList', require('./vendorList'))


vendor.post('/login', async (req, res) => {
    if (req.body.mobileNo === '' || req.body.mobileNo == null || req.body.password === null || req.body.password == '')
        responseSend(res, 500, {
            status: 500,
            message: "Oops Something went wrong!"
        });
    else
        VendorModel.findOne({
            mobileNo: req.body.mobileNo
        }, function (err, vendor) {
            if (err)
                responseSend(res, 500, "Oops Something went wrong!")
            else
                (!vendor) ?
                responseSend(res, 400, {
                    status: 400,
                    message: "No vendor Found"
                }) :
                vendor.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        let vendorData = {
                            status: 200,
                            message: 'success',
                            userId: vendor.vendorId,
                            mobileNo: vendor.mobileNo,
                            name: vendor.name,
                            imgPath: vendor.profileImg ? vendor.profileImg : '',
                            verified: vendor.isverified
                        };
                        responseSend(res, 200, vendorData);
                    } else
                        responseSend(res, 402, {
                            status: 402,
                            message: "Wrong Password"
                        });
                });
        });
});
vendor.post('/register', async (req, res) => {
    try {
        if (!req.body.name || req.body.name === '' || req.body.name === undefined ||
            !req.body.password || req.body.password === '' || req.body.password === undefined ||
            !req.body.email || req.body.email === '' || req.body.email === undefined || !req.body.mobileNo ||
            req.body.mobileNo === undefined || req.body.mobileNo === '')
            throw {
                code: 500,
                msg: "Oops Something went wrong"
            }
        let email = await getVendorDetails('email', req.body.email);
        let mobileNo = await getVendorDetails('password', req.body.mobileNo);
        if (email) {
            responseSend(res, 409, {
                status: 409,
                message: 'This Email already exist!'
            });
            return
        } else if (!validator.validate(req.body.email)) {
            responseSend(res, 422, {
                status: 422,
                message: 'Invalid Email Entry'
            })
            return
        }
        if (mobileNo) {
            responseSend(res, 405, {
                status: 405,
                message: 'This Mobile Number Already Exist!'
            });
            return
        }
        let vendor = new VendorModel({
            vendorId: await getVendorId(),
            name: req.body.name,
            password: req.body.password,
            mobileNo: req.body.mobileNo,
            email: req.body.email,
            createdDate: new Date(),
        });
        vendor.save(async (err, vendorData) => {
            if (err, !vendorData) {
                let errMsg = '';
                console.log(err.errors)
                throw {
                    code: 402,
                    msg: err.errors
                }
            }
            let vendorDetails = {
                message: 'success',
                status: 200,
                userId: vendorData.vendorId,
                mobileNo: vendorData.mobileNo,
                name: vendorData.name,
                profileImg: vendorData.profileImg ? vendorData.profileImg : '',
            };
            responseSend(res, 200, vendorDetails)
        })
    } catch (err) {
        responseSend(
            res, err.code, {
                status: err.code,
                message: err.msg
            });
    }
});
vendor.post('/otpRegister', async (req, res) => {
    try {
        let email = await getVendorDetails('email', req.body.email);
        let mobileNo = await getVendorDetails("mobileNo", req.body.mobileNo);
        if (email) {
            responseSend(res, 409, {
                status: 409,
                message: 'This Email already exist!'
            });
            return
        } else if (!validator.validate(req.body.email)) {
            responseSend(res, 422, {
                status: 422,
                message: 'Invalid Email Entry'
            })
            return
        }
        if (mobileNo) {
            responseSend(res, 405, {
                status: 405,
                message: 'This Mobile Number Already Exist!'
            });
            return
        }
        getRandomOtp(res, req.body.mobileNo)
    } catch (err) {
        responseSend(
            res, err.code ? err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : "Oops Something went wrong"
            });
    }
});

vendor.post('/otpResend', async (req, res) => {
    try {
        if (!req.body || !req.body.mobileNo || req.body.mobileNo === undefined || req.body.mobileNo === '')
            throw {
                code: 402,
                msg: "Null Check"
            }

        getRandomOtp(res, req.body.mobileNo);
    } catch (err) {
        responseSend(
            res, err.code ? err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : "Oops Something went wrong"
            });
    }
});
vendor.post('/otpForgot', async (req, res) => {
    try {
        let mobileNo = await getVendorDetails("mobileNo", req.body.mobileNo);
        if (!mobileNo)
            throw {
                code: 409,
                msg: "Mobile Number not Exists"
            }
        getRandomOtp(res, req.body.mobileNo);
    } catch (err) {
        responseSend(
            res, err.code ? err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : "Oops Something went wrong"
            });
    }
})
vendor.post('/verifyOtp', async (req, res) => {
    try {
        if (!req.body || !req.body.mobileNo || req.body.mobileNo === '')
            throw {
                code: 500,
                msg: "Oops Something went wrong"
            }
        Otp.findOne({
                mobileNo: req.body.mobileNo,
                type: 'vendor',
                otp: req.body.otp
            },
            async (err, data) => {
                if (err)
                    throw {
                        code: 500,
                        msg: "Oops  Something went wrong"
                    }
                if (!data)
                    throw {
                        code: 422,
                        msg: "OTP Not Valid"
                    }
                responseSend(res, 200, {
                    status: 200,
                    message: "OTP verified Successfully"
                });
                Otp.deleteOne({
                    mobileNo: req.body.mobileNo
                }, (err, user) => {
                    if (err)
                        throw {
                            code: 500,
                            msg: "Oops  Something went wrong"
                        }
                    else if (data)
                        console.log(data._id, "User Deleted")
                });
            })
    } catch (err) {
        responseSend(
            res, err.code ? err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : "Oops Something went wrong"
            });
    }
});

vendor.put('/updateImg', upload.single('profileImg'), async (req, res) => {
    try {
        if (!req.file)
            throw {
                code: 400,
                msg: "Please Upload Profile Picture"
            }
        if (!req.body || !req.body.vendorId || !req.file.path)
            throw {
                code: 400,
                msg: "Please Upload the data"
            }
        VendorModel.updateOne({
            vendorId: req.body.vendorId
        }, {
            $set: {
                "profileImg": req.file.path,
                updatedDate: new Date()
            }
        }, (err, succ) => {
            err || !succ || succ === undefined ?
                responseSend(res, 304, {
                    status: "Not Updated for the Vendor " + req.body.vendorId
                }) :
                responseSend(res, 200,
                    "Updated Profile Image Successfully for the VendorId " + req.body.vendorId,
                );
        })
    } catch (err) {
        responseSend(
            res, err.code ? err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : "Oops Something went wrong"
            });
    }

});
vendor.put('/updateDoc', upload.single('document'), async (req, res) => {
    try {
        if (!req.file)
            throw {
                code: 400,
                msg: "Please Upload Document"
            }
        if (!req.body || !req.body.vendorId || req.body.vendorId === '' || !req.file.path)
            throw {
                code: 400,
                msg: "Please Upload the data"
            };
        VendorModel.updateOne({
            vendorId: req.body.vendorId
        }, {
            $set: {
                "document.idProof": req.file.path,
                updatedDate: new Date()
            }
        }, (err, succ) => {
            err || !succ || succ === undefined ?
                responseSend(res, 304, {
                    status: "Not Updated for the Vendor " + req.body.vendorId
                }) :
                responseSend(res, 200,
                    "Updated Document Successfully for the VendorId " + req.body.vendorId,
                );
        })
    } catch (err) {
        responseSend(
            res, err.code ? err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : "Oops Something went wrong"
            });
    }
});
vendor.put('/updateLic', upload.single('document'), async (req, res) => {
    try {
        if (!req.file)
            throw {
                code: 400,
                msg: "Please Upload Document"
            }
        if (!req.body || !req.body.vendorId || req.body.vendorId === '' || !req.file.path)
            throw {
                code: 400,
                msg: "Please Upload the data"
            };
        VendorModel.updateOne({
            vendorId: req.body.vendorId
        }, {
            $set: {
                "document.idProof": req.file.path,
                updatedDate: new Date()
            }
        }, (err, succ) => {
            err || !succ || succ === undefined ?
                responseSend(res, 304, {
                    status: "Not Updated for the Vendor " + req.body.vendorId
                }) :
                responseSend(res, 200,
                    "Updated Document Successfully for the VendorId " + req.body.vendorId,
                );
        })
    } catch (err) {
        responseSend(
            res, err.code ? err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : "Oops Something went wrong"
            });
    }
});
vendor.put('/updateLoc', async (req, res) => {
    try {

        if (!req.body || !req.body.vendorId || req.body.vendorId === '' ||
            !req.body.latitude || req.body.latitude === '' || !req.body.longitude || req.body.longitude === '')
            throw {
                code: 400,
                msg: "Please Upload the location details"
            };
        VendorModel.updateMany({
            vendorId: req.body.vendorId
        }, {
            $set: {
                "location.longitude": req.body.longitude ? req.body.longitude : null,
                "location.latitude": req.body.latitude ? req.body.latitude : null,
                "location.city": req.body.city ? req.body.city : null,
                updatedDate: new Date()
            }
        }, (err, succ) => {
            err || !succ || succ === undefined ?
                responseSend(res, 304, {
                    status: "Not Updated for the Vendor " + req.body.vendorId
                }) :
                responseSend(res, 200,
                    "Updated Document Successfully for the VendorId " + req.body.vendorId,
                );
        })
    } catch (err) {
        responseSend(
            res, err.code ? err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : "Oops Something went wrong"
            });
    }
});





/*** Getting VendorId***/
getRandomOtp = async (res, mobileNo) => {
    try {
        let OtpDetails = await Otp.findOne({
            mobileNo: mobileNo,
            type: 'vendor'
        });
        if (OtpDetails)
            Otp.deleteOne({
                mobileNo: mobileNo
            }, (err, user) => {
                if (err || !user)
                    throw {
                        code: 402,
                        msg: err.msg
                    }
                else
                    console.log(mobileNo, "User Deleted")
            });
        let userOtp = new Otp({
            mobileNo: mobileNo,
            otp: await generateOTP(),
            type: 'vendor'
        });
        userOtp.save(function (error, user) {
            if (user) {
                responseSend(res, 200, {
                    status: 200,
                    message: user.otp
                })
                console.log(userOtp.otp)
            }
            if (!user || error)
                throw {
                    code: 500,
                    msg: error.message
                }
        });
    } catch (err) {

        responseSend(
            res, err.code ? err.code : 500, {
                status: err.code ? err.code : 500,
                message: err.msg ? err.msg : "Oops Something went wrong"
            });
    }
}
getVendorId = async () => {
    const val = await VendorModel.findOne({}).sort({
        createdDate: -1
    });
    if (val)
        return val.vendorId != null || val.vendorId != NaN ?
            "v" + (parseInt(val.vendorId.split("v")[1]) + 1) :
            "v1"
    else {
        console.log("Got called")
        return "v1";
    }
}
/*** Dynamic User Collection check***/
getVendorDetails = async (para, val) => {
    const data = (para === 'email') ? await VendorModel.findOne({
        email: val
    }) : await VendorModel.findOne({
        mobileNo: val
    });
    return (data) ? true : false
}
/*** common response***/
function responseSend(res, statusCode, message) {
    res.status(statusCode)
        .send(message);
}
module.exports = vendor;