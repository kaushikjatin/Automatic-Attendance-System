const createError = require('http-errors')
const {teacher,student} = require('../modals/user')
const subject=require('../modals/subject')
const fs=require('fs')
const {addsubjectValidator,deletesubjectValidator}=require('../validators/subjectvalidation')
exports.addSubject=async(req,res,next)=>{
    // subject name and subject code is in req.body
    // this function is only available to admin only
    
    const validSubject=addsubjectValidator.validate({
        name:req.body.name,
        code:req.body.code
    })
    if(validSubject.error)
        return next(createError[422](validSubject.error.details[0].message))
    try{
        const sub=await subject.create({name:validSubject.value.name,code:validSubject.value.code.toUpperCase()})
        const response=await subject.find({})
        res.send(response)
    } catch (err) {
        console.log(err)
        if(typeof(err)==='string')
          next(createError[422](err))
        else
          next(createError[422](err.message))
    }
}
exports.editSubject=async(req,res,next)=>{
    // subject name and subject code is in req.body
    // this function is only available to admin only
    
    const validSubject=addsubjectValidator.validate({
        name:req.body.name,
        code:req.body.code
    })
    if(validSubject.error)
        return next(createError[422](validSubject.error.details[0].message))
    try{
        const sub=await subject.findOneAndUpdate({code:validSubject.value.code.toUpperCase()},{$set:{name:validSubject.value.name,code:validSubject.value.code.toUpperCase()}})
        console.log(sub)
        if(sub==null)
            return next(createError[422]('Subject code not found'))
        return res.send(sub)
    } catch (err) {
        console.log(err)
        if(typeof(err)==='string')
          next(createError[422](err))
        else
          next(createError[422](err.message))
    }
}
// function to edit subject
exports.deleteSubject=async(req,res,next)=>{
    const validSubject=deletesubjectValidator.validate({
        code:req.query.code
    }) 
    if(validSubject.error)
        return next(createError[422](validSubject.error.details[0].message))
    try {
        const result=await subject.findOneAndDelete({code:validSubject.value.code.toUpperCase()})
        res.send(result)
    } catch (err) {
        // console.log(err)
        if(typeof(err)==='string')
          next(createError[422](err))
        else
          next(createError[422](err.message))
    }
}
exports.showSubject=async(req,res,next)=>{
    console.log(req.query)
    console.log(req.body) 
    if(req.query.code) 
        subject.findOne({code:req.query.code})
        .then(sub=>res.send(sub))
        .catch(err=>next(createError[400](err.message)))
    else
        subject.find({})
        .then(sub=>res.send(sub))
        .catch(err=>next(createError[400](err.message)))
}