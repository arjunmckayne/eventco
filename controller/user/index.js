const express = require('express');
const user = new express.Router();
var validator = require("email-validator");
const User = require('./model/userModel')
const Otp = require('../commonModels/otpModel');

//user redirections////
user.use('/slider', require('./slider'));
user.use('/vendorList', require('./vendorList'));

/*** User Data***/
user.get('/', async function (req, res) {
  let data = await getAll();
  res.status(200)
    .send(
      data
    );
});
/*** User Login***/
user.post('/login', async (req, res) => {
  try {
    User.findOne({
      mobileNo: req.body.mobileNo
    }, function (err, user) {
      if (err)
        responseSend(res, 500, "Oops Something went wrong!")
      else(!user) ?
        responseSend(res, 400, {
          status: 400,
          message: "No User Found"
        }) :
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            let userData = {
              status: 200,
              message: 'success',
              userId: user.userId,
              mobileNo: user.mobileNo,
              name: user.name,
              imgPath: user.imgPath ? user.imgPath : ''
            };
            responseSend(res, 200, userData);
            lastActivityUpdate(userData.userId);
          } else
            responseSend(res, 402, {
              status: 402,
              message: "Wrong Password"
            });
        });
    });
  } catch (err) {
    res.status(500)
      .send({
        status: 500,
        message: "Oops Something went wrong!"
      })
  }
});
/*** User Register***/
user.post('/register', async (req, res) => {
  try {
    let email = await getUserDetails('email', req.body.email);
    let mobileNo = await getUserDetails("mobileNo", req.body.mobileNo);
    if (email) {
      responseSend(res, 409, {
        status: 409,
        message: 'This Email already exist!'
      });
      return
    } else if (!validator.validate(req.body.email)) {
      responseSend(res, 422, {
        status: 422,
        message: 'Invalid Email Entry'
      })
      return
    }
    if (mobileNo) {
      responseSend(res, 405, {
        status: 405,
        message: 'This Mobile Number Already Exist!'
      });
      return
    }
    let user = new User({
      userId: await getuserId(),
      name: req.body.name,
      password: req.body.password,
      mobileNo: req.body.mobileNxo,
      email: req.body.email,
      createdDate: new Date()
    });


    user.save(function (error, user) {
      if (error) {
        let errorMsg = '';
        if (error.errors.mobileNo) {
          errorMsg = error.errors.mobileNo.message;
        }
        if (error.errors.email) {
          errorMsg = error.errors.email.message;
        }
        responseSend(res, 402, {
          status: 402,
          message: errorMsg
        })
      } else {
        let userData = {
          message: 'success',
          status: 200,
          userId: user.userId,
          mobileNo: user.mobileNo,
          name: user.name,
          imgPath: user.imgPath ? user.imgPath : '',
        };
        responseSend(res, 200, userData)
      }
    });
  } catch (err) {
    res.status(500)
      .send({
        status: 500,
        message: "Oops Something went wrong!"
      })
  }


});

/*** otpRegister***/
user.post('/otpRegister', async (req, res) => {
  try {
    let email = await getUserDetails('email', req.body.email);
    let mobileNo = await getUserDetails("mobileNo", req.body.mobileNo);
    if (email) {
      responseSend(res, 409, {
        status: 409,
        message: 'This Email Already Exist!'
      });
      return
    } else if (!validator.validate(req.body.email)) {
      responseSend(res, 422, {
        status: 422,
        message: 'Invalid Email Entry'
      })
      return
    }
    if (mobileNo) {
      responseSend(res, 405, {
        status: 405,
        message: 'This Mobile Number Already Exist!'
      });
      return
    }
    getRandomOtp(res, req.body.mobileNo);
  } catch (err) {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
  }

});
/*** otpResend***/

user.post('/otpResend', async (req, res) => {
  try {
    if (req.body.mobileNo === '')
      throw "Null Value"
    Otp.deleteOne({
      mobileNo: req.body.mobileNo
    }, (err, user) => {
      if (err)
        console.log("Errr", err)
      else
        console.log(req.body.mobileNo, "User Deleted")
    })
    getRandomOtp(res, req.body.mobileNo);
  } catch (err) {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
  }
});
user.post('/otpForgot', async (req, res) => {
  try {
    let mobileNo = await getUserDetails("mobileNo", req.body.mobileNo);
    if (!mobileNo)
      responseSend(res, 409, {
        status: 409,
        message: 'Mobile Number Not Exists'
      });
    else {


      Otp.deleteOne({
        mobileNo: req.body.mobileNo
      }, (err, user) => {
        if (err)
          console.log("Errr", err)
        else
          console.log(mobileNo, "User Deleted")
      })
      getRandomOtp(res, req.body.mobileNo);
    }
  } catch (err) {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
  }
});
user.post('/verifyOtp', async (req, res) => {
  try {
    console.log(req.body);
    Otp.find({
      mobileNo: req.body.mobileNo,
      otp: req.body.otp,
      type: "user"
    }, (err, data) => {
      if (err) {
        responseSend(403, {
          status: 403,
          message: 'OTP Not Match'
        });
        return
      }
      console.log(data)
      if (data[0]) {
        responseSend(res, 200, {
          status: 200,
          message: "OTP verified Successfully"
        })
        Otp.deleteOne({
          mobileNo: req.body.mobileNo
        }, (err, user) => {
          if (err)
            console.log("Errr", err)
          else if (data[0])
            console.log(data[0]._id, "User Deleted")
        });
        return;
      } else {
        responseSend(res, 422, {
          status: 422,
          message: "OTP Not Valid"
        })

      }
    })
  } catch (err) {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
  }

})
/*** forgot Password ***/
user.post('/forgotPassword', async (req, res) => {
  try {
    let error = await getUserDetails('mobileNo', req.body.mobileNo);
    if (!error)
      responseSend(res, 401, {
        status: 401,
        message: 'Mobile Number Not Found'
      })
    else
      User.updateOne({
        mobileNo: req.body.mobileNo
      }, {
        $set: req.body
      }, async (err, user) => {
        if (err || !user || user === undefined) {
          responseSend(res, 304, {
            status: 304,
            message: 'not updated'
          });
          return
        }
        User.findOne({
          mobileNo: req.body.mobileNo
        }, async (err, data) => {
          if (err) {
            responseSend(res, 500, {
              status: 500,
              message: "Oops Something Went Wrong!"
            });
            return
          }
          let userData = {
            message: 'Successfully Updated',
            status: 200,
            userId: data.userId,
            mobileNo: data.mobileNo,
            name: data.name,
            imgPath: data.imgPath.file_name ? data.imgPath : '',
          };
          responseSend(res, 200, userData)
        })
      })
  } catch (err) {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
  }
})
/*** Uploading Img***/
user.post('/profileimage', (req, res) => {
  //  Your code goes here
});



//////////////////////////////General Functions starts from here //////////////////////////////

/*** Getting UserId***/
getuserId = async () => {
  const val = await User.findOne({}).sort({
    createdDate: -1
  });
  if (val)
    return val.userId != null || val.userId != NaN ?
      "u" + (parseInt(val.userId.split("u")[1]) + 1) :
      "u1"
  // return val["userId"] != null || val != NaN ?
  //   "u" + (parseInt(val["userId"]).split("u")[1] + 1) : "u1";
  else {
    console.log("Got called")

    return "u1";
  }
}
/*** Getting All UserDetails***/
getAll = async () => {
  return await User.find({}).sort({
    createdDate: -1
  })
}
/*** Dynamic User Collection check***/
getUserDetails = async (para, val) => {
  const data = (para === 'email') ? await User.findOne({
    email: val
  }) : await User.findOne({
    mobileNo: val
  });
  return (data) ? true : false
}

/*** Getting All RandomOTP***/
getRandomOtp = async (res, mobileNo) => {
  try {
    let userOtp = new Otp({
      mobileNo: mobileNo,
      otp: await generateOTP(),
      type: 'user'
    })
    userOtp.save(function (error, user) {
      if (user)
      {  responseSend(res, 200, {
          status: 200,
          message: user.otp
        })
      console.log(userOtp)
      }
      if (!user)
        throw error
    });
  } catch (err) {
    responseSend(res, 500, {
      status: 500,
      message: error
    })
  }

}
/*** OTP generation***/
generateOTP = () => {
  min = Math.ceil(1111);
  max = Math.floor(9999);
  get = Math.floor(Math.random() * (max - min)) + min;
  return get;
}
/*** Updating Last Activity***/
lastActivityUpdate = async (userId) => {
  User.updateOne({
    userId: userId
  }, {
    $set: {
      lastActiveDate: new Date()
    }
  }, (err, user) => {
    (err || !user || user === undefined) ?
    console.log(err, 'failed to update Recent Active Time'):
      console.log("Updated Recent Time")
  })
}
/*** common response***/
function responseSend(res, statusCode, message) {
  res.status(statusCode)
    .send(message);
}






/////test purpose
user.get('/getOtp', async (req, res) => {
  try {
    let data = await Otp.find({}).sort({
      _id: -1
    });
    responseSend(res, 200, {
      status: 200,
      message: data
    })
  } catch (err) {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
  }
})






module.exports = user;