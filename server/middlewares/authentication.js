const verifyToken = require('../helpers/verifyToken')

module.exports = (req,res, next) => {
  if(req.headers.hasOwnProperty('token')) {
    try {
      var decode = verifyToken(req.headers.token);
      req.decode = decode
      next()
    } catch(err) {
      next({status: 400, message: 'you must login first'})
    }
  } else {
    next({status: 400, message: 'you must login first'})
  } 
}