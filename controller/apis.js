const express = require('express');
const apis = new express.Router();

apis.use('/v1/user', require('./user/index'))
apis.use('/v1/admin', require('./admin/index'))
// apis.use('/v1/vendor', require('./vendor/vendor'));

module.exports = apis;
