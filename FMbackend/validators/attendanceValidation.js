const joi=require('joi')
module.exports={
    addattendanceValidator:joi.object({
        branchCode:joi.number().required(),
        yearOfStart:joi.number().required(),
        sectionName:joi.string().required(),
        subjectCode:joi.string().required(),
        email:joi.string().email().required(),
        date:joi.string().required()
    }),
}