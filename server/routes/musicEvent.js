const router = require('express').Router()
const Controller = require('../controllers/events')

router.post('/', Controller.findEvents)

module.exports = router