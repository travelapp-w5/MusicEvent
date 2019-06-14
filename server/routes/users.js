const router = require('express').Router()
const ControllerUser = require('../controllers/users')
// /api/users
router.get('/', ControllerUser.findAll)
router.post('/register', ControllerUser.create)
router.post('/login', ControllerUser.login)

const isAuthenticated = require('../middlewares/authentication')
router.post('/addFav/:eventId', isAuthenticated, ControllerUser.addFav)


module.exports = router