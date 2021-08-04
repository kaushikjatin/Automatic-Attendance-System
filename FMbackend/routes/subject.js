var express = require('express');
const jwtHelper=require('../helpers/jwt_helper')
const subjectController=require('../controller/subject')
var router = express.Router();

router.post('/',jwtHelper.verifyUser,jwtHelper.verifyAdmin,subjectController.addSubject);
router.delete('/',jwtHelper.verifyUser,jwtHelper.verifyAdmin,subjectController.deleteSubject)
router.get('/',subjectController.showSubject)
router.put('/',jwtHelper.verifyUser,jwtHelper.verifyAdmin,subjectController.editSubject)
module.exports = router;
