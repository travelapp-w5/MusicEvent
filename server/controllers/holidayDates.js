
let holidaysAPI = require('../helpers/axios.js').holidaysAPI

class ControllerHolidayDates {
	static getNextPublicHolidays(req, res, next){
		let countryCode = req.body.countryCode || "ID"
		let curDate = new Date()
		return holidaysAPI.get("/NextPublicHolidays/"+countryCode)
			.then(({data}) => {
				return data
				//res.status(200).json(data)
			})
			.catch(next)
	}


	static getHolidays(req, res, next){
		//get weekends
		let curDate = new Date()
		console.log(curDate)

		ControllerHolidayDates.getNextPublicHolidays(req, res, next)
			.then(publicHolidays => {
				// console.log(publicHolidays)
				res.status(200).json(publicHolidays)
			})

	}

	static availableCountries(req, res, next){
		holidaysAPI.get("/availableCountries")
			.then(({data}) => {
				console.log(data)
				res.status(200).json(data)
			})
			.catch(next)	
	}
}

module.exports = ControllerHolidayDates