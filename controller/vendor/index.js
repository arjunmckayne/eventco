const express = require('express');
const vendor = new express.Router();
const validator = require("email-validator");
const VendorModel = require('./model/vendorModel')

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
                            userId: vendor.userId,
                            mobileNo: vendor.mobileNo,
                            name: vendor.name,
                            imgPath: vendor.profileImg ? vendor.profileImg : '',
                            verified: vendor.isverified
                        };
                        responseSend(res, 200, vendorData);
                        lastActivityUpdate(vendorData.userId);
                    } else
                        responseSend(res, 402, {
                            status: 402,
                            message: "Wrong Password"
                        });
                });
        });
})






/*** common response***/
function responseSend(res, statusCode, message) {
    res.status(statusCode)
        .send(message);
}
module.exports = vendor;