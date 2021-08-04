const mongoose=require('mongoose');
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:true
  }, function(err, db) {
  if (err) 
    console.error(err)
  else
    console.log("Database connected!");
})