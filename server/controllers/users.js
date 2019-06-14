const User = require('../models/users')
const Favorite = require('../models/favorite.js')
const comparePassword = require('../helpers/comparePassword')
const getToken = require('../helpers/getToken')
const getPassword = require('../helpers/getPassword')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const compareDate = require('../helpers/compareDate')

class ControllerUser {
  static addFav(req, res, next){
    let userId = req.userData.id
    let input = req.body
    // {
    // "displayName": "namaDisplay",
    // "startDate": "2019-06-01",
    // "uri": "link",
    // "venue": "gbk",
    // "city": "jakartaIndo",
    // "artists": "nameArtist",
    // "currency": "USD",
    // "exchangeRate": 2
    // "holidayList: array of objects {date, detail}"
    // }
    let eventId = req.params.id

    User.findOne({_id: userId})
      .then(found => {
        if (found){
          let favObj = {}
          favObj.owner = found._id
          favObj.eventId = eventId
          favObj.displayName = input.displayName
          favObj.startDate = input.startDate
          favObj.uri = input.uri
          favObj.venue = input.venue
          favObj.city = input.city
          favObj.artists = input.artists
          favObj.currency = input.currency
          favObj.exchangeRate = input.exchangeRate
          favObj.isHoliday = compareDate(input.holidayList, input.startDate)

          return Favorite.create(favObj)

        } else {
          //user not found
          throw new Error("user not found")
        }
      })
      .then(fav => {
        console.log("saved 1 favorite")
        res.status(201).json(fav)
      })
      .catch(next)
  }

  static findAll(req, res, next) {
    User.find()
    .then(result => {
      res.json(result)
    })
    .catch(next)
  }

  static create(req, res, next) {
    console.log('masuk')
    const { email, password } = req.body
    const input = { email, password }
    User.create(input)
    .then(result => {
      res.json(result)
    })
    .catch(next)
  }

  static login(req, res, next) {
    const { email, password } = req.body
    const input = { email, password }
    // console.log(input)
    User.findOne({email: input.email})
    .then(user => {
      if(user){
        let check = comparePassword(user.password, input.password)
        if(check) {
          let token = getToken(email)
          res.json(token)
        } else {
          throw {status: 400, message: 'Wrong email / password'}
        }
      } else {
        throw {status: 400, message: 'Wrong email / password'}
      }
    })
    .catch(next)
  }

  static googleSignin(req, res, next) {
    let newEmail
    let password
    let token
    client
      .verifyIdToken({
        idToken: req.body.idToken,
        audience: process.env.GOOGLE_CLIENT
      })
      .then(ticket => {
        const {email} = ticket.getPayload()
        newEmail = email
        password = getPassword(email)
        token = getToken(email)

        return User.findOne({email: newEmail})
      })
      .then(result => {
        if(result) {
          res.status(200).json({newEmail, token})
        } else {
          return User.create({
            email: newEmail,
            password: password
          })
        }
      })
      .then(() => {
        res.status(200).json({newEmail, token})
      })
      .catch(next)
  }
}

module.exports = ControllerUser