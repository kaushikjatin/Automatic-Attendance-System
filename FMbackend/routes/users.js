var express = require('express');
const authenticate = require('../controller/authenticate');
const { sendOTP,verifyAccount } = require('../controller/handle_otp');
const jwtHelper=require('../helpers/jwt_helper')
var router = express.Router();
/* GET users listing. jwtHelper.verifyUser,jwtHelper.verifyAdmin, */
router.post('/register/:role',authenticate.register)
router.put('/:role',jwtHelper.verifyUser,authenticate.update)
router.post('/login/:role',authenticate.login)
router.post('/logout/:role',jwtHelper.verifyUser,authenticate.logout)
router.post('/sendOTP',sendOTP)
router.post('/verifyAccount',verifyAccount)
module.exports = router;
