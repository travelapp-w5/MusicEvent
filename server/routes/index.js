const router = require('express').Router()
const userRoutes = require('./users')
const musicEventRoutes = require('./musicEvent')
const holidayRoutes = require('./holidays')

router.use('/users', userRoutes)
router.use('/holidays', holidayRoutes)
router.use('/events', musicEventRoutes)

module.exports = router