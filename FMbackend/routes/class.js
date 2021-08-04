var express = require('express');
const jwtHelper=require('../helpers/jwt_helper')
const classController=require('../controller/classController');
const classModal = require('../modals/classModal');
var router = express.Router();

router.post('/addClass',jwtHelper.verifyUser,jwtHelper.verifyAdmin,classController.addClass);
router.put('/addClass',jwtHelper.verifyUser,jwtHelper.verifyAdmin,classController.editClass);
router.post('/deleteClass',jwtHelper.verifyUser,jwtHelper.verifyAdmin,classController.deleteClass)
router.get('/addClass',jwtHelper.verifyUser,classController.seeClass)
module.exports = router;  
router.get('/get_data',jwtHelper.verifyUser,classController.getDataforDropdown)