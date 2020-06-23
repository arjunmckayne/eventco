const express = require('express');
const slider = new express.Router();
const multipart = require('connect-multiparty');
const multipartMiddlewareVideo = multipart({
    uploadDir: './public/img/Slider'
});
const Slider = require('./../commonModels/sliderModel')

slider.get('/', async function (req, res) {
    let data = await Slider.find({}).sort({
        createdDate: -1
    })
    res.status(200)
        .send(data);
});

slider.post("/create", multipartMiddlewareVideo, async (req, res) => {
    console.log(req.files.file)
    if (req.body.caption === null || req.body.caption === '' || !req.files) {
        responseSend(res, 401, 'Pass the data');
        return
    }
    let slider = new Slider({
        caption: req.body.caption,
        file_name: req.files.file.originalFilename,
        size: req.files.file.size,
        type: req.files.file.type,
        path: req.files.file.path
    });
    slider.save((error, data) => {
        if (error) {
            responseSend(res, 500, error);
            return
        }
        responseSend(res, 200, "Successfully Uploaded the Video");
    });
});




responseSend = (res, statusCode, message) => {
    res.status(statusCode)
        .send(message);

}
module.exports = slider;