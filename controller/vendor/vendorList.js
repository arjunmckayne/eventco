const express = require('express');
const vVendorList = new express.Router();
const vendorModel = require('./../commonModels/vendorList');
const multipart = require('connect-multiparty');
const upload = multipart({
    uploadDir: './public/img/vendor/vendorList'
});
vVendorList.post('/reg', upload, async (req, res) => {
    
    
    if (!req.body.name || req.body.name === '' || !req.files) {
        responseSend(res, 401, 'Pass the data');
        console.log(req.files)
        return
    }
    let vendorData = new vendorModel({
        name: req.body.name,
        img: req.files.img.path,
        description: req.body.description,
        price: req.body.price,
        vendorId: req.body.vendorId,
        categoryType: req.body.categoryType,
        since: req.body.since,
        about: req.body.about,
        contact: {
            mobile: req.body.mobile,
            "location.city": req.body.city,
            "location.country": req.body.country
        },
        portfolio: {
            location: null,
            video: null,
            image: null
        },
        rating: {
            userId: null,
            message: null,
            score: null
        },
        amenities: null,
        promotions: {
            isPromotion: null,
            promotionId: null
        },
        documents: {
            path: req.files.documents.path
        },
        message: {
            userId: null,
            message: null,
        },
        review: {
            noOfReview: null,
            Avgrating: null
        }
    });
    vendorData.save((error, data) => {
        if (error) {
            responseSend(res, 500, error);
            return
        }
        responseSend(res, 200, "Successfully Uploaded the VendorList");
        console.log(data)
    })
})



/*** common response***/
function responseSend(res, statusCode, message) {
    res.status(statusCode)
        .send(message);
}
module.exports = vVendorList;