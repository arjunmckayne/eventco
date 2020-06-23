const express = require('express');
const Slider = require('../commonModels/sliderModel');
const slider = new express.Router();
slider.get('/', async (req, res) => {
    let data = await Slider.find({}, {
        path: 1
    }).sort({
        createdDate: -1
    });
    (data.length>0)?
    responseSend(res, 200, {
        data
    })
    :responseSend(res, 200, {
        status: 404,
        message: 'No Slider'
      })
});
/*** common response***/
function responseSend(res, statusCode, message) {
    res.status(statusCode)
        .send(message);
}
module.exports = slider;