const mongoose=require('mongoose')
var subject=new mongoose.Schema({
    name:{
        type:String,
        requried:true,
    },
    code:{
        type:String,
        requried:true,
        unique:true
    }
})
subject.post('save', function(error, res, next) {
    // console.log(error)
    // console.log('save');
    if ( error.code === 11000) {
        next(new Error(`${Object.keys(error.keyValue)[0]} already exists`));
    } else {
      next(); // The `update()` call will still error out.
    }
  });
module.exports=mongoose.model('subject',subject)