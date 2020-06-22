const express = require('express');
const slider = new express.Router();
var validator = require("email-validator");

slider.get('/', async function (req, res) {
    res.status(200)
        .send("slider Checked");
});

module.exports = slider;