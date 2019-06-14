let jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (input) => {
  let token = jwt.sign( input , process.env.JWT_SECRET )

  return token
}