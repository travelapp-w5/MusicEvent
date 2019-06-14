const router = require('express').Router()
const ControllerHolidayDates = require('../controllers/holidayDates')

//goes to /api/holidays
router.get('/countries', ControllerHolidayDates.availableCountries)
router.post('/nextholidays', ControllerHolidayDates.getHolidays)

module.exports = router