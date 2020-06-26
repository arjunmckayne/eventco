const express = require('express');
const vendorList = new express.Router();
const vendorListModel = require('./../commonModels/vendorList');
const userModel = require('./model/userModel');

vendorList.get('/home', async (req, res) => {
    try {
        vendorListModel.find({
            "promotions.isPromotion": true
        }, (err, data) => {
            if (err)
                throw err
            else {
                if (data.length <= 0)
                    responseSend(
                        res, 404, {
                            status: 404,
                            message: "No Vendors found in this location"
                        }
                    )
                else {
                    let dataArray = [];
                    data.forEach((dum) => {
                        let temp = {
                            listId: dum.listId,
                            listName: dum.name,
                            listImg: dum.img
                        };
                        console.log(temp)
                        dataArray.push(temp)
                    });
                    responseSend(
                        res, 200, {
                            listData: dataArray
                        })
                }
            }
        });
    } catch (err) {
        responseSend(res, 500, {
            status: 500,
            message: err.message
        });
    }
});

vendorList.post('/search', async (req, res) => {
    try {
        if (req.body.userId === null || req.body.userId === "" || req.body.userId === undefined || req.body.categoryType === null || req.body.categoryType === undefined || req.body.categoryType === '')
            throw error
        userModel.findOne({
            userId: req.body.userId
        }, async (err, outerData) => {
            if (err)
                throw err;
            if (outerData) {
                (outerData.location.city) ?
                vendorListModel.find({
                        "contact.location.city": outerData.location.city,
                        categoryType: req.body.categoryType
                    }, async (outerErr, innerdata) => {
                        if (outerErr)
                            throw outerErr
                        if (innerdata.length <= 0)
                            responseSend(res, 404, {
                                status: 404,
                                message: "No Vendors found in this location"
                            })
                        else if (innerdata) {
                            let valArray = [];
                            innerdata.forEach((val) => {
                                let dum = {
                                    listId: val.listId,
                                    name: val.name,
                                    city: (val.contact.location.city) ? val.contact.location.city : '',
                                    price: val.price ? val.price : '',
                                    avgRating: (val.avgRating) ? val.avgRating : '',
                                    reviewCount: (val.noOfReview) ? val.noOfReview : "",
                                    categoryTypeId: val.categoryTypeId
                                }
                            })
                            let output = {
                                count: innerdata.length,
                                vendorList: valArray
                            }
                            responseSend(res, 200, output)
                        }
                    }):
                    (outerData.location.longitude && outerData.location.latitude) ?
                    vendorListModel.find({
                        "contact.location.latiude": outerData.location.latitude,
                        "contact.location.longitude": outerData.location.longitude,
                        categoryType: req.body.categoryType
                    }, async (innerErr, vendorList) => {
                        if (innerErr)
                            throw innerErr
                        if (vendorList.length <= 0) {
                            responseSend(res, 404, {
                                status: 404,
                                message: "No Vendors found in this location"
                            });
                        } else {
                            let valArray = [];
                            vendorList.forEach((val) => {
                                let dum = {
                                    listId: val.listId,
                                    name: val.name,
                                    city: (val.contact.location.city) ? val.contact.location.city : '',
                                    price: val.price ? val.price : '',
                                    avgRating: (val.avgRating) ? val.avgRating : 0,
                                    reviewCount: (val.noOfReview) ? val.noOfReview : 0,
                                    categoryTypeId: val.categoryTypeId
                                }
                                valArray.push(dum)
                            });
                            let output = {
                                count: vendorList.length,
                                vendorList: valArray
                            };
                            responseSend(res, 200, output)
                        }
                    }) :
                    vendorListModel.find({
                        categoryType: req.body.categoryType
                    }, async (innerErr, vendorList) => {
                        if (innerErr)
                            throw innerErr
                        if (vendorList.length > 0) {
                            let valArray = [];
                            vendorList.forEach((val) => {
                                let dum = {
                                    listId: val.listId,
                                    name: val.name,
                                    city: (val.contact.location.city) ? val.contact.location.city : '',
                                    price: val.price ? val.price : '',
                                    avgRating: (val.avgRating) ? val.avgRating : 0,
                                    reviewCount: (val.noOfReview) ? val.noOfReview : 0,
                                    categoryTypeId: val.categoryTypeId
                                }
                                valArray.push(dum)
                            });
                            let output = {
                                count: vendorList.length,
                                vendorList: valArray
                            }
                            responseSend(res, 200, output)
                        } else {
                            responseSend(res, 404, {
                                status: 404,
                                message: "No Vendors found in this location"
                            })
                        }
                    }).sort({
                        "promotions.isPromotion": -1
                    })
            } else {
                responseSend(res, 401, "No User Found")
            }
        })
        req.body.userId
    } catch (err) {
        res.status(500)
            .send({
                status: 500,
                message: "Oops Something went wrong!"
            })
    }
})






////adminPanel Check
vendorList.get('/', async (req, res) => {
    try {
        vendorListModel.find({}, (err, data) => {
            if (err)
                throw "No Data Found"
            responseSend(res, 200, {
                status: 200,
                message: data
            })
        })
    } catch (err) {
        res.status(500)
            .send({
                status: 500,
                message: "Oops Something went wrong!"
            })
    }

})





/*** common response***/
function responseSend(res, statusCode, message) {
    res.status(statusCode)
        .send(message);
}
module.exports = vendorList;