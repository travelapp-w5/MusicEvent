let jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (input) => {
  console.log(input)
  let token = jwt.sign({
    email: input
  }, process.env.JWT_SECRET )
  return token
}