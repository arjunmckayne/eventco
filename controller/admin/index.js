const express = require('express');
const admin = new express.Router();
var validator = require("email-validator");

admin.get('/', async function (req, res) {
    res.status(200)
        .send("Admin Checked");
});
admin.use('/slider',require('./slider'))

module.exports = admin;