const express = require('express');
const vVendorList = new express.Router();
const vendorModel = require('./../commonModels/vendorList');
const multipart = require('connect-multiparty');
const upload = multipart({
    uploadDir: './public/img/vendor/vendorList'
});
vVendorList.post('/insert', upload, async (req, res) => {
    try {
        let vendorData = new vendorModel({
            listId: await getId(),
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
                location: req.body.location,
                video: (req.files.portfolioVideo) ? req.files.portfolioVideo.path : null,
                image: (req.files.portfolioImg) ? req.files.portfolioImg.path : null
            },
            documents: {
                path: (req.files.documents.path) ? req.files.documents.path : null
            },
        });
        vendorData.save((error, data) => {
            if (error) {
                responseSend(res, 500, error);
                return
            }
            responseSend(res, 200, "Successfully Uploaded the VendorList");
            console.log(data)
        })
    } catch (err) {
        responseSend(
            res, 500, {
                status: 200,
                message: err.message
            });
    }
    if (!req.body.name || req.body.name === '' || !req.files) {
        responseSend(res, 401, 'Pass the data');
        console.log(req.files)
        return
    }

})



getId = async () => {
    const val = await vendorModel.findOne({}).sort({
        createdDate: -1
    });

    if (val) {
        console.log("----- ",val.listId)
        return (val.listId != null || val.listId != NaN || val.listId != undefined) ?
            "l" + (parseInt(val.listId.split("l")[1]) + 1) :
            "l1"
    }
    return "l1"
}



/*** common response***/
function responseSend(res, statusCode, message) {
    res.status(statusCode)
        .send(message);
}
module.exports = vVendorList;