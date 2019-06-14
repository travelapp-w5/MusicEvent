const axios = require('axios')
let ax = {}
// ax.gitAPI = axios.create({
// 	baseURL:'https://api.github.com',
//     headers: {
//         "Authorization": `token ${process.env.GITHUB_APIKEY}`,
//         "Accept": "application/vnd.github.v3.star+json"
//     }
// })

ax.holidaysAPI = axios.create({
	baseURL:'https://date.nager.at/api/v2'
})

module.exports = ax