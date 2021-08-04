var express = require('express');
const jwtHelper=require('../helpers/jwt_helper')
const attendanceController=require('../controller/attendanceController')
const classModal = require('../modals/classModal');
var router = express.Router();

router.post('/addAttendance',jwtHelper.verifyUser,jwtHelper.verifyTeacher,attendanceController.addAttendance);
// router.delete('/addClass',(req,res,next)=>{
//     classModal.deleteMany({})
//     .then(result=>res.send(result))
//     .catch(err=>res.send(err))
// })
// router.get('/addClass',jwtHelper.verifyUser,classController.seeClass)
module.exports = router;
