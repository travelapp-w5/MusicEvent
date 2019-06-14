const Favorite = require('../models/favorite.js')

class Controller {
  static create(req, res, next) {
    // displayName: String,
    // startDate: String,
    // uri: String,
    // venue: String,
    // city: Number,
    // artists: Number,
    // currency: Number,
    // exchangeRate: Number,
    Favorite.create(req.body)
      .then(fav => {
        console.log("saved 1 favorite")
        res.status(201).json(fav)
      })
      .catch(next)
  }

  static findAll(req, res, next) {
    // Only current users favorites
    Favorite.find({ owner: req.userData.id })
      .exec()
      .then(favs => {
        res.json(favs)
      })
      .catch(next)
  }

  static delete(req, res, next) {
    Favorite.findById(req.params.id)
      .exec()
      .then(fav => {
        if(fav) {
          // Checking ownership
          if(String(fav.owner) === String(req.userData.id)) {
            Favorite.findByIdAndDelete(req.params.id)
              .then(() => {
                console.log("deleted 1 favorite")
                res.status(204).end()
              })
              .catch(next)
          } else {
            res.status(401).json({ msg: 'Not authorized' })
          }
        } else {
          res.status(404).end() // No match found for params.id
        }
      })
  }
}

module.exports = Controller