const passport= require('passport')
const LocalStratagy=require('passport-local').Strategy
const createError=require('http-errors')
const {teacher,student, admin}=require('../modals/user')
passport.use('teacher',new LocalStratagy({usernameField: 'email'},teacher.authenticate()));
passport.use('student',new LocalStratagy({usernameField: 'email'},student.authenticate()))
passport.use('admin',new LocalStratagy({usernameField: 'email'},admin.authenticate()))
// passport.use(new LocalStratagy({}))
passport.serializeUser(teacher.serializeUser());
passport.deserializeUser(teacher.deserializeUser());
passport.serializeUser(student.serializeUser());
passport.deserializeUser(student.deserializeUser());
const JwtStrategy=require('passport-jwt').Strategy
const ExtractJwt=require('passport-jwt').ExtractJwt
const jwt=require('jsonwebtoken')

// extracting jwt token from signed cookie
var cookieExtractor = function(req) {
    var token = null;
    if (req && req.signedCookies['newtoken'])
    {
        token = req.signedCookies['newtoken'];
    }
    return token;
};

var opts={}
opts.jwtFromRequest=ExtractJwt.fromExtractors([cookieExtractor]);
// opts.jwtFromRequest=ExtractJwt.fromBodyField("token");
// opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET
//payload is the data in token
passport.use('userjwt',new JwtStrategy(opts,(jwt_payload,done)=>{
    var user;
    // console.log(jwt_payload)
    switch(jwt_payload.role){
        case '0':
            user=student;
            break;
        case '1':
            user=teacher;
            break;
        case '2':
            user=admin;
            break;
        default:
            done('Role not defined',false)
    }
    user.findOne({_id:jwt_payload._id},(err,User)=>{
        if (err){
            done(err,false)
        }
        else if(User){
            done(null,User)
        }
        else
            done(null,false)
    })
}))