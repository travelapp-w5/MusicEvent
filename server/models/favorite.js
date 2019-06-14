const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  displayName: String,
  startDate: String,
  uri: String,
  venue: String,
  city: Number,
  artists: Number,
  currency: Number,
  exchangeRate: Number,
});

module.exports = mongoose.model('Favorite', favoriteSchema);