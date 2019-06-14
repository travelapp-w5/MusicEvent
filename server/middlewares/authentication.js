const verifyToken = require('../helpers/verifyToken')
const User = require('../models/users.js')

module.exports = (req,res, next) => {
  if(req.headers.hasOwnProperty('token')) {
    try {
      // Jays
      // var decode = verifyToken(req.headers.token);
      // req.decode = decode
      // next()

      // Max
      const decoded = verifyToken(req.headers.token);
      User.find({ _id: decoded.id })
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