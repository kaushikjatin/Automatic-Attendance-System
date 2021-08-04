const createError = require("http-errors");
const { sendMail } = require("../helpers/mail_helper");
const { teacher, student, admin } = require("../modals/user");
function genOTP() {
  let otp = Math.floor(Math.random() * 900000 + 100000);
  return otp; 
}
exports.sendOTP = async (req, res, next) => {
  if (!req.body.email) return next(createError[422]("Please send valid email"));
  const otp = genOTP();
  var text = "";
  var subject = "";
  if (req.body.type == "verifyEmail") {
    text = `OTP to verify your account is ${otp}.This otp is valid for 10 min only.`;
    subject = "OTP for account verification";
    var user = null;
    const role = parseInt(req.body.role);
    switch (role) {
      case 0:
        user = student;
        break;
      case 1:
        user = teacher;
        break;
      case 2:
        user = admin;
        break;
      default:
        user = student;
    }
    const User=await user.findOne({ email: req.body.email })
    if (User == null) return next(createError[422]("Account not found.Register first"));
  if (User.verified == true)
    return next(createError[400]("Account already verified"));
    User.otp=otp;
    User.otpExpire=new Date(new Date().getTime() + 10 * 60 * 1000)
    
      
    try {
      await User.save();
      const info = await sendMail(req.body.email, subject, text);
      return res.send("sent");
    } catch (err) {
      return next(createError[500](err.message));
    }
  }
};
exports.verifyAccount = async (req, res, next) => {
  if (!req.body.email || !req.body.otp || req.body.role==undefined)
    return next(createError[422]("Enter all details"));
  var user = null;
  const role = parseInt(req.body.role);
  switch (role) {
    case 0:
      user = student;
      break;
    case 1:
      user = teacher;
      break;
    case 2:
      user = admin;
      break;
    default:
      user = student;
  }
  console.log(req.body);
  var User = await user.findOne({ email: req.body.email });
  // console.log(user);
  if (User == null) return next(createError[422]("Account not found.Register first"));
  if (User.verified == true)
    return next(createError[400]("Account already verified"));
  if (User.otp != req.body.otp) return next(createError[400]("Wrong OTP"));
  var d = new Date(); 
  if (User.otpExpire - d < 0) return next(createError[400]("OTP expired"));
  User.verified = true;
  User.otp = null;
  User.otpExpire=null;
  try {
    User=await User.save();
    console.log(User)
    return res.send({ success: true,user:User });
  } catch (err) {
    return next(createError[500](err.message));
  }
};
