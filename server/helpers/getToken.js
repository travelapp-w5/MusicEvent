let jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (input) => {
  let token = jwt.sign({
    id: input.id, 
    username: input.username
  }, process.env.JWT_SECRET, {expiresIn: '4h'} )

  return token
}