const createError=require('http-errors')
const JWT=require('jsonwebtoken')
const client = require('./radis_setup')
const passport =require('passport')
exports.signAccessToken= (userId,role)=>{
    return new Promise((resolve, reject) => {
        const payload = {_id:userId,role:role}
        const secret = process.env.ACCESS_TOKEN_SECRET
        const options = {
          expiresIn: '30 days'
        }
        // console.log(options)
        JWT.sign(payload, secret, options, (err, token) => {
          if (err) {
            console.error(err.message)
            reject(createError.InternalServerError(err.message))
            return
          }
          
          client.SET(token,role, 'EX',30 * 24 * 60 * 60 , (err, reply) => {
            if (err) {
              console.log(err.message)
              reject(createError.InternalServerError())
              return
            }
            resolve(token)
          })
        })
    })
}
// NOT USED SO MAY BE WRONG USE WITH CAUTION
exports.verifyAccessToken= (req, res, next) => {
    // if (!req.headers['authorization']) return next(createError.Unauthorized())
    // const authHeader = req.headers['authorization']
    // const bearerToken = authHeader.split(' ')
    // const token = bearerToken[1]
    const token=req.signedCookies['token']
    // console.log('hlo')
    // console.log(token)
    if(token==undefined)
      return next(createError.Unauthorized('Login first'))
    client.GET(token, (err, result) => {
      if (err) {
        console.log(err.message)
        return next(createError.InternalServerError())
      }
      JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        
        if (err) {
          console.log(err)
          const message =
            err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.name==='TokenExpiredError'?'You are logout.Please login again':err.message
          return next(createError.Unauthorized(message))
        }
        passport.authenticate('userjwt',{session:false})(req,res,()=>next())
      })
    })
}
exports.verifyUser=(req,res,next)=>{
  // console.log(req)
    if(req && req.signedCookies['newtoken']==undefined) 
      return next(createError.Unauthorized('Login first'))
    const token = req.signedCookies['newtoken']
    if(token==false)
      return next(createError[401]('Illigal access denied'))
    var role;
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      role=payload.role;
      // console.log(payload)
      // req.user={}
      // req.user.role=payload.role
      if (err) {
        console.log(err)
        const message =
          err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
        return next(createError.Unauthorized(message))
      }
        passport.authenticate('userjwt',{session:false})(req,res,()=>{
          // console.log(role)
          // console.log('login')
          req.role=role
          next()
        })
      })
}
exports.verifyAdmin=(req,res,next)=>{
  // console.log(req.user)
  if(!req || !req.role)
    return next(createError[401]('Unauthorized'))
  // console.log(req.user)
  if(req.role==2)
    return next()
  else
    return next(createError[401]('Unauthorized'))
}
exports.verifyTeacher=(req,res,next)=>{
  // console.log(req.role2)
  if(!req || !req.role)
    return next(createError[401]('Unauthorized'))
  // console.log(req.user.role)
  if(req.role==1)
    return next()
  else
    return next(createError[401]('Unauthorized'))
}