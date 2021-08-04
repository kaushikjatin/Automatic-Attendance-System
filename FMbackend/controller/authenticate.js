const createError = require("http-errors");
const { teacher, student, admin } = require("../modals/user");
const passport = require("passport");
const auth = require("../helpers/jwt_helper");
const axios = require("axios");
const {
  studentRegisterValidator,
  teacherRegsiterValidator,
  adminRegsiterValidator,
} = require("../validators/authvalidation");
const client = require("../helpers/radis_setup");
const { saveImage, deleteImages } = require("../helpers/saveFiles");
const path = require("path");
const PYTHON_URL = process.env.PYTHON_URL;
const BACKEND_URL = process.env.BACKEND_URL;
module.exports = {
  register: async (req, res, next) => {
    try {
      var profilePic = null;
      // handling profile pic if available
      if (req.files && req.files.length != 0) {
        var image = req.files.filter((file) => file.fieldname === "profilePic");
        // console.log(image)
        if (image.length > 0) {
          // console.log(image[0])         
          profilePic =
            {contentType:image[0].mimetype,data:image[0].buffer}
        }
      }
      if (req.params.role == 0) {
        //Registration for student
        // storing images of student under folder with name as rollNo
        var imagesLen = req.files ? req.files.length : 0;
        if (profilePic != null) imagesLen--;
        // console.log(imagesLen)
        if (!req.files || imagesLen < 6)
          return next(createError[422]("Please provide at least 6 photos"));
        const validStudent = studentRegisterValidator.validate({
          email: req.body.email,
          name: req.body.name,
          rollNo: req.body.rollNo,
          branch: req.body.branch,
          password: req.body.password,
          yearOfStart: req.body.yearOfStart,
        });
        // console.log(validStudent)
        if (validStudent.error) {
          next(createError[422](validStudent.error.details[0].message));
          return;
        }
        await student.register(
          new student({
            username: validStudent.value.email,
            email: validStudent.value.email,
            name: validStudent.value.name,
            rollNo: validStudent.value.rollNo,
            branch: validStudent.value.branch,
            yearOfStart: validStudent.value.yearOfStart,
            profilePic: profilePic,
          }),
          validStudent.value.password,
          async (err, stud) => {
            if (err) {
              console.error(err)
              next(createError[400](err.message));
              return;
            } else {
              stud["hash"] = undefined;
              stud["salt"] = undefined;
              const dir=path.join('public','images','attendance',req.body.rollNo.toString())
              // console.log(dir)
              var imNames = await saveImage(req.files, dir);

              var imgURL = imNames.map((im) => {
                if (im != undefined) return BACKEND_URL + im;
              });
              // res.send(imgURL)
              try{
                const { data } = await axios.post(
                PYTHON_URL + "convert_to_embeddings",
                {
                  roll_no: stud._id,
                  class_code:
                    validStudent.value.branch +
                    "" +
                    validStudent.value.yearOfStart,
                  images: imgURL,
                }
              );
              res.send(stud);
              }catch(err){
                console.error(err)
                // console.log(stud)
                student.findByIdAndDelete(stud._id)
                .then(res=>{
                  return next(createError[500]('Some error occured.Try again after some time'))
                })
              }
              finally{
                await deleteImages(imNames);
              }

              
            }
          }
        );
      } else if (req.body.role == 1) {
        //Registration for teacher
        const validTeacher = teacherRegsiterValidator.validate({
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
        });
        if (validTeacher.error)
          return next(createError[422](validTeacher.error.details[0].message));
        teacher.register(
          new teacher({
            username: validTeacher.value.email,
            email: validTeacher.value.email,
            name: validTeacher.value.name,
            profilePic: profilePic,
          }),
          validTeacher.value.password,
          (err, teach) => {
            if (err) {
              console.log(err);
              return next(createError[400](err.message));
            } else {
              teach["hash"] = undefined;
              teach["salt"] = undefined;
              res.send(teach);
            }
          }
        );
      } else if (req.body.role == 2) {
        //Registration for admin
        console.log(req.body);
        const validAdmin = adminRegsiterValidator.validate({
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
          branch: req.body.branch,
        });
        if (validAdmin.error)
          return next(createError[422](validAdmin.error.details[0].message));
          const allbranch = await admin.find({});
          var newbranch= validAdmin.value.branch
  
          const existingBranch=allbranch.filter(br=>{
            var commanBranch=newbranch.filter(x => br.branch.includes(x) )
            return commanBranch.length>0
          })
          if (existingBranch.length > 0)
            return next(
              createError[422](
                "One of the branch code is already with another department."
              )
            );
        admin.register(
          new admin({
            username: validAdmin.value.email,
            email: validAdmin.value.email,
            name: validAdmin.value.name,
            profilePic: profilePic,
            branch: validAdmin.value.branch,
          }),
          validAdmin.value.password,
          (err, teach) => {
            if (err) {
              console.log(err);
              return next(createError[400](err.message));
            } else {
              teach["hash"] = undefined;
              teach["salt"] = undefined;
              res.send(teach);
            }
          }
        );
      } else {
        next(createError[422]("Wrong Details Entered"));
      }
    } catch (err) {
      console.error(err);
      if (err.isJoi == true) next(createError[422]("Wrong crendentials!"));
      else if (typeof err === "string") next(createError[422](err));
      else next(createError[422](err.message));
    }
  },
  update: async (req, res, next) => {
    try {
      if (req.body.email != req.user.email)
        return next(createError[401]("You are not allowed this action"));
      var profilePic = null;
      // console.log(req.files)
      // handling profile pic if available
      if (req.files && req.files.length != 0) {
        var image = req.files.filter((file) => file.fieldname === "profilePic");
        // console.log(image)
        if (image.length > 0) {
          profilePic =
            {contentType:image[0].mimetype,data:image[0].buffer}
        }
      }
      if (req.params.role == 0) {
        //Registration for student
        // storing images of student under folder with name as rollNo

        const validStudent = studentRegisterValidator.validate({
          email: req.body.email,
          name: req.body.name,
          rollNo: req.body.rollNo,
          branch: req.body.branch,
          password: "12345678",
          yearOfStart: req.body.yearOfStart,
        });
        // console.log(validStudent)
        if (validStudent.error) {
          next(createError[422](validStudent.error.details[0].message));
          return;
        }

        const user = await student.findOneAndUpdate(
          { email: validStudent.value.email },
          {
            $set: {
              name: validStudent.value.name,
              profilePic: req.body.profilePic,
            },
          },
          { new: true }
        );

        user["hash"] = undefined;
        user["salt"] = undefined;
        user['otp']=undefined
        user['otpExpire']=undefined
        res.send(stud);
      } else if (req.body.role == 1) {
        //Registration for teacher
        const validTeacher = teacherRegsiterValidator.validate({
          email: req.body.email,
          name: req.body.name,
          password: "12345678",
        });
        if (validTeacher.error)
          return next(createError[422](validTeacher.error.details[0].message));
        const teach = await teacher.findOneAndUpdate(
          { email: validTeacher.value.email },
          {
            name: validTeacher.value.name,
            profilePic: profilePic,
          },
          { new: true }
        );

        teach["hash"] = undefined;
        teach["salt"] = undefined;
        res.send(teach);
      } else if (req.body.role == 2) {
        //Registration for admin
        console.log(req.body);
        const validAdmin = adminRegsiterValidator.validate({
          email: req.body.email,
          name: req.body.name,
          password: "12345678",
          branch: req.body.branch,
        });
        if (validAdmin.error)
          return next(createError[422](validAdmin.error.details[0].message));
        const allbranch = await admin.find({});
        var newbranch= validAdmin.value.branch.filter(
          (br) => req.user.branch.indexOf(br) == -1
        )

        const existingBranch=allbranch.filter(br=>{
          if(br._id.toString()==req.user._id.toString())
            return false;
          var commanBranch=newbranch.filter(x => br.branch.includes(x) )
          return commanBranch.length>0
        })
        if (existingBranch.length > 0)
          return next(
            createError[422](
              "One of the branch code is already with another department."
            )
          );

        const ad = await admin.findOneAndUpdate(
          { email: validAdmin.value.email },
          {
            $set: {
              name: validAdmin.value.name,
              profilePic: profilePic,
              branch: validAdmin.value.branch,
            },
          },
          { new: true }
        );
        console.log(ad);
        ad["hash"] = undefined;
        ad["salt"] = undefined;
        res.send(ad);
      } else {
        next(createError[422]("Wrong Details Entered"));
      }
    } catch (err) {
      console.log(err);
      if (err.isJoi == true) next(createError[422]("Wrong crendentials!"));
      else if (typeof err === "string") next(createError[422](err));
      else next(createError[422](err.message));
    }
  },

  login: async (req, res, next) => {
    var role = "student";
    if (req.params.role == 1) role = "teacher";
    else if (req.params.role == 2) role = "admin";
    console.log(role)
    passport.authenticate(role, async (err, User, info) => {
      // console.log(err,User,info)
      // console.log('authenti')
      if (err) {
        console.error(err);
        return next(createError[500]());
      } else if (info) {
        console.error(info);
        return next(createError[401]("Wrong username or password"));
      } else {
        // console.log(User)
        req.user = User;
        var accesstoken = await auth.signAccessToken(
          req.user._id,
          req.params.role
        );
        User.salt = undefined;
        User.hash = undefined;

        User['otp']=undefined
        User['otpExpire']=undefined
        try {
          res.cookie("newtoken", accesstoken, {
            signed: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        } catch (err) {
          console.log(err);
          return next(createError[500]());
        }
        res.statusCode = 200;
        res.send({ accesstoken, User, status: "You are logged in!" });
      }
    })(req, res, next);
  },
  logout: async (req, res, next) => {
    try {
      const token = req.signedCookies["token"];
      console.log(token);
      res.clearCookie("token", { signed: true });

      // const { refreshToken } = req.body
      // if (!refreshToken) throw createError.BadRequest()
      // const userId = await verifyRefreshToken(refreshToken)
      client.DEL(token, (err, val) => {
        if (err) {
          console.log(err.message);
          throw createError.InternalServerError();
        }
        res.status(200).send({ status: "You are logged out" });
      });
    } catch (error) {
      next(error);
    }
  },
  x: async (req, res, next) => {
    console.log(req.role);
    if (req.role == 1) teacher.find({}).then((u) => res.send(u));
    else if (req.role == 2) admin.find({}).then((u) => res.send(u));
    else student.find({}).then((u) => res.send(u));
  },
  del: async (req, res, next) => {
    if (req.role == 1) teacher.deleteMany({}).then((u) => res.send(u));
    if (req.role == 2) admin.deleteMany({}).then((u) => res.send(u));
    else student.deleteMany({}).then((u) => res.send(u));
  },
};
