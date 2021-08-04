const mongoose=require('mongoose')
const passportLocalMongoose= require('passport-local-mongoose')
var admin=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    profilePic:{
        contentType:String, 
        data:Buffer,
    },
    branch:{
        type:[Number],
        default:[]
    },
    otp:{
        type:Number,
        default:null
    },
    otpExpire:{
        type:Date,
        default:null
    },
    verified:{
        type:Boolean,
        default:false
    }
})
admin.plugin(passportLocalMongoose)
var teacher=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    profilePic:{
        contentType:String, 
        data:Buffer,
    },
    otp:{
        type:Number,
        default:null
    },
    otpExpire:{
        type:Date,
        default:null
    },
    verified:{
        type:Boolean,
        default:false
    }
})
teacher.plugin(passportLocalMongoose)

var student=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    profilePic:{
        contentType:String, 
        data:Buffer,
    },
    rollNo:{
        type:Number,
        require:true
    },
    branch:{
        type:Number,
        require:true
    },
    yearOfStart:{
        type:Number,
        require:true
    }, 
    otp:{
        type:Number,
        default:null
    },
    otpExpire:{
        type:Date,
        default:null
    },
    verified:{
        type:Boolean, 
        default:false
    } 
},{
    timestamps:true
})
student.plugin(passportLocalMongoose)
student.index({rollNo:1},{unique:1})
// student.index({yearOfStart:1,branch:1,rollNo:1},{unique:1})
student.post('save', function(error, res, next) {
    console.log(error)
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error(`${Object.keys(error.keyValue)[0]} already exists`));
    } else {
      next(); // The `update()` call will still error out.
    }
  });
  teacher.post('save', function(error, res, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error(`${Object.keys(error.keyValue)[0]} already exists`));
    } else {
      next(); // The `update()` call will still error out.
    }
  });
  admin.post('save', function(error, res, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error(`${Object.keys(error.keyValue)[0]} already exists`));
    } else {
      next(); // The `update()` call will still error out.
    }
  });
module.exports={
    student:mongoose.model('student',student),
    teacher:mongoose.model('teacher',teacher),
    admin:mongoose.model('admin',admin)
}
