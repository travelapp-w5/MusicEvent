const axios = require('axios');
// Exchange rates api url
let exchangeRates = axios.create({
  baseURL: 'https://api.exchangeratesapi.io/',
});
// Songkick api url
let songkick = axios.create({
  baseURL: 'https://api.songkick.com/api/3.0/',
});

const currencies = require('../helpers/currencies')

class Controller {
  // Find events and exchange rate
  static findEvents(req, res, next) {
    // Req body should contain city and country
    let city = req.body.city.toLowerCase()
    let country = req.body.country.toLowerCase()
    let currency, code, rate; // Rate is in relation to IDR
    
    for(let c of currencies) {
      if (c.country.toLowerCase().includes(country)) {
        ({ currency, code } = c)
      }
    }

    exchangeRates.get(`latest?base=${code}`)
      .then(({data}) => {
        rate = Math.round(data.rates.IDR)
        songkick.get(`search/locations.json?query=${city}&apikey=${process.env.SONGKICK_KEY}`)
          .then(({ data }) => {
            let metroArea = data.resultsPage.results.location[0].metroArea.id

            return songkick.get(`metro_areas/${metroArea}/calendar.json?apikey=${process.env.SONGKICK_KEY}`)
          })
          .then(({ data }) => {
            let arr = data.resultsPage.results.event
            let events = arr.map(event => {
              let artists = []
              for(let artist of event.performance) {
                artists.push(artist.displayName)
              }
              artists = artists.join(", ")
              return {
                  eventId: event.id,
                  displayName: event.displayName,
                  startDate: event.start.date,
                  uri: event.uri,
                  venue: event.venue.displayName,
                  city: event.location.city,
                  artists: artists,
                  currency: currency,
                  exchangeRate: rate,
              }
            })
            res.json({ currency, rate, events })
          })
          .catch(next)
      })
      .catch(next)
  }
}

module.exports = Controller;