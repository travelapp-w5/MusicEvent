
let holidaysAPI = require('../helpers/axios.js').holidaysAPI

class ControllerHolidayDates {
	static getNextPublicHolidays(req, res, next){
		let country = req.body.country.toLowerCase()

		return ControllerHolidayDates.getAvailableCountries(req, res, next)
			.then(countryList => {
				// console.log(countryList)
				//find key from value [{ key: 'VN', value: 'Vietnam' }, ..]
				let countryCode = "ID" //default value
				for(let c of countryList) {
			      if (c.value.toLowerCase().includes(country)) {
			      	countryCode = c.key
			      }
			    }

				// console.log(countryCode)
				return holidaysAPI.get("/NextPublicHolidays/"+countryCode)
			})
			.then(({data}) => {
				// console.log(data)
				return data
				//res.status(200).json(data)
			})
			.catch(next)
	}

	static getDateArray (start, end) {
	  let arr = []
	  let dt = new Date(start)

	  while (dt <= end) {
	    arr.push(new Date(dt));
	    dt.setDate(dt.getDate() + 1);
	  }

	  return arr;
	}

	static nextMonth(){
		return (new Date()).setDate((new Date()).getDate() + 31)
	}

	static getNextMonthDateArray () {
		let startDate = new Date()
		let endDate = ControllerHolidayDates.nextMonth()

 		return ControllerHolidayDates.getDateArray(startDate, endDate)
	}

	static getWeekends(dateArray){
		let weekendDates = []
		dateArray.forEach(dateObj => {
			let isWeekend = dateObj.getDay() % 6 == 0
			if(isWeekend){
				weekendDates.push({date: dateObj, detail: "weekend"})
			}
		})
		return weekendDates
	}

	static getHolidays(req, res, next){
		//get dates for the next month
 		let nextMonthDateArray = ControllerHolidayDates.getNextMonthDateArray()
 		let weekends = ControllerHolidayDates.getWeekends(nextMonthDateArray)

		ControllerHolidayDates.getNextPublicHolidays(req, res, next)
			.then(publicHolidays => {
				let holArray = []
				publicHolidays.forEach(entry => {
					let nextMonth = ControllerHolidayDates.nextMonth()
					let entryDate = new Date(entry.date)
					if (entryDate <= nextMonth){
						holArray.push({date: entryDate, detail: entry.name})
					}
				})
				holArray = holArray.concat(weekends)
				//sort by date
				holArray.sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
				res.status(200).json(holArray)
			})

	}

	static getAvailableCountries(req, res, next){
		return holidaysAPI.get("/availableCountries")
			.then(({data}) => {
				return data
			})
			.catch(next)	
	}

	static availableCountries(req, res, next){
		ControllerHolidayDates.getAvailableCountries(req, res, next)
			.then(data => {
				res.status(200).json(data)
			})
			.catch(next)	
	}
}

module.exports = ControllerHolidayDates