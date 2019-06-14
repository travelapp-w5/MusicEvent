
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