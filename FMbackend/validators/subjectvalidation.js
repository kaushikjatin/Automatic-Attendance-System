const joi=require('joi')
module.exports={
    addsubjectValidator:joi.object({
        name:joi.string().required(),
        code:joi.string().required(),
    }),
    deletesubjectValidator:joi.object({
        code:joi.string().required(),
    })
}