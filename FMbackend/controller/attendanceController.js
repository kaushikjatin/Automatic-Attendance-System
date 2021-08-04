// Contains function for attendance 
const { saveImage, deleteImages } = require('../helpers/saveFiles')
const {teacher}=require('../modals/user')
const {addattendanceValidator}=require('../validators/attendanceValidation')
const createError = require('http-errors')
const {classModal,attendanceModal} = require('../modals/classModal')
const subject = require('../modals/subject')
const axios=require('axios')
const path=require('path')
const { sendMail } = require('../helpers/mail_helper')
//CHANGE IT
// console.log(path.join(__dirname,'..','..','public','images','attendance'))
// console.log(process.env.PWD)
const PYTHON_URL = process.env.PYTHON_URL;
const BACKEND_URL = process.env.BACKEND_URL;
exports.addAttendance=async(req,res,next)=>{
    // This route required teacher to access only
    /*  data required
        date,
        branchCode,
        yearOfStart,
        sectionName,
        subjectCode,
        image1,image2,image3,image4...:req.files,
    */
   /* data gathered through auth
        email:req.user.email
   */

    // validate input data
    const validAttendance=addattendanceValidator.validate({
        branchCode:req.body.branchCode,
        yearOfStart:req.body.yearOfStart,
        sectionName:req.body.sectionName,
        subjectCode:req.body.subjectCode,
        email:req.user.email,
        date:req.body.date
    })
    if(validAttendance.error)
        return next(createError[422](validAttendance.error.details[0].message))
    if(!(req.files &&req.files.length>0))
        return next(createError[422]('Please attach photos also'))
    // saving images
    try{
        
        // finding right attendance object
        const Class=await classModal.findOne({
            branchCode:validAttendance.value.branchCode,
            yearOfStart:validAttendance.value.yearOfStart
        })
        .populate('section.students')
        .exec()
        if(!Class)
            return next(createError[422]('class not found'))
        var section=Class.section.filter((section)=>section.name===validAttendance.value.sectionName)
        
        // console.log(section)
        if(!section.length)
            return next(createError[422]('section not found'))
        section=section[0]
        const teach=await teacher.findOne({email:validAttendance.value.email})
        const subj=await subject.findOne({code:validAttendance.value.subjectCode})
        if(!teach || !subj)
            return next(createError[422]('subjectcode not valid'))
        var attendance=await section.attendance.filter((att)=>att.teacherId.toString()==teach._id.toString()&&att.subjectId.toString()==subj._id.toString())
        if(!attendance.length)
            return next(createError[422]('You do not teach this subject to this section'))
        attendance=attendance[0] 
        const studentId=section.students.map(stud=>stud._id)
        const folderName=Class._id.toString()
        const dir=path.join('public','images','attendance',folderName)
        // console.log('hlo',dir,'dir')
        // console.log(path.join(__dirname,'..','..','public','images','attendance',folderName))
        try{
            const imNames=await saveImage(req.files,dir)
        var imgURL = imNames.map((im) => {
            if (im != undefined) return BACKEND_URL + im;
          });
        const x={   
            students:studentId,
            class_code:
              Class.branchCode +
              "" +
              Class.yearOfStart,
            images: imgURL,
          }
          console.log(x)
          console.log(PYTHON_URL)
        const { data } = await axios.post(
            PYTHON_URL + "/get_attendance",
            {   
              students:studentId,
              class_code:
                Class.branchCode +
                "" +
                Class.yearOfStart,
              images: imgURL,
            }
          ); 
          console.log(data)
        //   console.log(error)
          // SEND THE DL API WITH REQUIRED DATA
          if(data.error==true)
            return next(createError[500]('Some internal error occured.Try again.'))
          var roll=[...data.students]
          attendance.attendance.push({
              date:validAttendance.value.date,
              presentStudent:roll
          })
          roll=section.students.filter(stud=>{
              return roll.indexOf(stud._id.toString())!=-1
            })
          roll=roll.map(rol=>rol.rollNo)
          await Class.save()
          // deleting attendance folder
          await deleteImages(imNames)
          //sending mail to all those students who were absent that day
          const absentees=section.students.filter(stud=>{
            return roll.indexOf(stud.rollNo)==-1
          })
        //   absentees.forEach(stud=>console.log(stud.rollNo))
        //   console.log(roll)
        //   section.students.forEach(stud=>console.log(stud.rollNo))
            const absenteesEmail=absentees.map(rol=>rol.email)
          const subject=`Absentees for subject ${subj.name} ,date ${validAttendance.value.date}`
          const content=`Hey there,According to ${teach.name} the following students were not present in the class today and you were one of them.If you find any mistake in the process then contact your subject teacher.
          <br/>List of students who were present.<br/> <ul>${roll.map(r=>`<li>${r}</li>`)}</ul>`
          console.log(absenteesEmail)
          if(absenteesEmail.length>0)
            sendMail(absenteesEmail,subject,content)
          return res.send({students:roll})
        }
        catch(err){
            if(typeof err=='string')
                next(createError[400](err))
            console.log(err)
            next(createError[400]('Error occured.Try again'))
        }
    }
    catch(err){
        // res.send(err)
        if(typeof err=='string')
            next(createError[400](err))
        else
            next(createError[400](err.message))
    }
    
    // res.send('PENDING Response with dl api')
}