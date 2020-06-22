const express = require('express');
const user = new express.Router();
var validator = require("email-validator");
const User = require('./model/userModel')
const Otp = require('./model/otpModel');
const {
  exit
} = require('process');
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
  if (req.body.mobileNo === '' || req.body.mobileNo == null || req.body.password === null || req.body.password == '')
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
  else
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
            let userData = {
              status: 200,
              message: 'success',
              userId: user.userId,
              mobileNo: user.mobileNo,
              name: user.name,
              imgPath: user.imgPath.path ? user.imgPath.path : ''
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
})
/*** User Register***/
user.post('/register', async (req, res) => {
  if (req.body.name == '' || req.body.name == null || req.body.email == null || req.body.mobileNo == null || req.body.password == '') {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
    return
  }
  let email = await getUserDetails('email', req.body.email);
  let mobileNo = await getUserDetails("mobileNo", req.body.mobileNo);
  if (email) {
    responseSend(res, 409, {
      status: 409,
      message: 'This email already exist!'
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
      message: 'This mobile number already exist!'
    });
    return
  }
  let user = new User({
    userId: await getId(),
    name: req.body.name,
    password: req.body.password,
    mobileNo: req.body.mobileNo,
    email: req.body.email,
    createdDate: new Date()
  });
  user.save(function (error, user) {
    if (error) {
      let errorMsg = '';
      if (error.errors.mobileNo) {
        errorMsg = error.errors.mobileNo.message;
        // console.log(errorMsg)
        statusCode = 402
      }
      if (error.errors.email) {
        errorMsg = error.errors.email.message
        console.log(error.errors)
      }
      responseSend(res, statusCode, {
        status: statusCode,
        message: errorMsg
      })
    } else {
      let userData = {
        status: 'success',
        statusCode: 200,
        userId: user.userId,
        mobileNo: user.mobileNo,
        name: user.name,
        imgPath: user.imgPath.file_name ? user.imgPath : '',
      };
      responseSend(res, 200, userData)
    }
  });
});

/*** otpRegister***/
user.post('/otpRegister', async (req, res) => {
  if (req.body.mobileNo === null || req.body.mobileNo == '' || req.body.mobileNo == undefined || req.body.email == '' || req.body.email == null) {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
    return
  }
  let email = await getUserDetails('email', req.body.email);
  let mobileNo = await getUserDetails("mobileNo", req.body.mobileNo);
  if (email) {
    responseSend(res, 409, {
      status: 409,
      message: 'This email already exist!'
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
      message: 'This mobile number already exist!'
    });
    return
  }
  getRandomOtp(res, req.body.mobileNo);
});
/*** otpResend***/

user.post('/otpResend', async (req, res) => {
  if (req.body.mobileNo == null || req.body.mobileNo == '') {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
    return
  } else {
    Otp.deleteOne({
      mobileNo: req.body.mobileNo
    }, (err, user) => {
      if (err)
        console.log("Errr", err)
      else
        console.log(req.body.mobileNo, "User Deleted")
    })
    getRandomOtp(res, req.body.mobileNo);
  }
})
user.post('/otpForgot', async (req, res) => {
  if (req.body.mobileNo == null || req.body.mobileNo == '') {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
    return
  }
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
})
user.post('/verifyOtp', async (req, res) => {
  if (req.body.mobileNo == null || req.body.mobileNo == '' || req.body.otp == '' || req.body.otp == null) {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
    return
  }
  console.log(req.body.otp)
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
})
/*** forgot Password ***/
user.post('/forgotPassword', async (req, res) => {
  if (req.body.mobileNo == '' || req.body.mobileNo == null || req.body.password == '' || req.body.password == null) {
    responseSend(res, 500, {
      status: 500,
      message: "Oops Something went wrong!"
    });
    return
  }
  let error = await getUserDetails('mobileNo', req.body.mobileNo);
  if (!error)
    responseSend(res, 401, {
      status: 401,
      message: 'MobileNo Not Found'
    })
  else
    User.updateOne({
      mobileNo: req.body.mobileNo
    }, {
      $set: req.body
    }, async (err, user) => {
      (err || !user || user === undefined) ?
      responseSend(res, 304, {
          status: 304,
          message: 'not updated'
        }):
        responseSend(res, 200, {
          status: 200,
          message: 'success'
        })
    })
})
/*** Uploading Img***/
user.post('/profileimage', (req, res) => {
  //  Your code goes here
})
user.get('/getOtp', async (req, res) => {
  let data = await Otp.find({}).sort({
    _id: -1
  });
  responseSend(res, 200, {
    status: 200,
    message: data
  })
})

//////////////////////////////General Functions starts from here //////////////////////////////

/*** Getting UserId***/
getId = async () => {
  const val = await User.findOne({}).sort({
    createdDate: -1
  }).limit(1);
  if (val)
    return val["userId"] != null || val != NaN ? val["userId"] + 1 : 1;
  else
    return 1;
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
  let userOtp = new Otp({
    mobileNo: mobileNo,
    otp: await generateOTP(),
    type: 'user'
  })
  userOtp.save(function (error, user) {
    if (error) {
      responseSend(res, 500, {
        status: 500,
        message: error
      })
      return
    }
    responseSend(res, 200, {
      status: 200,
      message: user.otp
    })
  });
  console.log("OTP-------", userOtp)
}
/*** OTP generation***/
generateOTP = () => {
  min = Math.ceil(1111);
  max = Math.floor(9999);
  get = Math.floor(Math.random() * (max - min)) + min;
  return get
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

module.exports = user;