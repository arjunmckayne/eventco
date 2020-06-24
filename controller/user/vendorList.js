const express = require('express');
const vendorList = new express.Router();
const vendorModel = require('./../commonModels/vendorList');


vendorList.get('/home', async (req, res) => {
    vendorModel.find({
        "promotions.isPromotion": true
    }, (err, data) => {
        if (err)
            responseSend(res, 500, {
                status: 500,
                message: "Oops Something went wrong!"
            });
        else {
            if (data.length <= 0)
                responseSend(
                    res, 404, {
                        status: 404,
                        message: "No Data Avaiable"
                    }
                )
            else {
                let dataArray = [];
                data.forEach((dum) => {
                    let temp = {
                        vendorId: dum.vendorId,
                        vendorName: dum.name,
                        vendorImg: dum.img
                    };
                    console.log(temp)
                    dataArray.push(temp)
                });
                responseSend(
                    res, 200, {
                        vendorData: dataArray
                    }
                )
            }
        }


    })
})
vendorList.get('/', async (req, res) => {

    vendorModel.find({}, (err, data) => {
        err ? responseSend(res, 404, {
                status: 404,
                message: "No Data Found!"
            }) :
            responseSend(res, 200, {
                status: 200,
                message: data
            })
    })
})





/*** common response***/
function responseSend(res, statusCode, message) {
    res.status(statusCode)
        .send(message);
}
module.exports = vendorList;