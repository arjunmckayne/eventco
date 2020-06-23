const express = require('express');
const admin = new express.Router();
var validator = require("email-validator");


admin.get('/', async function (req, res) {
    res.status(200)
        .send("Admin Checked");
});
admin.use('/slider', require('./slider'));


admin.get('/login', async (req, res) => {
    if (req.body.mobileNo === '' || req.body.mobileNo == null || req.body.password === null || req.body.password == '') {
        responseSend(res, 500, {
            status: 500,
            message: "Oops Something went wrong!"
        });
        return;
    }
    User.findOne({
        mobileNo: req.body.mobileNo
      }, function (err, user) {
        if (err)
          responseSend(res, 500, err)
        else(!user) ?
          responseSend(res, 400, {
            status: 400,
            message: "No User Found"
          }) :
          user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              let userData ={

                // something goe here
              }
              responseSend(res, 200, userData);
              lastActivityUpdate(userData.userId);
            } else
              responseSend(res, 402, {
                status: 402,
                message: "Wrong Password"
              });
          });
      });

})

module.exports = admin;