const express = require('express');
const user = new express.Router();
var validator = require("email-validator");
const User = require('./model/userModel');
const Otp = require('./model/otpModel');