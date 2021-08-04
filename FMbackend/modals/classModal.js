const mongoose=require('mongoose')
const attendance=new mongoose.Schema({
    teacherId:{
        type:mongoose.Schema.ObjectId,
        ref:'teacher',
        required:true
    },
    subjectId:{
        type:mongoose.Schema.ObjectId,
        ref:'subject',
        required:true
    },
    attendance:[{
        date:{
            type:String,
            required:true
        },
        presentStudent:[{
            type:mongoose.Schema.ObjectId,
            ref:'student'
        }]
    }]
})
const section=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    students:{
        type:[{
            type:mongoose.Schema.ObjectId,
            ref:'student'
        }],
        default:[]
    },
    attendance:{
        type:[attendance],
        required:false,
        default:[]
    },
})
var classModal=new mongoose.Schema({
    branchCode:{
        type:Number,
        required:true
    },
    yearOfStart:{
        type:Number,
        requried:true
    },
    students:{
        type:[{
            type:mongoose.Schema.ObjectId,
            ref:'student',
        }],
        default:[]
    },
    teachers:{
        type:[{
            type:mongoose.Schema.ObjectId,
            ref:'teacher'
        }],
        default:[]
    },
    section:{
        type:[section],
        default:[],
        required:false
    }
})
classModal.index({'branchCode':1,'yearOfStart':1},{unique:1})

// UNIQUE BRANCH CODE AND YEAR OF START PENDING

classModal.post('save', function(error, res, next) {
    // console.log(error)
    // console.log('save');
    if ( error.code === 11000) {
        next(new Error(`${Object.keys(error.keyValue)[0]} already exists`));
    } else {
      next(); // The `update()` call will still error out.
    }
  });       
module.exports={
    classModal:mongoose.model('class',classModal),
    sectionModal:mongoose.model('section',section),
    attendanceModal:mongoose.model('attendance',attendance)

}