const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  eventId: String,
  displayName: String,
  startDate: String,
  uri: String,
  venue: String,
  city: String,
  artists: String,
  currency: String,
  exchangeRate: Number,
  isHoliday: Boolean
});

const Favorite = mongoose.model('Favorite',favoriteSchema)

module.exports = Favorite;