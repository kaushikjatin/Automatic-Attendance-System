var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require('mongoose');
require('dotenv').config()
const passport = require('passport')
const multer=require('multer')
var upload=multer()
require('./helpers/passport_setup');
require('./helpers/mongodb')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var subjectRouter=require('./routes/subject')
var classRouter=require('./routes/class')
// console.log(classRouter)
const cors  = require('cors');
var app = express(); 
app.use(cors({origin:process.env.FRONTEND_URL,credentials:true}))
app.use(passport.initialize())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload.any()) //multipart /form data is now accessible in body,file and files of req
app.use(cookieParser(process.env.COOKIESECRET));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors.cors)
app.use('/a', indexRouter);
app.use('/users', usersRouter);
app.use('/subject',subjectRouter)
app.use('/class',classRouter)
app.use('/attendance',require('./routes/attendance'))
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // console.log(err)
  res.status(err.status||500).send({
    status:err.status,
    message:err.message
  })
});

module.exports = app;
