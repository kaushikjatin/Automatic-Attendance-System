const joi=require('joi')
module.exports={
    teacherRegsiterValidator:joi.object({
        email:joi.string().email().required(),
        name:joi.string().required(),
        password:joi.string().min(8).required()
    }),
    adminRegsiterValidator:joi.object({
        email:joi.string().email().required(),
        name:joi.string().required(),
        password:joi.string().min(8).required(),
        branch:joi.array().items(joi.number().required())
    }),
    studentRegisterValidator:joi.object({
        email:joi.string().email().required(),
        name:joi.string().required(),
        rollNo:joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Wrong Roll number.`}).required(),
        branch:joi.number().required(),
        password:joi.string().min(8).required(),
        yearOfStart:joi.number().required()
    }),
    loginValidator:joi.object({
        username:joi.string().required(),
        password:joi.string().required()
    })
}