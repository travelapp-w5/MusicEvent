const verifyToken = require('../helpers/verifyToken')
const User = require('../models/users.js')

module.exports = (req,res, next) => {
  if(req.headers.hasOwnProperty('token')) {
    // console.log("di Authentication")
    try {
      // Jays
      // var decode = verifyToken(req.headers.token);
      // req.decode = decode
      // next()

      // Max
      // console.log("decoding")
      const decoded = verifyToken(req.headers.token);
      // console.log("decoded",decoded)
      User.find({ email: decoded.email })
        .then(users => {
          // console.log("users",users)
          // console.log("decoded",decoded)
          if(users.length > 0) {
            req.userData = decoded;
            next()
          } else {
            next({ status: 403, message: 'Authentication failed' })
          }
        })
        .catch(next)
    } catch(err) {
      next({status: 400, message: 'you must login first'})
    }
  } else {
    next({status: 400, message: 'you must login first'})
  } 
}