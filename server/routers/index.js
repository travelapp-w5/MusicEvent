const router = require('express').Router()
const userRoutes = require('./users')
const travelAppRoutes = require('./travelApps')

router.use('/users')

module.exports = router